// EU 테마 - Zalando / ASOS 에디토리얼 스타일
// 구조: 미니멀 헤더 / 풀폭 에디토리얼 히어로 / 에디토리얼 탭 / 매거진 믹스 그리드 / 브랜드 스트립
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES, getStat } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import styles from './MainPageEU.module.css';
import CountryLangToggle from '../../components/CountryLangToggle';

const getWishlist = () => new Set(JSON.parse(localStorage.getItem('jd_wishlist') || '[]'));

const EDIT_TABS = ['New In', 'Trending', 'Sale', 'Premium', 'Sustainable'];

function MainPageEU() {
    const navigate = useNavigate();
    const { t, lang, country } = useGeo();
    const { products, filtered, selectedCategory } = useProducts();
    const [editTab,     setEditTab]     = useState('New In');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showSearch,  setShowSearch]  = useState(false);
    const [searchVal,   setSearchVal]   = useState('');
    const [sortVal,     setSortVal]     = useState('Recommended');
    const [wishlist,    setWishlist]    = useState(getWishlist);
    const [quickView,   setQuickView]   = useState(null); // product object | null

    const loggedUser = JSON.parse(localStorage.getItem('user') || 'null');

    const toggleWishlist = (e, id) => {
        e.stopPropagation();
        setWishlist(wl => {
            const next = new Set(wl);
            next.has(id) ? next.delete(id) : next.add(id);
            localStorage.setItem('jd_wishlist', JSON.stringify([...next]));
            return next;
        });
    };

    const saleProducts = products.filter(p => (p.discount || 0) > 0);

    const displayProducts = useMemo(() => {
        let list = editTab === 'Sale' ? saleProducts : [...filtered];
        if (editTab === 'Premium') list = list.filter(p => (p.price||0) >= 40000);
        const q = searchVal.trim().toLowerCase();
        if (q) list = list.filter(p =>
            getProductName(p, lang).toLowerCase().includes(q) ||
            (p.regionEn||p.region||'').toLowerCase().includes(q) ||
            (p.breweryEn||p.brewery||'').toLowerCase().includes(q)
        );
        if (sortVal === 'Price: Low to High')  list.sort((a, b) => (a.price||0) - (b.price||0));
        if (sortVal === 'Price: High to Low')  list.sort((a, b) => (b.price||0) - (a.price||0));
        if (sortVal === 'New In')              list.sort((a, b) => (b.id||0) - (a.id||0));
        return list;
    }, [filtered, editTab, searchVal, sortVal, lang]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={styles.wrapper}>

            {/* ── 최상단 배너 ─────────────────────────────────── */}
            <div className={styles.top_banner}>
                <span>Free worldwide shipping on orders over ₩50,000</span>
                <span className={styles.tb_sep}>·</span>
                <span>Free returns within 30 days</span>
                <span className={styles.tb_sep}>·</span>
                <span>Authentic Korean spirits, direct from source</span>
            </div>

            {/* ── 미니멀 헤더 ─────────────────────────────────── */}
            <header className={styles.minimal_header}>
                <nav className={styles.mh_left}>
                    <button className={`${styles.mh_nav_btn} ${editTab === 'New In' ? styles.mh_nav_active : ''}`}
                        onClick={() => setEditTab('New In')}>New In</button>
                    <button className={`${styles.mh_nav_btn} ${editTab === 'Trending' ? styles.mh_nav_active : ''}`}
                        onClick={() => setEditTab('Trending')}>Collections</button>
                    <button className={`${styles.mh_nav_btn} ${editTab === 'Premium' ? styles.mh_nav_active : ''}`}
                        onClick={() => setEditTab('Premium')}>Premium</button>
                    <button className={`${styles.mh_nav_btn} ${styles.mh_sale} ${editTab === 'Sale' ? styles.mh_nav_active : ''}`}
                        onClick={() => setEditTab('Sale')}>Sale</button>
                </nav>

                <div className={styles.mh_logo} onClick={() => navigate('/')}>
                    <div className={styles.logo_mark}>主</div>
                    <div className={styles.logo_text}>JOOMIDANG</div>
                </div>

                <div className={styles.mh_right}>
                    <CountryLangToggle variant="light" />
                    <button className={`${styles.mh_icon_btn} ${showSearch ? styles.mh_icon_active : ''}`}
                        onClick={() => setShowSearch(v => !v)}>🔍</button>
                    <button className={styles.mh_icon_btn} onClick={() => navigate(loggedUser ? '/' : '/login')}>
                        👤
                    </button>
                    <button className={styles.mh_icon_btn} onClick={() => navigate('/cart')}>
                        🛍️ <span className={styles.mh_cart_count}>0</span>
                    </button>
                </div>
            </header>

            {/* ── 검색 바 (토글) ────────────────────────────────── */}
            {showSearch && (
                <div className={styles.search_bar_wrap}>
                    <input
                        className={styles.search_bar_input}
                        autoFocus
                        placeholder="Search spirits, regions, breweries..."
                        value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                        onKeyDown={e => e.key === 'Escape' && setShowSearch(false)}
                    />
                    {searchVal && (
                        <button className={styles.search_clear} onClick={() => setSearchVal('')}>×</button>
                    )}
                    <button className={styles.search_close} onClick={() => setShowSearch(false)}>Close</button>
                </div>
            )}

            {/* ── 에디토리얼 히어로 ─────────────────────────────── */}
            <section className={styles.editorial_hero}>
                <div className={styles.eh_bg}></div>
                <div className={styles.eh_content}>
                    <div className={styles.eh_text}>
                        <p className={styles.eh_issue}>Issue No. 12 · Spring 2026</p>
                        <h1 className={styles.eh_title}>{t.hero_title}</h1>
                        <p className={styles.eh_sub}>{t.hero_desc}</p>
                        <div className={styles.eh_tags}>
                            <span>#KoreanSpirits</span>
                            <span>#TraditionalBrewing</span>
                            <span>#CraftAlcohol</span>
                        </div>
                        <button className={styles.eh_btn} onClick={() => navigate('/')}>
                            Explore the Collection
                        </button>
                    </div>
                    <div className={styles.eh_products}>
                        {products.slice(0, 2).map((p, i) => (
                            <div key={p.id}
                                className={`${styles.eh_prod_card} ${i === 1 ? styles.epc_offset : ''}`}
                                onClick={() => navigate(`/products/${p.id}`)}>
                                <div className={styles.epc_img}>🍶</div>
                                <div className={styles.epc_info}>
                                    <p className={styles.epc_name}>{getProductName(p, lang)}</p>
                                    <p className={styles.epc_price}>₩{p.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 에디토리얼 탭 ──────────────────────────────────── */}
            <section className={styles.edit_section}>
                <div className={styles.es_head}>
                    <div className={styles.es_tabs}>
                        {EDIT_TABS.map(tab => (
                            <button key={tab}
                                className={`${styles.et_btn} ${editTab === tab ? styles.et_active : ''}`}
                                onClick={() => setEditTab(tab)}>
                                {tab}
                                {tab === 'New In' && <span className={styles.et_dot}></span>}
                            </button>
                        ))}
                    </div>
                    <div className={styles.es_filters}>
                        {CATEGORIES.slice(1, 6).map(cat => (
                            <button key={cat}
                                className={`${styles.es_filter_pill} ${selectedCategory === cat ? styles.es_pill_active : ''}`}
                                onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                                {t[CATEGORY_KEYS[cat]]}
                            </button>
                        ))}
                    </div>
                    <div className={styles.es_right}>
                        <span className={styles.es_count}>{displayProducts.length} products</span>
                        <select className={styles.es_sort} value={sortVal} onChange={e => setSortVal(e.target.value)}>
                            <option>Recommended</option>
                            <option>New In</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* 매거진 믹스 그리드 */}
                <div className={styles.magazine_grid}>
                    {displayProducts.map((p, i) => {
                        const isLarge = i === 0 || i === 5 || i === 9;
                        return (
                            <div key={p.id}
                                className={`${styles.mag_card} ${isLarge ? styles.mag_large : ''}`}
                                onMouseEnter={() => setHoveredCard(p.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => navigate(`/products/${p.id}`)}>

                                <div className={styles.mc_img_wrap}>
                                    <div className={styles.mc_img}>🍶</div>
                                    {hoveredCard === p.id && (
                                        <div className={styles.mc_overlay}>
                                            <button className={styles.mc_quick}
                                                onClick={e => { e.stopPropagation(); setQuickView(p); }}>
                                                Quick View
                                            </button>
                                            <button
                                                className={`${styles.mc_wishlist} ${wishlist.has(p.id) ? styles.mc_wl_on : ''}`}
                                                onClick={e => toggleWishlist(e, p.id)}>
                                                {wishlist.has(p.id) ? '❤️' : '♡'}
                                            </button>
                                        </div>
                                    )}
                                    {(p.discount||0) > 0 && (
                                        <div className={styles.mc_sale_tag}>SALE</div>
                                    )}
                                    {i < 3 && <div className={styles.mc_new_tag}>NEW</div>}
                                </div>

                                <div className={styles.mc_body}>
                                    <p className={styles.mc_category}>Traditional Korean Spirit</p>
                                    <p className={styles.mc_name}>{getProductName(p, lang)}</p>
                                    <div className={styles.mc_price_row}>
                                        <span className={styles.mc_price}>₩{p.price?.toLocaleString()}</span>
                                        {(p.discount||0) > 0 && (
                                            <span className={styles.mc_orig}>₩{p.originalPrice?.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <p className={styles.mc_spec}>{p.alcoholPercentage}% ABV · {p.volumeMl}ml</p>
                                    {/* Terroir — Whisky Exchange RCA: region + ingredients = authenticity */}
                                    <p className={styles.mc_terroir}>{p.regionEn || p.region}</p>
                                    {p.ingredientsEn && (
                                        <p className={styles.mc_ingredients_eu}>{p.ingredientsEn}</p>
                                    )}
                                    {p.heritageEn && (
                                        <p className={styles.mc_heritage_eu}>{p.heritageEn}</p>
                                    )}
                                    {isLarge && p.tastingEn && (
                                        <div className={styles.mc_tasting_eu}>
                                            <p><em>Nose:</em> {p.tastingEn.nose}</p>
                                            <p><em>Palate:</em> {p.tastingEn.palate}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Quick View 모달 ──────────────────────────────── */}
            {quickView && (
                <div className={styles.qv_overlay} onClick={() => setQuickView(null)}>
                    <div className={styles.qv_modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.qv_close} onClick={() => setQuickView(null)}>×</button>
                        <div className={styles.qv_img}>🍶</div>
                        <div className={styles.qv_info}>
                            <p className={styles.qv_category}>Traditional Korean Spirit</p>
                            <h3 className={styles.qv_name}>{getProductName(quickView, lang)}</h3>
                            <p className={styles.qv_origin}>{quickView.regionEn || quickView.region}</p>
                            {quickView.breweryEn && <p className={styles.qv_brewery}>{quickView.breweryEn}</p>}
                            <p className={styles.qv_spec}>{quickView.alcoholPercentage}% ABV · {quickView.volumeMl}ml</p>
                            {quickView.heritageEn && <p className={styles.qv_heritage}>{quickView.heritageEn}</p>}
                            <div className={styles.qv_price_row}>
                                <span className={styles.qv_price}>{formatPrice(quickView.price, country)}</span>
                                {(quickView.discount||0) > 0 && (
                                    <span className={styles.qv_sale}>SALE -{quickView.discount}%</span>
                                )}
                            </div>
                            <div className={styles.qv_actions}>
                                <button className={styles.qv_cart} onClick={() => navigate('/cart')}>Add to Bag</button>
                                <button className={styles.qv_detail} onClick={() => { setQuickView(null); navigate(`/products/${quickView.id}`); }}>
                                    View Full Details →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 에디토리얼 텍스트 블록 ────────────────────────── */}
            <section className={styles.editorial_block}>
                <div className={styles.eb_inner}>
                    <p className={styles.eb_label}>The Story</p>
                    <h2 className={styles.eb_title}>A Tradition of Thousands of Years</h2>
                    <p className={styles.eb_body}>
                        Korean traditional spirits — makgeolli, soju, yakju — represent centuries
                        of brewing heritage. Each bottle carries the story of its region, its season,
                        and the hands that crafted it. At Joomidang, we bring these stories to you,
                        directly from the source.
                    </p>
                    <button className={styles.eb_btn} onClick={() => navigate('/')}>
                        Read More →
                    </button>
                </div>
            </section>

            {/* ── 브랜드 스트립 ────────────────────────────────── */}
            <div className={styles.brand_strip}>
                <p className={styles.bs_label}>As featured in</p>
                <div className={styles.bs_logos}>
                    {['VOGUE', 'GQ', 'DECANTER', 'FOOD & WINE', 'TIME OUT'].map(b => (
                        <span key={b} className={styles.bs_logo}>{b}</span>
                    ))}
                </div>
            </div>

            {/* ── 유지 가능성 섹션 ─────────────────────────────── */}
            <section className={styles.sustain_sec}>
                {[
                    { icon: '🌱', title: 'Sustainably Sourced', desc: 'Direct partnerships with family-owned breweries committed to traditional, eco-friendly methods.' },
                    { icon: '📦', title: 'Minimal Packaging', desc: 'Recyclable packaging designed to protect your spirits and the planet.' },
                    { icon: '🤝', title: 'Fair Trade', desc: 'We ensure every artisan and producer receives fair compensation for their craft.' },
                ].map(s => (
                    <div key={s.title} className={styles.sustain_item}>
                        <span className={styles.si_icon}>{s.icon}</span>
                        <p className={styles.si_title}>{s.title}</p>
                        <p className={styles.si_desc}>{s.desc}</p>
                    </div>
                ))}
            </section>

            <footer className={styles.footer}>
                <div className={styles.footer_grid}>
                    <div className={styles.footer_brand}>
                        <div className={styles.fb_logo}>
                            <div className={styles.fb_mark}>主</div>
                            <div className={styles.fb_name}>JOOMIDANG</div>
                        </div>
                        <p className={styles.fb_tagline}>The finest Korean spirits, curated for discerning palates.</p>
                        <div className={styles.fb_social}>
                            {['Instagram', 'Pinterest', 'TikTok', 'YouTube'].map(s => (
                                <span key={s} className={styles.fbs_item}>{s}</span>
                            ))}
                        </div>
                    </div>
                    {[
                        { head: 'Shop', items: ['New In', 'Sale', 'Premium', 'Gift Sets', 'Collections'] },
                        { head: 'Help', items: ['Delivery & Returns', 'Contact Us', 'FAQ', 'Size Guide', 'Gift Wrapping'] },
                        { head: 'About', items: ['Our Story', 'Sustainability', 'Careers', 'Press', 'Affiliates'] },
                    ].map(col => (
                        <div key={col.head}>
                            <p className={styles.f_head}>{col.head}</p>
                            {col.items.map(item => <p key={item} className={styles.f_link}>{item}</p>)}
                        </div>
                    ))}
                </div>
                <div className={styles.f_bottom}>
                    <p className={styles.f_copy}>© 2026 Joomidang Ltd. All rights reserved.</p>
                    <div className={styles.f_legal_links}>
                        {['Privacy Policy', 'Cookie Settings', 'Terms of Service', 'Accessibility'].map(l => (
                            <span key={l}>{l}</span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default MainPageEU;
