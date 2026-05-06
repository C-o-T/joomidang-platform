// SEA 테마 - Shopee(쇼피) / Lazada 스타일
// 구조: 바우처 수령 배너 / 오렌지 히어로 / 카테고리 아이콘 / 플래시세일 진행바 / 코인 배지 상품 그리드
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES, getStat } from '../../hooks/useProducts';
import styles from './MainPageSEA.module.css';
import CountryLangToggle from '../../components/CountryLangToggle';

function useCountdown(target) {
    const [left, setLeft] = useState(Math.max(0, target - Date.now()));
    useEffect(() => {
        const t = setInterval(() => setLeft(l => Math.max(0, l - 1000)), 1000);
        return () => clearInterval(t);
    }, []);
    const h = String(Math.floor(left / 3600000)).padStart(2, '0');
    const m = String(Math.floor((left % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
    return { h, m, s };
}

const CAT_ICONS = [
    { icon: '🍶', label: 'Makgeolli' },
    { icon: '🥃', label: 'Soju' },
    { icon: '🍺', label: 'Beer' },
    { icon: '🌾', label: 'Rice Wine' },
    { icon: '🎁', label: 'Gift Set' },
    { icon: '🍵', label: 'Herbal' },
    { icon: '🏺', label: 'Premium' },
    { icon: '🔥', label: 'Hot Deals' },
    { icon: '🆕', label: 'New In' },
    { icon: '🪙', label: 'Earn Coins' },
];

const VOUCHERS = [
    { type: 'FREE', desc: 'Free Shipping', min: '₩20,000', emoji: '🚚' },
    { type: '10%', desc: '10% Off', min: '₩50,000', emoji: '🎫' },
    { type: '₩5K', desc: '₩5,000 Off', min: '₩30,000', emoji: '💸' },
];

function MainPageSEA() {
    const navigate = useNavigate();
    const { t, lang } = useGeo();
    const { products, filtered, selectedCategory } = useProducts();
    const [claimed, setClaimed] = useState({});

    const flashEnd = Date.now() + 2 * 3600000 + 44 * 60000 + 33000;
    const { h, m, s } = useCountdown(flashEnd);

    const flashProducts = products.filter(p => (p.discount || 0) > 0);
    const hotProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0));

    return (
        <div className={styles.wrapper}>

            {/* ── 국가/언어 선택 ── */}
            <div className={styles.geo_bar}><CountryLangToggle variant="light" /></div>

            {/* ── 바우처 수령 배너 ──────────────────────────────── */}
            <div className={styles.voucher_strip}>
                <div className={styles.vs_inner}>
                    <span className={styles.vs_title}>🎁 CLAIM FREE VOUCHERS</span>
                    <div className={styles.voucher_list}>
                        {VOUCHERS.map(v => (
                            <div key={v.type}
                                className={`${styles.voucher_card} ${claimed[v.type] ? styles.claimed : ''}`}>
                                <span className={styles.vc_emoji}>{v.emoji}</span>
                                <div className={styles.vc_info}>
                                    <p className={styles.vc_type}>{v.type}</p>
                                    <p className={styles.vc_desc}>{v.desc}</p>
                                    <p className={styles.vc_min}>Min. {v.min}</p>
                                </div>
                                <button
                                    className={`${styles.vc_btn} ${claimed[v.type] ? styles.vc_claimed : ''}`}
                                    onClick={() => setClaimed(c => ({ ...c, [v.type]: true }))}>
                                    {claimed[v.type] ? '✓ Claimed' : 'Claim'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className={styles.vs_more} onClick={() => navigate('/join')}>
                        More Vouchers →
                    </button>
                </div>
            </div>

            {/* ── 히어로 ─────────────────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.hero_left}>
                    <div className={styles.hero_badge_row}>
                        <span className={styles.hero_badge_shopee}>Shopee</span>
                        <span className={styles.hero_badge_new}>🆕 New Arrivals</span>
                    </div>
                    <h1 className={styles.hero_title}>{t.hero_title}</h1>
                    <p className={styles.hero_desc}>{t.hero_desc}</p>
                    <div className={styles.hero_coins}>
                        <span className={styles.coin_icon}>🪙</span>
                        <span className={styles.coin_text}>Earn up to <strong>+500 Coins</strong> per order</span>
                    </div>
                    <div className={styles.hero_btns}>
                        <button className={styles.hero_btn_main} onClick={() => navigate('/join')}>
                            Shop Now
                        </button>
                        <button className={styles.hero_btn_ghost} onClick={() => navigate('/')}>
                            Explore All
                        </button>
                    </div>
                </div>
                <div className={styles.hero_right}>
                    <div className={styles.hero_stats_grid}>
                        <div className={styles.hsg_item}>
                            <p className={styles.hsg_val}>{products.length}+</p>
                            <p className={styles.hsg_label}>Products</p>
                        </div>
                        <div className={styles.hsg_item}>
                            <p className={styles.hsg_val}>Free</p>
                            <p className={styles.hsg_label}>Shipping</p>
                        </div>
                        <div className={styles.hsg_item}>
                            <p className={styles.hsg_val}>4.8★</p>
                            <p className={styles.hsg_label}>Rating</p>
                        </div>
                        <div className={styles.hsg_item}>
                            <p className={styles.hsg_val}>24h</p>
                            <p className={styles.hsg_label}>Support</p>
                        </div>
                    </div>
                    <div className={styles.hero_promo_box}>
                        <p className={styles.hpb_top}>🔥 Limited Offer</p>
                        <p className={styles.hpb_val}>Get 15% OFF</p>
                        <p className={styles.hpb_sub}>First order only · Use code: <strong>JOOMIDANG</strong></p>
                    </div>
                </div>
            </section>

            {/* ── 카테고리 아이콘 바 ──────────────────────────────── */}
            <section className={styles.cat_sec}>
                <div className={styles.cat_grid}>
                    {CAT_ICONS.map((c, i) => {
                        const cat = CATEGORIES[i] || '전체';
                        return (
                            <div key={c.label} className={styles.cat_item}
                                onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                                <div className={styles.cat_circle}>{c.icon}</div>
                                <p className={styles.cat_label}>{c.label}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── 플래시세일 ─────────────────────────────────────── */}
            {flashProducts.length > 0 && (
                <section className={styles.flash_sec}>
                    <div className={styles.flash_header}>
                        <div className={styles.fh_left}>
                            <span className={styles.fh_label}>⚡</span>
                            <span className={styles.fh_title}>Flash Sale</span>
                        </div>
                        <div className={styles.fh_cd}>
                            <span className={styles.cd_box}>{h}</span>
                            <span className={styles.cd_sep}>:</span>
                            <span className={styles.cd_box}>{m}</span>
                            <span className={styles.cd_sep}>:</span>
                            <span className={styles.cd_box}>{s}</span>
                        </div>
                        <button className={styles.fh_all} onClick={() => navigate('/')}>See All &gt;</button>
                    </div>
                    <div className={styles.flash_items}>
                        {flashProducts.slice(0, 5).map(p => {
                            const soldVal = getStat(p, 'sold');
                            const pct = soldVal !== null ? Math.min(98, Math.round(soldVal / (soldVal + 20) * 100)) : null;
                            return (
                                <div key={p.id} className={styles.flash_item}
                                    onClick={() => navigate(`/products/${p.id}`)}>
                                    <div className={styles.fi_img}>🍶</div>
                                    <p className={styles.fi_name}>{getProductName(p, lang)}</p>
                                    <p className={styles.fi_price}>₩{p.price?.toLocaleString()}</p>
                                    <p className={styles.fi_discount}>-{p.discount}%</p>
                                    {pct !== null ? (
                                        <>
                                            <div className={styles.fi_bar_wrap}>
                                                <div className={styles.fi_bar} style={{ width: `${pct}%` }} />
                                            </div>
                                            <p className={styles.fi_sold}>{pct}% claimed</p>
                                        </>
                                    ) : (
                                        <p className={styles.fi_no_stat}>Be the first to buy!</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── 카테고리 필터 바 ─────────────────────────────── */}
            <nav className={styles.filter_nav}>
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        className={`${styles.fn_btn} ${selectedCategory === cat ? styles.fn_active : ''}`}
                        onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                        {t[CATEGORY_KEYS[cat]]}
                    </button>
                ))}
            </nav>

            {/* ── 상품 그리드 ─────────────────────────────────────── */}
            <section className={styles.products_sec}>
                <div className={styles.ps_head}>
                    <h2 className={styles.ps_title}>🛍️ Recommended for You</h2>
                    <p className={styles.ps_count}>{filtered.length} products</p>
                </div>
                <div className={styles.product_grid}>
                    {filtered.map((p, i) => {
                        const coins = 50 + i * 30;
                        return (
                            <div key={p.id} className={styles.card}
                                onClick={() => navigate(`/products/${p.id}`)}>
                                {(p.discount||0) > 0 && (
                                    <div className={styles.sale_badge}>-{p.discount}%</div>
                                )}
                                <div className={styles.card_img}>🍶</div>
                                <div className={styles.card_body}>
                                    <p className={styles.c_name}>{getProductName(p, lang)}</p>
                                    {/* 산지 + 페어링 — Shopee RCA: accessible discovery, relatable use cases */}
                                    <p className={styles.c_region_sea}>{p.regionEn}</p>
                                    {p.pairingEn && p.pairingEn.length > 0 && (
                                        <p className={styles.c_pairing_sea}>🍽 {p.pairingEn[0]}</p>
                                    )}
                                    {getStat(p,'sold') !== null
                                        ? <p className={styles.c_sold}>{getStat(p,'sold').toLocaleString()} sold</p>
                                        : <p className={styles.c_no_stat}>Be the first to buy!</p>}
                                    <div className={styles.c_price_row}>
                                        <span className={styles.c_price}>₩{p.price?.toLocaleString()}</span>
                                        {(p.discount||0)>0 && (
                                            <span className={styles.c_orig}>₩{p.originalPrice?.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <div className={styles.c_badges}>
                                        <span className={styles.b_free}>🚚 FREE</span>
                                        <span className={styles.b_coin}>🪙 +{coins}</span>
                                        {i % 4 === 0 && <span className={styles.b_top}>Top Pick</span>}
                                    </div>
                                    <p className={styles.c_spec}>{p.alcoholPercentage}% · {p.volumeMl}ml</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── 앱 다운로드 배너 ─────────────────────────────── */}
            <div className={styles.app_banner}>
                <span className={styles.ab_icon}>📱</span>
                <div>
                    <p className={styles.ab_title}>Download the Shopee App</p>
                    <p className={styles.ab_sub}>Get exclusive app-only deals and track your orders</p>
                </div>
                <button className={styles.ab_btn} onClick={() => alert('모바일 앱은 준비 중입니다.')}>Download Now</button>
            </div>

            <footer className={styles.footer}>
                <div className={styles.footer_row}>
                    <div>
                        <p className={styles.f_logo}>주미당 Joomidang</p>
                        <p className={styles.f_sub}>Korean Traditional Spirits</p>
                    </div>
                    {[
                        { head: 'Customer Service', items: ['Help Centre', 'Track Order', 'Returns', 'Contact Us'] },
                        { head: 'About', items: ['About Joomidang', 'Privacy Policy', 'Terms', 'Sitemap'] },
                        { head: 'Payment', items: ['Credit Card', 'Bank Transfer', 'E-Wallet', 'Installment'] },
                    ].map(col => (
                        <div key={col.head}>
                            <p className={styles.f_head}>{col.head}</p>
                            {col.items.map(item => <p key={item} className={styles.f_link}>{item}</p>)}
                        </div>
                    ))}
                </div>
                <p className={styles.f_copy}>© 2026 Joomidang. Alcohol is for adults only (18+). Drink responsibly.</p>
            </footer>
        </div>
    );
}

export default MainPageSEA;
