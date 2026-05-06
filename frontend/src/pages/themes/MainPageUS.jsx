// US 테마 - Amazon 스타일
// 구조: 다크 네이비 검색 헤더 / 부서별 탭 / Prime 히어로 / Today's Deals / 별점 중심 상품 그리드
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES, getStat } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import styles from './MainPageUS.module.css';
import CountryLangToggle from '../../components/CountryLangToggle';

function Stars({ r }) {
    const full = Math.floor(r || 4);
    const half = (r || 4) - full >= 0.5;
    return (
        <span className={styles.stars}>
            {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
        </span>
    );
}

const DEPARTMENTS = ['All Spirits', 'Makgeolli', 'Soju', 'Rice Wine', 'Premium', 'Gift Sets', 'Low-Alcohol', "Today's Deals"];

function MainPageUS() {
    const navigate = useNavigate();
    const { t, lang } = useGeo();
    const { products, filtered, selectedCategory } = useProducts();
    const [dept, setDept] = useState('All Spirits');
    const [searchVal, setSearchVal] = useState('');
    const [sortVal,   setSortVal]   = useState('Sort by: Featured');

    const loggedUser = JSON.parse(localStorage.getItem('user') || 'null');

    const dealProducts = products.filter(p => (p.discount || 0) >= 10);
    const bestSellers = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0));

    // 부서 → 카테고리 매핑
    const DEPT_CAT = { 'Makgeolli': '막걸리', 'Soju': '소주', 'Rice Wine': '약주', "Today's Deals": null };

    const displayFiltered = useMemo(() => {
        let list = [...filtered];
        // 검색
        const q = searchVal.trim().toLowerCase();
        if (q) list = list.filter(p =>
            getProductName(p, lang).toLowerCase().includes(q) ||
            (p.bridgeEn||'').toLowerCase().includes(q) ||
            (p.brewery||'').toLowerCase().includes(q)
        );
        // 부서 필터
        if (dept === "Today's Deals") list = list.filter(p => (p.discount||0) > 0);
        else if (DEPT_CAT[dept])      list = list.filter(p => p.category === DEPT_CAT[dept]);
        // 정렬
        if (sortVal === 'Price: Low to High')     list.sort((a, b) => (a.price||0) - (b.price||0));
        if (sortVal === 'Price: High to Low')     list.sort((a, b) => (b.price||0) - (a.price||0));
        if (sortVal === 'Avg. Customer Review')   list.sort((a, b) => (getStat(b,'rating')||0) - (getStat(a,'rating')||0));
        if (sortVal === 'Newest Arrivals')        list.sort((a, b) => (b.id||0) - (a.id||0));
        return list;
    }, [filtered, searchVal, dept, sortVal, lang]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={styles.wrapper}>

            {/* ── 다크 네이비 검색 헤더 ─────────────────────────── */}
            <header className={styles.amz_header}>
                <div className={styles.header_top}>
                    <div className={styles.logo_block} onClick={() => navigate('/')}>
                        <div className={styles.logo}>joomidang</div>
                        <div className={styles.logo_sub}>Korean Spirits</div>
                        <span className={styles.logo_smile}>▲</span>
                    </div>

                    <div className={styles.deliver_to}>
                        <span className={styles.dt_icon}>📦</span>
                        <div>
                            <span className={styles.dt_top}>Deliver to</span>
                            <span className={styles.dt_loc}>United States</span>
                        </div>
                    </div>

                    <div className={styles.search_wrap}>
                        <select className={styles.dept_sel} value={dept} onChange={e => setDept(e.target.value)}>
                            <option>All</option>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <input
                            className={styles.search_input}
                            placeholder="Search Korean spirits..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                        />
                        <button className={styles.search_btn} onClick={() => setSearchVal(searchVal)}>🔍</button>
                    </div>

                    <div className={styles.header_right}>
                        <CountryLangToggle variant="dark" />
                        <div className={styles.hr_item} onClick={() => navigate(loggedUser ? '/' : '/login')}>
                            <span className={styles.hr_top}>{loggedUser ? `Hello, ${loggedUser.name}` : 'Hello, Sign in'}</span>
                            <span className={styles.hr_main}>Account & Lists ▾</span>
                        </div>
                        <div className={styles.hr_item} onClick={() => navigate(loggedUser ? '/' : '/login')}>
                            <span className={styles.hr_top}>Returns</span>
                            <span className={styles.hr_main}>& Orders</span>
                        </div>
                        <div className={styles.hr_cart} onClick={() => navigate('/cart')}>
                            <span className={styles.cart_icon}>🛒</span>
                            <span className={styles.cart_label}>Cart</span>
                            <span className={styles.cart_count}>0</span>
                        </div>
                    </div>
                </div>

                {/* 부서별 네비게이션 */}
                <nav className={styles.dept_nav}>
                    <span className={styles.dn_menu}>☰ All</span>
                    {DEPARTMENTS.map(d => (
                        <button key={d}
                            className={`${styles.dn_btn} ${dept === d ? styles.dn_active : ''}`}
                            onClick={() => setDept(d)}>
                            {d}
                        </button>
                    ))}
                    <button className={styles.dn_prime} onClick={() => navigate('/join')}>✦ Try Prime</button>
                </nav>
            </header>

            {/* ── Prime 히어로 배너 ─────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.hero_main}>
                    <div className={styles.hero_prime_badge}>✦ Prime Deal</div>
                    <h1 className={styles.hero_title}>{t.hero_title}</h1>
                    <p className={styles.hero_desc}>{t.hero_desc}</p>
                    <div className={styles.hero_highlights}>
                        <div className={styles.hh_item}>
                            <span className={styles.hh_icon}>🚀</span>
                            <div>
                                <p className={styles.hh_main}>FREE Delivery</p>
                                <p className={styles.hh_sub}>On orders over $35</p>
                            </div>
                        </div>
                        <div className={styles.hh_item}>
                            <span className={styles.hh_icon}>↩️</span>
                            <div>
                                <p className={styles.hh_main}>Easy Returns</p>
                                <p className={styles.hh_sub}>30-day return policy</p>
                            </div>
                        </div>
                        <div className={styles.hh_item}>
                            <span className={styles.hh_icon}>✅</span>
                            <div>
                                <p className={styles.hh_main}>Authentic</p>
                                <p className={styles.hh_sub}>Direct from Korea</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.hero_btns}>
                        <button className={styles.hero_btn_main} onClick={() => navigate('/join')}>
                            Shop Now
                        </button>
                        <button className={styles.hero_btn_prime} onClick={() => navigate('/join')}>
                            ✦ Start Prime Free Trial
                        </button>
                    </div>
                </div>
                <div className={styles.hero_side}>
                    <div className={styles.hero_deal_box}>
                        <p className={styles.hdb_label}>Featured Deal</p>
                        <div className={styles.hdb_prod}>🍶</div>
                        <p className={styles.hdb_name}>{products[0] ? getProductName(products[0], lang) : 'Premium Makgeolli'}</p>
                        {products[0] && (
                            <>
                                <div className={styles.hdb_rating}>
                                    {getStat(products[0],'rating') !== null ? (
                                        <>
                                            <Stars r={getStat(products[0],'rating')} />
                                            {getStat(products[0],'reviews') !== null
                                                ? <span className={styles.hdb_cnt}>({getStat(products[0],'reviews').toLocaleString()})</span>
                                                : null}
                                        </>
                                    ) : (
                                        <span className={styles.no_rating}>Be the first to review</span>
                                    )}
                                </div>
                                <p className={styles.hdb_price}>${(products[0].price * 0.00073).toFixed(2)}</p>
                                {(products[0].discount||0) > 0 && (
                                    <p className={styles.hdb_save}>Save {products[0].discount}%</p>
                                )}
                            </>
                        )}
                        <button className={styles.hdb_btn} onClick={() => products[0] && navigate(`/products/${products[0].id}`)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>

            {/* ── 카테고리 필터 ─────────────────────────────────── */}
            <nav className={styles.cat_nav}>
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        className={`${styles.cat_btn} ${selectedCategory === cat ? styles.cat_active : ''}`}
                        onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                        {t[CATEGORY_KEYS[cat]]}
                    </button>
                ))}
            </nav>

            {/* ── Today's Deals ─────────────────────────────────── */}
            {dealProducts.length > 0 && (
                <section className={styles.deals_sec}>
                    <div className={styles.ds_head}>
                        <h2 className={styles.ds_title}>⚡ Today's Deals</h2>
                        <span className={styles.ds_sub}>Limited time offers</span>
                        <button className={styles.ds_all} onClick={() => navigate('/')}>See all deals →</button>
                    </div>
                    <div className={styles.deals_row}>
                        {dealProducts.slice(0, 4).map(p => (
                            <div key={p.id} className={styles.deal_card}
                                onClick={() => navigate(`/products/${p.id}`)}>
                                <div className={styles.dc_save_badge}>-{p.discount}%</div>
                                <div className={styles.dc_img}>🍶</div>
                                <div className={styles.dc_body}>
                                    <p className={styles.dc_name}>{getProductName(p, lang)}</p>
                                    <div className={styles.dc_rating}>
                                        {getStat(p,'rating') !== null ? (
                                            <>
                                                <Stars r={getStat(p,'rating')} />
                                                {getStat(p,'reviews') !== null
                                                    ? <span className={styles.dc_cnt}>({getStat(p,'reviews').toLocaleString()})</span>
                                                    : null}
                                            </>
                                        ) : (
                                            <span className={styles.no_rating}>No reviews yet</span>
                                        )}
                                    </div>
                                    <div className={styles.dc_price_row}>
                                        <span className={styles.dc_badge_deal}>Deal</span>
                                        <span className={styles.dc_price}>${(p.price * 0.00073).toFixed(2)}</span>
                                    </div>
                                    <p className={styles.dc_list}>List: <s>${(p.originalPrice * 0.00073).toFixed(2)}</s></p>
                                    <p className={styles.dc_prime}>✦ FREE Delivery for Prime</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Best Sellers ──────────────────────────────────── */}
            <section className={styles.best_sec}>
                <div className={styles.bs_head}>
                    <h2 className={styles.bs_title}># Best Sellers in Korean Spirits</h2>
                    <button className={styles.bs_more} onClick={() => navigate('/')}>See more best sellers</button>
                </div>
                <div className={styles.best_row}>
                    {bestSellers.slice(0, 4).map((p, i) => (
                        <div key={p.id} className={styles.best_card}
                            onClick={() => navigate(`/products/${p.id}`)}>
                            <div className={styles.bc_rank}>#{i + 1}</div>
                            <div className={styles.bc_img}>🍶</div>
                            <div className={styles.bc_body}>
                                <p className={styles.bc_name}>{getProductName(p, lang)}</p>
                                <div className={styles.bc_rating}>
                                    {getStat(p,'rating') !== null ? (
                                        <>
                                            <Stars r={getStat(p,'rating')} />
                                            <span className={styles.bc_val}>{getStat(p,'rating').toFixed(1)}</span>
                                            {getStat(p,'reviews') !== null
                                                ? <span className={styles.bc_cnt}>{getStat(p,'reviews').toLocaleString()}</span>
                                                : null}
                                        </>
                                    ) : (
                                        <span className={styles.no_rating}>Be the first to review</span>
                                    )}
                                </div>
                                <p className={styles.bc_price}>${(p.price * 0.00073).toFixed(2)}</p>
                                <p className={styles.bc_prime}>✦ Prime</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 전체 상품 그리드 ──────────────────────────────── */}
            <section className={styles.all_products}>
                <div className={styles.ap_head}>
                    <h2 className={styles.ap_title}>All Products</h2>
                    <p className={styles.ap_count}>{displayFiltered.length} results{searchVal && ` for "${searchVal}"`}</p>
                    <select className={styles.sort_sel} value={sortVal} onChange={e => setSortVal(e.target.value)}>
                        <option>Sort by: Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Avg. Customer Review</option>
                        <option>Newest Arrivals</option>
                    </select>
                </div>
                <div className={styles.product_grid}>
                    {displayFiltered.map((p, i) => (
                        <div key={p.id} className={styles.card}
                            onClick={() => navigate(`/products/${p.id}`)}>
                            {i === 0 && <div className={styles.best_seller_ribbon}>Best Seller</div>}
                            <div className={styles.card_img}>🍶</div>
                            <div className={styles.card_body}>
                                <p className={styles.c_brand}>주미당 · Direct Import</p>
                                <p className={styles.c_name}>{getProductName(p, lang)}</p>
                                {/* Connoisseurship — Flaviar RCA: identity expression through knowledge */}
                                {p.tastingEn && (
                                    <p className={styles.c_nose}><strong>Nose:</strong> {p.tastingEn.nose}</p>
                                )}
                                {p.bridgeEn && (
                                    <p className={styles.c_bridge}>{p.bridgeEn}</p>
                                )}
                                {p.pairingEn && p.pairingEn.length > 0 && (
                                    <p className={styles.c_pairing}>Pairs with: {p.pairingEn.slice(0, 2).join(', ')}</p>
                                )}
                                <div className={styles.c_rating_row}>
                                    {getStat(p,'rating') !== null ? (
                                        <>
                                            <Stars r={getStat(p,'rating')} />
                                            <span className={styles.c_rating_val}>{getStat(p,'rating').toFixed(1)}</span>
                                            {getStat(p,'reviews') !== null
                                                ? <span className={styles.c_rating_cnt}>{getStat(p,'reviews').toLocaleString()} ratings</span>
                                                : null}
                                        </>
                                    ) : (
                                        <span className={styles.no_rating}>Be the first to review</span>
                                    )}
                                </div>
                                <div className={styles.c_price_block}>
                                    {(p.discount||0)>0 && <span className={styles.c_discount_tag}>-{p.discount}%</span>}
                                    <span className={styles.c_price}>${(p.price * 0.00073).toFixed(2)}</span>
                                </div>
                                {(p.discount||0)>0 && (
                                    <p className={styles.c_was}>
                                        Was: <s>${(p.originalPrice * 0.00073).toFixed(2)}</s>
                                    </p>
                                )}
                                <div className={styles.c_delivery}>
                                    <span className={styles.cd_prime}>✦ FREE delivery</span>
                                    <span className={styles.cd_date}>by tomorrow</span>
                                </div>
                                <p className={styles.c_instock}>In Stock</p>
                                <button className={styles.c_add_cart}
                                    onClick={e => { e.stopPropagation(); navigate('/cart'); }}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.f_back_to_top} onClick={() => window.scrollTo(0, 0)}>
                    Back to top
                </div>
                <div className={styles.footer_grid}>
                    {[
                        { head: 'Get to Know Us', items: ['About Joomidang', 'Careers', 'Blog', 'Press Releases'] },
                        { head: 'Make Money with Us', items: ['Sell products', 'Affiliate Program', 'Advertise Products'] },
                        { head: 'Payment Products', items: ['Joomidang Pay', 'Rewards Card', 'Gift Cards'] },
                        { head: 'Let Us Help You', items: ['Your Account', 'Returns Centre', 'Help'] },
                    ].map(col => (
                        <div key={col.head}>
                            <p className={styles.f_head}>{col.head}</p>
                            {col.items.map(i => <p key={i} className={styles.f_link}>{i}</p>)}
                        </div>
                    ))}
                </div>
                <div className={styles.f_bottom}>
                    <span className={styles.f_logo}>joomidang</span>
                    <p className={styles.f_legal}>
                        © 2026 Joomidang, Inc. | Conditions of Use | Privacy Notice |
                        Must be 21+ to purchase alcohol
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default MainPageUS;
