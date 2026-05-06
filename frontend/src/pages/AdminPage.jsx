import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './AdminPage.module.css';

const SELLER_STATUS = { PENDING: '심사대기', APPROVED: '승인', REJECTED: '반려', SUSPENDED: '정지' };
const PRODUCT_STATUS = { PENDING: '심사대기', ACTIVE: '판매중', INACTIVE: '판매중지', REJECTED: '반려' };

function AdminPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const [tab, setTab] = useState('sellers');
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectInput, setRejectInput] = useState({}); // { [id]: string }
    const [rejectOpen, setRejectOpen] = useState({});   // { [id]: boolean }

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') { navigate('/'); return; }
        loadAll();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAll = async () => {
        setLoading(true);
        try {
            const [selRes, prRes] = await Promise.all([
                api.get('/sellers'),
                api.get('/products/admin'),
            ]);
            setSellers(selRes.data || []);
            setProducts(prRes.data || []);
        } finally {
            setLoading(false);
        }
    };

    // ── Seller actions ──────────────────────────────
    const approveSeller = async (id) => {
        await api.put(`/sellers/${id}/status`, { status: 'APPROVED' });
        loadAll();
    };
    const rejectSeller = async (id) => {
        const reason = rejectInput[id] || '';
        await api.put(`/sellers/${id}/status`, { status: 'REJECTED', rejectionReason: reason });
        setRejectOpen(o => ({ ...o, [id]: false }));
        loadAll();
    };

    // ── Product actions ─────────────────────────────
    const activateProduct = async (id) => {
        await api.patch(`/products/${id}/status`, { status: 'ACTIVE' });
        loadAll();
    };
    const rejectProduct = async (id) => {
        await api.patch(`/products/${id}/status`, { status: 'REJECTED' });
        loadAll();
    };
    const deactivateProduct = async (id) => {
        await api.patch(`/products/${id}/status`, { status: 'INACTIVE' });
        loadAll();
    };

    if (loading) return <div className={styles.loading}>불러오는 중...</div>;

    const pendingSellers  = sellers.filter(s => s.status === 'PENDING');
    const pendingProducts = products.filter(p => p.status === 'PENDING');

    return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <div className={styles.page_header}>
                    <h1 className={styles.page_title}>관리자 패널</h1>
                    <p className={styles.sub}>판매자 심사 및 상품 승인을 처리합니다.</p>
                </div>

                {/* 탭 */}
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${tab === 'sellers' ? styles.tab_active : ''}`}
                        onClick={() => setTab('sellers')}>
                        판매자 심사
                        {pendingSellers.length > 0 && (
                            <span className={styles.badge}>{pendingSellers.length}</span>
                        )}
                    </button>
                    <button className={`${styles.tab} ${tab === 'products' ? styles.tab_active : ''}`}
                        onClick={() => setTab('products')}>
                        상품 승인
                        {pendingProducts.length > 0 && (
                            <span className={styles.badge}>{pendingProducts.length}</span>
                        )}
                    </button>
                </div>

                {/* ── 판매자 심사 탭 ── */}
                {tab === 'sellers' && (
                    <div className={styles.section}>
                        {sellers.length === 0 ? (
                            <p className={styles.empty}>신청된 판매자가 없습니다.</p>
                        ) : (
                            sellers.map(s => (
                                <div key={s.id} className={styles.card}>
                                    <div className={styles.card_top}>
                                        <div>
                                            <p className={styles.card_title}>{s.breweryName}</p>
                                            <p className={styles.card_meta}>
                                                대표자: {s.representativeName} · 사업자: {s.businessNumber}
                                            </p>
                                            <p className={styles.card_meta}>
                                                연락처: {s.contactPhone} · {s.contactEmail}
                                            </p>
                                            <p className={styles.card_meta}>
                                                신청일: {s.createdAt?.substring(0, 10)}
                                            </p>
                                        </div>
                                        <span className={`${styles.s_badge} ${styles['sb_' + s.status?.toLowerCase()]}`}>
                                            {SELLER_STATUS[s.status] || s.status}
                                        </span>
                                    </div>

                                    {s.status === 'PENDING' && (
                                        <div className={styles.card_actions}>
                                            <button className={styles.approve_btn}
                                                onClick={() => approveSeller(s.id)}>
                                                승인
                                            </button>
                                            {!rejectOpen[s.id] ? (
                                                <button className={styles.reject_btn}
                                                    onClick={() => setRejectOpen(o => ({ ...o, [s.id]: true }))}>
                                                    반려
                                                </button>
                                            ) : (
                                                <div className={styles.reject_box}>
                                                    <input className={styles.reject_input}
                                                        placeholder="반려 사유 입력..."
                                                        value={rejectInput[s.id] || ''}
                                                        onChange={e => setRejectInput(r => ({ ...r, [s.id]: e.target.value }))}
                                                    />
                                                    <button className={styles.reject_confirm}
                                                        onClick={() => rejectSeller(s.id)}>
                                                        반려 확인
                                                    </button>
                                                    <button className={styles.cancel_sm}
                                                        onClick={() => setRejectOpen(o => ({ ...o, [s.id]: false }))}>
                                                        취소
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {s.rejectionReason && (
                                        <p className={styles.rejection_reason}>반려 사유: {s.rejectionReason}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── 상품 승인 탭 ── */}
                {tab === 'products' && (
                    <div className={styles.section}>
                        {products.length === 0 ? (
                            <p className={styles.empty}>등록된 상품이 없습니다.</p>
                        ) : (
                            <div className={styles.product_table}>
                                <div className={styles.pt_head}>
                                    <span>상품명</span>
                                    <span>카테고리</span>
                                    <span>가격</span>
                                    <span>판매자ID</span>
                                    <span>상태</span>
                                    <span>관리</span>
                                </div>
                                {products.map(p => (
                                    <div key={p.id} className={styles.pt_row}>
                                        <span className={styles.pt_name}>{p.name}</span>
                                        <span>{p.category}</span>
                                        <span>₩{Number(p.price).toLocaleString()}</span>
                                        <span>{p.sellerId}</span>
                                        <span>
                                            <span className={`${styles.p_badge} ${styles['pb_' + p.status?.toLowerCase()]}`}>
                                                {PRODUCT_STATUS[p.status] || p.status}
                                            </span>
                                        </span>
                                        <span className={styles.pt_actions}>
                                            {p.status === 'PENDING' && (
                                                <>
                                                    <button className={styles.approve_btn}
                                                        onClick={() => activateProduct(p.id)}>승인</button>
                                                    <button className={styles.reject_btn}
                                                        onClick={() => rejectProduct(p.id)}>반려</button>
                                                </>
                                            )}
                                            {p.status === 'ACTIVE' && (
                                                <button className={styles.deact_btn}
                                                    onClick={() => deactivateProduct(p.id)}>판매중지</button>
                                            )}
                                            {p.status === 'INACTIVE' && (
                                                <button className={styles.approve_btn}
                                                    onClick={() => activateProduct(p.id)}>재활성화</button>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
