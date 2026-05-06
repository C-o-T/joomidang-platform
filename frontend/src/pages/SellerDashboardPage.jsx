import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './SellerDashboardPage.module.css';

const CATEGORIES = ['막걸리', '청주', '소주', '약주', '기타'];

const EMPTY_PRODUCT = {
    name: '', nameEn: '', nameJa: '', nameZh: '',
    category: '막걸리', price: '', originalPrice: '', discount: 0,
    stock: '', minOrderQuantity: 1,
    alcoholPercentage: '', volumeMl: '',
    brewery: '', breweryEn: '', breweryJa: '', breweryZh: '',
    region: '', regionEn: '',
    heritage: '', heritageEn: '',
    description: '', descriptionEn: '',
    ingredientsEn: '', ingredients: '',
    weightGram: '', customsHsCode: '',
    thumbnailUrl: '',
};

const STATUS_LABEL = { PENDING: '심사중', ACTIVE: '판매중', INACTIVE: '판매중지', REJECTED: '반려' };
const STATUS_CLS   = { PENDING: styles.s_pending, ACTIVE: styles.s_active, INACTIVE: styles.s_inactive, REJECTED: styles.s_rejected };

function SellerStatusBanner({ seller, onGoRegister }) {
    if (!seller) return (
        <div className={styles.no_seller}>
            <p>아직 판매자 등록을 하지 않으셨습니다.</p>
            <button className={styles.cta_btn} onClick={onGoRegister}>판매자 등록 신청하기</button>
        </div>
    );
    if (seller.status === 'PENDING') return (
        <div className={`${styles.status_banner} ${styles.banner_pending}`}>
            <strong>심사 대기 중</strong>
            <p>판매자 심사가 진행 중입니다. 승인 완료 시 상품을 등록하실 수 있습니다. (1~3 영업일 소요)</p>
        </div>
    );
    if (seller.status === 'REJECTED') return (
        <div className={`${styles.status_banner} ${styles.banner_rejected}`}>
            <strong>심사 반려</strong>
            {seller.rejectionReason && <p>사유: {seller.rejectionReason}</p>}
            <p>내용을 수정하여 다시 신청해주세요.</p>
            <button className={styles.cta_btn} onClick={onGoRegister}>재신청하기</button>
        </div>
    );
    if (seller.status === 'SUSPENDED') return (
        <div className={`${styles.status_banner} ${styles.banner_rejected}`}>
            <strong>계정 정지</strong>
            <p>관리자에게 문의해주세요.</p>
        </div>
    );
    return null;
}

