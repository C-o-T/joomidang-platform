import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useGeo } from '../context/GeoContext';
import { getProductName } from '../i18n/countries';
import { DUMMY_PRODUCTS, getField } from '../hooks/useProducts';
import { getThemeForCountry } from '../i18n/themes';
import { formatPrice } from '../utils/currency';
import styles from './ProductDetailPage.module.css';

// lang에 맞는 테이스팅 노트 객체 반환
function getTasting(p, lang) {
    const key = { ko: 'tastingKo', ja: 'tastingJa', zh: 'tastingZh' }[lang] || 'tastingEn';
    return p?.[key] || p?.tastingEn || null;
}

// lang에 맞는 페어링 배열 반환
function getPairing(p, lang) {
    return (lang === 'ko' ? p?.pairing : p?.pairingEn) || p?.pairing || [];
}

// 국가별 UI 레이블 (RCA: 각국 사용자에게 친숙한 용어 사용)
const LABELS = {
    brewery: { ko: '양조장', ja: '蔵元', zh: '酒庄',   en: 'Brewery'     },
    region:  { ko: '산지',   ja: '産地', zh: '产地',   en: 'Region'      },
    tasting: { ko: '테이스팅 노트', ja: 'テイスティングノート', zh: '品酒笔记', en: 'Tasting Notes' },
    ingr:    { ko: '원재료', ja: '原材料', zh: '原料',  en: 'Ingredients' },
    pair:    { ko: '추천 페어링', ja: 'フードペアリング', zh: '食物搭配', en: 'Food Pairings' },
};

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const { t, lang, country } = useGeo();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(() => {
                // 백엔드 미연결 시 DUMMY 데이터로 폴백
                const dummy = DUMMY_PRODUCTS.find(p => p.id === parseInt(id));
                setProduct(dummy || null);
            });
    }, [id]);

    const addToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            alert(t.detail_login_required);
            navigate('/login');
            return;
        }
        try {
            await api.post('/cart', { productId: product.id, quantity: 1, userId: user.id });
            alert(t.detail_cart_success);
        } catch {
            alert(t.detail_login_required);
        }
    };

    if (!product) return <p className={styles.loading}>{t.loading}</p>;

    const L = (key) => LABELS[key]?.[lang] || LABELS[key]?.en;

    const tasting     = getTasting(product, lang);
    const heritage    = lang === 'ko' ? product.heritage    : (product.heritageEn    || product.heritage);
    const ingredients = lang === 'ko' ? product.ingredients : (product.ingredientsEn || product.ingredients);
    const pairing     = getPairing(product, lang);
    const brewery     = getField(product, 'brewery', lang);
    const region      = lang === 'ko' ? product.region : (product.regionEn || product.region);

    // US/EU 테마에서만 서양 주종 비교 표시 (Flaviar / Whisky Exchange RCA)
    const theme      = getThemeForCountry(country);
    const showBridge = (theme === 'us' || theme === 'eu') && product.bridgeEn;

    return (
        <div className={styles.page}>
            <button className={styles.back_btn} onClick={() => navigate(-1)}>
                {t.detail_back}
            </button>

            {/* ── 메인 상품 카드 ────────────────────────────────── */}
            <div className={styles.main_card}>
                <div className={styles.img_area}>
                    <div className={styles.img_placeholder}>🍶</div>
                </div>

                <div className={styles.info_area}>
                    {heritage && (
                        <div className={styles.heritage_badge}>{heritage}</div>
                    )}
                    <p className={styles.category_badge}>{product.category}</p>
                    <h1 className={styles.product_name}>{getProductName(product, lang)}</h1>

                    <div className={styles.price_row}>
                        <span className={styles.price}>{formatPrice(product.price, country)}</span>
                        {(product.discount || 0) > 0 && (
                            <>
                                <span className={styles.orig_price}>{formatPrice(product.originalPrice, country)}</span>
                                <span className={styles.discount_badge}>-{product.discount}%</span>
                            </>
                        )}
                    </div>

                    <div className={styles.meta_row}>
                        {brewery && (
                            <div className={styles.meta_item}>
                                <span className={styles.meta_label}>{L('brewery')}</span>
                                <span className={styles.meta_val}>{brewery}</span>
                            </div>
                        )}
                        {region && (
                            <div className={styles.meta_item}>
                                <span className={styles.meta_label}>{L('region')}</span>
                                <span className={styles.meta_val}>{region}</span>
                            </div>
                        )}
                        <div className={styles.meta_item}>
                            <span className={styles.meta_label}>{t.detail_degree}</span>
                            <span className={styles.meta_val}>{product.alcoholPercentage}{t.degree}</span>
                        </div>
                        <div className={styles.meta_item}>
                            <span className={styles.meta_label}>{t.detail_volume}</span>
                            <span className={styles.meta_val}>{product.volumeMl}{t.volume_unit}</span>
                        </div>
                    </div>

                    <div className={styles.btn_row}>
                        <button className={styles.cart_btn} onClick={addToCart}>
                            {t.detail_cart}
                        </button>
                        <button className={styles.order_btn} onClick={() => navigate('/order', {
                            state: {
                                items: [{
                                    productId: product.id,
                                    sellerId: product.sellerId || 0,
                                    quantity: 1,
                                    productName: getProductName(product, lang),
                                    price: product.price,
                                }],
                                fromCart: false,
                            }
                        })}>
                            {t.detail_buy}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── 테이스팅 노트 ─────────────────────────────────── */}
            {tasting && (
                <section className={styles.section}>
                    <h2 className={styles.section_title}>{L('tasting')}</h2>
                    <div className={styles.tasting_grid}>
                        <div className={styles.tasting_card}>
                            <p className={styles.tc_label}>Nose</p>
                            <p className={styles.tc_val}>{tasting.nose}</p>
                        </div>
                        <div className={styles.tasting_card}>
                            <p className={styles.tc_label}>Palate</p>
                            <p className={styles.tc_val}>{tasting.palate}</p>
                        </div>
                        <div className={styles.tasting_card}>
                            <p className={styles.tc_label}>Finish</p>
                            <p className={styles.tc_val}>{tasting.finish}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 원재료 ───────────────────────────────────────── */}
            {ingredients && (
                <section className={styles.section}>
                    <h2 className={styles.section_title}>{L('ingr')}</h2>
                    <p className={styles.ingredients_text}>{ingredients}</p>
                </section>
            )}

            {/* ── 음식 페어링 ──────────────────────────────────── */}
            {pairing.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.section_title}>{L('pair')}</h2>
                    <div className={styles.pairing_chips}>
                        {pairing.map((item, i) => (
                            <span key={i} className={styles.pairing_chip}>{item}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* ── 서양 주종 비교 (US/EU 테마 한정) ────────────── */}
            {showBridge && (
                <section className={styles.bridge_section}>
                    <p className={styles.bridge_label}>If you enjoy...</p>
                    <p className={styles.bridge_text}>{product.bridgeEn}</p>
                </section>
            )}
        </div>
    );
}

export default ProductDetailPage;
