import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { useGeo } from '../context/GeoContext';
import { TARGET_COUNTRIES } from '../i18n/countries';
import { getCurrency, formatPrice } from '../utils/currency';

function OrderPage() {
    const { t, lang, country } = useGeo();
    const { state } = useLocation();
    const navigate = useNavigate();

    const items    = state?.items    || [];
    const fromCart = state?.fromCart || false;

    const [form, setForm] = useState({
        receiverName:    '',
        receiverPhone:   '',
        shippingZip:     '',
        shippingAddress: '',
        shippingCountry: country || '',
        consumerMemo:    '',
    });

    useEffect(() => {
        if (country && !form.shippingCountry) {
            setForm(prev => ({ ...prev, shippingCountry: country }));
        }
    }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (items.length === 0) navigate('/cart');
    }, [items, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 배송 국가 기준 통화 (선택 변경 시 실시간 반영)
    const { code: currencyCode, rate } = getCurrency(form.shippingCountry || country);

    // KRW 기준 합계 (백엔드 저장 및 환산의 기준)
    const productPriceKRW = items.reduce(
        (sum, item) => sum + (Number(item.price) * item.quantity), 0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) { navigate('/login'); return; }

        try {
            const targetCountry = form.shippingCountry || country;
            const { code: cur, rate: r } = getCurrency(targetCountry);

            const orderItems = items.map(item => ({
                productId:    item.productId,
                sellerId:     item.sellerId || 0,
                quantity:     item.quantity,
                priceAtOrder: Number(item.price) * r,  // 주문 시점 현지통화 가격
                currency:     cur,
            }));

            await api.post('/orders', {
                ...form,
                userId:       user.id,
                sellerId:     items[0]?.sellerId || 0,
                productPrice: productPriceKRW * r,
                totalPrice:   productPriceKRW * r,
                currency:     cur,
                exchangeRate: r,
                items:        orderItems,
            });

            if (fromCart) {
                await api.delete(`/cart/user/${user.id}`);
            }

            alert(t.order_success);
            navigate('/');
        } catch {
            alert(t.order_fail);
        }
    };

    return (
        <div style={pageStyles.container}>
            <div style={pageStyles.box}>
                <h2 style={pageStyles.title}>{t.order_title}</h2>

                {/* 주문 상품 요약 — 배송 국가에 맞는 현지통화로 표시 */}
                <div style={pageStyles.summaryBox}>
                    {items.map((item, idx) => (
                        <div key={idx} style={pageStyles.summaryRow}>
                            <span>{item.productName}</span>
                            <span>
                                × {item.quantity}&nbsp;·&nbsp;
                                {formatPrice(Number(item.price) * item.quantity, form.shippingCountry || country)}
                            </span>
                        </div>
                    ))}
                    <div style={pageStyles.totalRow}>
                        {t.cart_total(formatPrice(productPriceKRW, form.shippingCountry || country))}
                        {currencyCode !== 'KRW' && (
                            <span style={{ color: '#aaa', fontWeight: 400, fontSize: '13px' }}>
                                &nbsp;(₩{Number(productPriceKRW).toLocaleString()})
                            </span>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={pageStyles.label}>{t.order_receiver}</label>
                    <input style={pageStyles.input} name="receiverName"
                        value={form.receiverName} onChange={handleChange} required />

                    <label style={pageStyles.label}>{t.order_phone}</label>
                    <input style={pageStyles.input} name="receiverPhone"
                        value={form.receiverPhone} onChange={handleChange} required />

                    <label style={pageStyles.label}>{t.order_country}</label>
                    <select style={pageStyles.input} name="shippingCountry"
                        value={form.shippingCountry} onChange={handleChange} required>
                        <option value="">{t.order_country_ph}</option>
                        {TARGET_COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.flag} {c.name[lang] || c.name['en']} ({c.code})
                            </option>
                        ))}
                    </select>

                    <label style={pageStyles.label}>{t.order_zip}</label>
                    <input style={pageStyles.input} name="shippingZip"
                        value={form.shippingZip} onChange={handleChange} required />

                    <label style={pageStyles.label}>{t.order_address}</label>
                    <input style={pageStyles.input} name="shippingAddress"
                        value={form.shippingAddress} onChange={handleChange} required />

                    <label style={pageStyles.label}>{t.order_memo}</label>
                    <input style={pageStyles.input} name="consumerMemo"
                        placeholder={t.order_memo_ph} value={form.consumerMemo} onChange={handleChange} />

                    <button style={pageStyles.button} type="submit">{t.order_btn}</button>
                </form>
            </div>
        </div>
    );
}

const pageStyles = {
    container: { display: 'flex', justifyContent: 'center', padding: '40px' },
    box: { width: '480px', padding: '40px', border: '1px solid #ddd', borderRadius: '8px' },
    title: { marginBottom: '24px' },
    summaryBox: {
        background: '#f9f9f9', borderRadius: '6px',
        padding: '16px', marginBottom: '24px', fontSize: '14px',
    },
    summaryRow: {
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '8px', color: '#555',
    },
    totalRow: {
        borderTop: '1px solid #eee', paddingTop: '10px',
        marginTop: '4px', fontWeight: '600', textAlign: 'right', color: '#1a1a1a',
    },
    label:  { display: 'block', marginBottom: '4px', fontSize: '14px', color: '#555' },
    input: {
        display: 'block', width: '100%', padding: '10px', marginBottom: '16px',
        border: '1px solid #ddd', borderRadius: '4px',
        boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit',
    },
    button: {
        width: '100%', padding: '12px', backgroundColor: '#333',
        color: '#fff', border: 'none', borderRadius: '4px',
        cursor: 'pointer', fontSize: '15px',
    },
};

export default OrderPage;