function ProductForm({ initial, sellerId, onSave, onCancel }) {
    const [form, setForm] = useState(initial || { ...EMPTY_PRODUCT });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showAdv, setShowAdv] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, sellerId };
            if (form.id) {
                await api.put(`/products/${form.id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            onSave();
        } catch {
            setError('저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const F = ({ label, name, type = 'text', placeholder, required }) => (
        <div className={styles.ff}>
            <label className={styles.fl}>{label}{required && <span className={styles.req}>*</span>}</label>
            <input className={styles.fi} type={type} name={name} value={form[name] || ''}
                onChange={handleChange} placeholder={placeholder} required={required} />
        </div>
    );

    const S = ({ label, name, options }) => (
        <div className={styles.ff}>
            <label className={styles.fl}>{label}</label>
            <select className={styles.fi} name={name} value={form[name] || ''} onChange={handleChange}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );

    const T = ({ label, name, rows = 3, placeholder }) => (
        <div className={styles.ff} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.fl}>{label}</label>
            <textarea className={styles.fi} name={name} value={form[name] || ''}
                onChange={handleChange} rows={rows} placeholder={placeholder}
                style={{ resize: 'vertical' }} />
        </div>
    );

    return (
        <form className={styles.pf_wrap} onSubmit={handleSubmit}>
            <h3 className={styles.pf_title}>{form.id ? '상품 수정' : '새 상품 등록'}</h3>
            <p className={styles.pf_note}>* 필수 항목 입력 후 저장하면 심사 대기(PENDING) 상태로 등록됩니다.</p>

            <div className={styles.pf_section}>
                <p className={styles.section_head}>기본 정보</p>
                <div className={styles.pf_grid}>
                    <F label="상품명 (한국어)" name="name" required placeholder="예: 문배술 25도" />
                    <F label="상품명 (영어)" name="nameEn" placeholder="e.g. Munbaeju 25°" />
                    <S label="카테고리" name="category" options={CATEGORIES} />
                    <F label="도수 (%)" name="alcoholPercentage" type="number" required placeholder="예: 25" />
                    <F label="용량 (ml)" name="volumeMl" type="number" required placeholder="예: 500" />
                    <F label="이미지 URL" name="thumbnailUrl" placeholder="https://..." />
                    <T label="상품 소개 (한국어)" name="description" placeholder="양조장 특징, 맛, 역사 등..." />
                    <T label="상품 소개 (영어)" name="descriptionEn" placeholder="Description in English..." />
                </div>
            </div>

            <div className={styles.pf_section}>
                <p className={styles.section_head}>가격 및 재고</p>
                <div className={styles.pf_grid}>
                    <F label="판매가 (원)" name="price" type="number" required placeholder="예: 35000" />
                    <F label="정가 (원, 할인 전)" name="originalPrice" type="number" placeholder="예: 40000" />
                    <F label="할인율 (%)" name="discount" type="number" placeholder="예: 10" />
                    <F label="재고 수량" name="stock" type="number" required placeholder="예: 100" />
                    <F label="최소 주문 수량" name="minOrderQuantity" type="number" placeholder="기본: 1" />
                </div>
            </div>

            <div className={styles.pf_section}>
                <p className={styles.section_head}>양조장 및 원산지</p>
                <div className={styles.pf_grid}>
                    <F label="양조장 (한국어)" name="brewery" placeholder="예: 문배주양조원" />
                    <F label="양조장 (영어)" name="breweryEn" placeholder="e.g. Munbaeju Brewery" />
                    <F label="양조장 (일본어)" name="breweryJa" placeholder="예: 文倍酒醸造院" />
                    <F label="양조장 (중국어)" name="breweryZh" placeholder="예: 文倍酒酿造院" />
                    <F label="원산지 (한국어)" name="region" placeholder="예: 서울특별시 은평구" />
                    <F label="원산지 (영어)" name="regionEn" placeholder="e.g. Eunpyeong-gu, Seoul" />
                    <F label="무형문화재 지정 (한국어)" name="heritage" placeholder="예: 서울 무형문화재 제7호" />
                    <F label="무형문화재 지정 (영어)" name="heritageEn" placeholder="e.g. Seoul Intangible Cultural Heritage No.7" />
                </div>
            </div>

            <button type="button" className={styles.adv_toggle} onClick={() => setShowAdv(v => !v)}>
                {showAdv ? '▲ 수출 통관 정보 접기' : '▼ 수출 통관 정보 펼치기 (선택)'}
            </button>

            {showAdv && (
                <div className={styles.pf_section}>
                    <p className={styles.section_head}>수출 통관 정보</p>
                    <div className={styles.pf_grid}>
                        <F label="원재료 (영어)" name="ingredientsEn" placeholder="e.g. rice, water, nuruk" />
                        <F label="원재료 (한국어)" name="ingredients" placeholder="예: 쌀, 물, 누룩" />
                        <F label="무게 (g)" name="weightGram" type="number" placeholder="예: 850" />
                        <F label="HS Code" name="customsHsCode" placeholder="예: 2206000000" />
                        <F label="상품명 (일본어)" name="nameJa" placeholder="예: 文倍酒 25度" />
                        <F label="상품명 (중국어)" name="nameZh" placeholder="예: 文倍酒 25度" />
                    </div>
                </div>
            )}

            {error && <p className={styles.pf_error}>{error}</p>}
            <div className={styles.pf_actions}>
                <button type="button" className={styles.cancel_btn} onClick={onCancel}>취소</button>
                <button type="submit" className={styles.save_btn} disabled={saving}>
                    {saving ? '저장 중...' : (form.id ? '수정 저장' : '상품 등록')}
                </button>
            </div>
        </form>
    );
}

function SellerDashboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [seller, setSeller]   = useState(undefined); // undefined=loading, null=none
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        loadSeller();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadSeller = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/sellers/user/${user.id}`);
            setSeller(res.data);
            if (res.data?.status === 'APPROVED') {
                loadProducts(res.data.id);
            }
        } catch {
            setSeller(null);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async (sellerId) => {
        try {
            const res = await api.get(`/products/seller/${sellerId}`);
            setProducts(res.data || []);
        } catch {
            setProducts([]);
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditProduct(null);
        if (seller?.id) loadProducts(seller.id);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('상품을 삭제하시겠습니까?')) return;
        await api.delete(`/products/${productId}`);
        if (seller?.id) loadProducts(seller.id);
    };

    if (loading) return <div className={styles.loading}>불러오는 중...</div>;

    return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <div className={styles.page_header}>
                    <h1 className={styles.page_title}>판매자 대시보드</h1>
                    {seller && (
                        <p className={styles.seller_name}>{seller.breweryName}</p>
                    )}
                </div>

                <SellerStatusBanner
                    seller={seller === undefined ? null : seller}
                    onGoRegister={() => navigate('/seller/register')}
                />

                {seller?.status === 'APPROVED' && (
                    <>
                        <div className={styles.product_header}>
                            <h2 className={styles.section_title}>내 상품 목록 ({products.length})</h2>
                            {!showForm && (
                                <button className={styles.add_btn}
                                    onClick={() => { setEditProduct(null); setShowForm(true); }}>
                                    + 새 상품 등록
                                </button>
                            )}
                        </div>

                        {showForm && (
                            <ProductForm
                                initial={editProduct}
                                sellerId={seller.id}
                                onSave={handleSave}
                                onCancel={() => { setShowForm(false); setEditProduct(null); }}
                            />
                        )}

                        {products.length === 0 && !showForm ? (
                            <div className={styles.empty}>
                                <p>등록된 상품이 없습니다.</p>
                                <button className={styles.cta_btn}
                                    onClick={() => { setEditProduct(null); setShowForm(true); }}>
                                    첫 상품 등록하기
                                </button>
                            </div>
                        ) : (
                            <div className={styles.product_table}>
                                <div className={styles.pt_head}>
                                    <span>상품명</span>
                                    <span>카테고리</span>
                                    <span>가격</span>
                                    <span>재고</span>
                                    <span>상태</span>
                                    <span>관리</span>
                                </div>
                                {products.map(p => (
                                    <div key={p.id} className={styles.pt_row}>
                                        <span className={styles.pt_name}>{p.name}</span>
                                        <span>{p.category}</span>
                                        <span>₩{Number(p.price).toLocaleString()}</span>
                                        <span>{p.stock}</span>
                                        <span>
                                            <span className={`${styles.status_badge} ${STATUS_CLS[p.status]}`}>
                                                {STATUS_LABEL[p.status] || p.status}
                                            </span>
                                        </span>
                                        <span className={styles.pt_actions}>
                                            <button className={styles.edit_btn}
                                                onClick={() => { setEditProduct(p); setShowForm(true); }}>
                                                수정
                                            </button>
                                            <button className={styles.del_btn}
                                                onClick={() => handleDelete(p.id)}>
                                                삭제
                                            </button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SellerDashboardPage;
