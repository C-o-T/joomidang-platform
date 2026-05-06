import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useGeo } from '../context/GeoContext';
import { formatPrice } from '../utils/currency';

function getItemName(item, lang) {
    if (lang === 'ja') return item.nameJa || item.nameEn || item.productName;
    if (lang === 'zh') return item.nameZh || item.nameEn || item.productName;
    if (lang === 'en') return item.nameEn || item.productName;
    return item.productName;
}

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const { t, lang, country } = useGeo();

    //컴포넌트가 마운트되면 localStorage에서 userId를 읽어 장바구니 목록을 받아옴
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        //로그인 안 된 경우 로그인 페이지로 이동
        if (!user) {
            navigate('/login');
            return;
        }
        api.get(`/cart/user/${user.id}`)
            .then(res => setCartItems(res.data))
            .catch(err => console.error(err));
    }, [navigate]);

    //장바구니 상품 삭제 - 삭제 후 로컬 state에서도 해당 항목 제거
    const deleteItem = async (id) => {
        await api.delete(`/cart/${id}`);
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    //수량 변경 - 1 미만이면 삭제, 이상이면 API 호출 후 로컬 state 업데이트
    const changeQuantity = async (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) {
            await deleteItem(item.id);
            return;
        }
        await api.put(`/cart/${item.id}`, { quantity: newQty });
        setCartItems(cartItems.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));
    };

    //전체 합계 금액 계산 (가격 × 수량의 합)
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div style={pageStyles.container}>
            <h2>{t.cart_title}</h2>
            {cartItems.length === 0 ? (
                <p>{t.cart_empty}</p>
            ) : (
                <>
                    <table style={pageStyles.table}>
                        <thead>
                            <tr>
                                <th>{t.cart_product}</th>
                                <th>{t.cart_qty}</th>
                                <th>{t.cart_price}</th>
                                <th>{t.cart_delete}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>{getItemName(item, lang)}</td>
                                    <td>
                                        <div style={pageStyles.qtyRow}>
                                            <button style={pageStyles.qtyBtn} onClick={() => changeQuantity(item, -1)}>−</button>
                                            <span style={pageStyles.qtyNum}>{item.quantity}</span>
                                            <button style={pageStyles.qtyBtn} onClick={() => changeQuantity(item, +1)}>+</button>
                                        </div>
                                    </td>
                                    <td>{formatPrice(item.price * item.quantity, country)}</td>
                                    <td>
                                        <button style={pageStyles.deleteBtn} onClick={() => deleteItem(item.id)}>{t.cart_delete}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={pageStyles.footer}>
                        <p style={pageStyles.total}>{t.cart_total(formatPrice(total, country))}</p>
                        {/* 장바구니 상품 목록과 fromCart 플래그를 OrderPage에 전달 */}
                        <button style={pageStyles.orderBtn} onClick={() => navigate('/order', {
                            state: {
                                items: cartItems.map(item => ({ ...item, productName: getItemName(item, lang) })),
                                fromCart: true,
                            }
                        })}>
                            {t.cart_order_btn}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const pageStyles = {
    container: { padding: '32px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    footer: { marginTop: '24px', textAlign: 'right' },
    total: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    qtyBtn: {
        width: '28px', height: '28px', border: '1px solid #ccc',
        background: '#f5f5f5', cursor: 'pointer', borderRadius: '4px',
        fontSize: '16px', lineHeight: 1,
    },
    qtyNum: { minWidth: '24px', textAlign: 'center', fontSize: '15px' },
    deleteBtn: {
        padding: '4px 10px', border: '1px solid #ddd',
        background: 'none', cursor: 'pointer', borderRadius: '4px',
        color: '#888', fontSize: '13px',
    },
    orderBtn: {
        padding: '12px 32px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '15px',
    },
};

export default CartPage;
