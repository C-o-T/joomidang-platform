// CN 테마 - 淘宝(Taobao) / 京东(JD) 스타일
// 구조: 빨간 검색창이 히어로 / 카테고리 아이콘 그리드 / 플래시세일 카운트다운 / 라이브쇼핑 / 조밀 상품 그리드
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES, getStat } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import styles from './MainPageCN.module.css';
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

const CAT_ICONS = ['🍶','🥃','🍺','🌾','🎁','🍵','🏺','🫗','🍷','🧉'];

function MainPageCN() {
    const navigate = useNavigate();
    const { t, lang } = useGeo();
    const { products, filtered, selectedCategory } = useProducts();
    const [searchVal, setSearchVal] = useState('');
    const [serviceMsg, setServiceMsg] = useState(false);

    const target = Date.now() + 4 * 3600000 + 23 * 60000 + 17000;
    const { h, m, s } = useCountdown(target);

    const saleProducts = products.filter(p => (p.discount || 0) > 0);
    const hotProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0));

    const displayFiltered = useMemo(() => {
        const q = searchVal.trim().toLowerCase();
        if (!q) return filtered;
        return filtered.filter(p =>
            getProductName(p, lang).toLowerCase().includes(q) ||
            (p.brewery||'').toLowerCase().includes(q) ||
            (p.breweryZh||'').toLowerCase().includes(q) ||
            (p.category||'').toLowerCase().includes(q)
        );
    }, [filtered, searchVal, lang]);

    return (
        <div className={styles.wrapper}>

            {/* ── 빨간 검색 헤더 ─────────────────────────────────── */}
            <header className={styles.red_header}>
                <div className={styles.header_top}>
                    <div className={styles.logo_area}>
                        <span className={styles.logo_cn}>酒美堂</span>
                        <span className={styles.logo_sub}>韩国传统酒 · 正品保证</span>
                    </div>
                    <div className={styles.header_links}>
                        <CountryLangToggle variant="dark" />
                        <span onClick={() => navigate('/login')}>登录</span>
                        <span>|</span>
                        <span onClick={() => navigate('/join')}>注册</span>
                        <span>|</span>
                        <span onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>🛒 购物车</span>
                        <span>|</span>
                        <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>我的订单</span>
                    </div>
                </div>
                <div className={styles.search_area}>
                    <div className={styles.search_box}>
                        <input
                            className={styles.search_input}
                            placeholder="搜索商品，如：马格利酒、韩国烧酒..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                        <button className={styles.search_btn} onClick={() => setSearchVal(searchVal)}>搜索</button>
                    </div>
                    <div className={styles.search_hot}>
                        <span className={styles.sh_label}>热门搜索：</span>
                        {['马格利酒','막걸리','韩国烧酒','传统米酒','礼盒套装'].map(k => (
                            <span key={k} className={styles.sh_tag} onClick={() => setSearchVal(k)}>{k}</span>
                        ))}
                    </div>
                </div>
                <nav className={styles.header_nav}>
                    {CATEGORIES.map(cat => (
                        <button key={cat}
                            className={`${styles.hn_btn} ${selectedCategory === cat ? styles.hn_active : ''}`}
                            onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                            {t[CATEGORY_KEYS[cat]]}
                        </button>
                    ))}
                    <span className={styles.hn_sep}></span>
                    <button className={styles.hn_special} onClick={() => navigate('/join')}>🎁 礼品定制</button>
                    <button className={styles.hn_special} onClick={() => navigate('/join')}>🚚 国际配送</button>
                </nav>
            </header>

            {/* ── 활동 배너 ─────────────────────────────────────── */}
            <div className={styles.activity_banner}>
                <div className={styles.ab_left}>
                    <span className={styles.ab_tag}>限时特惠</span>
                    <span className={styles.ab_text}>新用户专享 <strong>8折优惠</strong>，首单立减50元</span>
                </div>
                <div className={styles.ab_right}>
                    <span>满300元包邮</span>
                    <span className={styles.ab_dot}>·</span>
                    <span>正品保证</span>
                    <span className={styles.ab_dot}>·</span>
                    <span>支持退换货</span>
                    <span className={styles.ab_dot}>·</span>
                    <span>在线客服24h</span>
                </div>
            </div>

            {/* ── 카테고리 아이콘 그리드 ─────────────────────────── */}
            <section className={styles.cat_grid_sec}>
                <div className={styles.cat_grid}>
                    {CATEGORIES.slice(0, 8).map((cat, i) => (
                        <div key={cat} className={styles.cat_icon_item}
                            onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                            <div className={styles.cat_icon_circle}>
                                <span>{CAT_ICONS[i] || '🍶'}</span>
                            </div>
                            <p className={styles.cat_icon_label}>{t[CATEGORY_KEYS[cat]]}</p>
                        </div>
                    ))}
                    <div className={styles.cat_icon_item} onClick={() => navigate('/')}>
                        <div className={styles.cat_icon_circle}><span>📦</span></div>
                        <p className={styles.cat_icon_label}>礼盒套装</p>
                    </div>
                    <div className={styles.cat_icon_item} onClick={() => navigate('/')}>
                        <div className={styles.cat_icon_circle}><span>🔥</span></div>
                        <p className={styles.cat_icon_label}>热销榜</p>
                    </div>
                </div>
            </section>

            {/* ── 플래시세일 ─────────────────────────────────────── */}
            {saleProducts.length > 0 && (
                <section className={styles.flash_sec}>
                    <div className={styles.flash_head}>
                        <div className={styles.fh_left}>
                            <span className={styles.fh_icon}>⚡</span>
                            <span className={styles.fh_title}>限时抢购</span>
                            <span className={styles.fh_sub}>FLASH SALE</span>
                        </div>
                        <div className={styles.fh_cd}>
                            <span className={styles.cd_label}>距结束</span>
                            <span className={styles.cd_block}>{h}</span>
                            <span className={styles.cd_sep}>:</span>
                            <span className={styles.cd_block}>{m}</span>
                            <span className={styles.cd_sep}>:</span>
                            <span className={styles.cd_block}>{s}</span>
                        </div>
                        <button className={styles.fh_more} onClick={() => navigate('/')}>查看全部 &gt;</button>
                    </div>
                    <div className={styles.flash_grid}>
                        {saleProducts.slice(0, 4).map(p => {
                            // 실판매 데이터 없으면 진행바 숨김
                            const soldVal = getStat(p, 'sold');
                            const pct = soldVal !== null ? Math.min(99, Math.round(soldVal / (soldVal + 30) * 100)) : null;
                            return (
                                <div key={p.id} className={styles.flash_card}
                                    onClick={() => navigate(`/products/${p.id}`)}>
                                    <div className={styles.fc_img}>🍶</div>
                                    <div className={styles.fc_body}>
                                        <p className={styles.fc_name}>{getProductName(p, lang)}</p>
                                        <div className={styles.fc_price_row}>
                                            <span className={styles.fc_price}>¥{Math.round((p.price||0)*0.052).toLocaleString()}</span>
                                            <span className={styles.fc_orig}>¥{Math.round((p.originalPrice||p.price||0)*0.052).toLocaleString()}</span>
                                        </div>
                                        {pct !== null ? (
                                            <>
                                                <div className={styles.fc_bar_wrap}>
                                                    <div className={styles.fc_bar} style={{ width: `${pct}%` }} />
                                                </div>
                                                <p className={styles.fc_sold}>已抢{pct}%</p>
                                            </>
                                        ) : (
                                            <p className={styles.fc_no_stat}>立即购买</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── 라이브 쇼핑 ─────────────────────────────────────── */}
            <section className={styles.live_sec}>
                <div className={styles.ls_head}>
                    <span className={styles.live_dot}></span>
                    <span className={styles.ls_title}>直播间</span>
                    <span className={styles.ls_sub}>正在直播 · 限时优惠</span>
                </div>
                <div className={styles.live_list}>
                    {[
                        { name: '주미당 공식', viewers: '3,241', badge: '正在直播', emoji: '🍶' },
                        { name: '한국전통주 전문', viewers: '1,892', badge: '直播中', emoji: '🥃' },
                        { name: '프리미엄 막걸리', viewers: '987', badge: '即将开播', emoji: '🍺' },
                    ].map(l => (
                        <div key={l.name} className={styles.live_card}>
                            <div className={styles.lc_preview}>
                                <span className={styles.lc_emoji}>{l.emoji}</span>
                                <span className={`${styles.lc_badge} ${l.badge === '即将开播' ? styles.lc_soon : ''}`}>{l.badge}</span>
                            </div>
                            <p className={styles.lc_name}>{l.name}</p>
                            <p className={styles.lc_viewers}>👥 {l.viewers}人在看</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 爆款推荐 (인기 상품) ───────────────────────────── */}
            <section className={styles.hot_sec}>
                <div className={styles.section_head}>
                    <span className={styles.sh_icon}>🔥</span>
                    <h2 className={styles.sec_title}>爆款推荐</h2>
                    <span className={styles.sec_sub}>热销好物，品质保证</span>
                    <button className={styles.sec_more} onClick={() => navigate('/')}>查看更多 &gt;</button>
                </div>
                <div className={styles.hot_grid}>
                    {hotProducts.slice(0, 4).map(p => (
                        <div key={p.id} className={styles.hot_card}
                            onClick={() => navigate(`/products/${p.id}`)}>
                            <div className={styles.hc_img}>🍶</div>
                            <div className={styles.hc_body}>
                                <p className={styles.hc_name}>{getProductName(p, lang)}</p>
                                <p className={styles.hc_origin}>{p.breweryZh || p.brewery} · {p.regionEn}</p>
                                {getStat(p,'sold') !== null
                                    ? <p className={styles.hc_sold}>月销 {getStat(p,'sold').toLocaleString()}件</p>
                                    : <p className={styles.hc_no_stat}>第一个评价</p>}
                                <p className={styles.hc_price}>¥{Math.round((p.price||0)*0.052).toLocaleString()}</p>
                                <div className={styles.hc_badges}>
                                    <span className={styles.hc_free}>包邮</span>
                                    <span className={styles.hc_auth}>正品保证</span>
                                    {(p.discount||0)>0 && <span className={styles.hc_hot}>热卖</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 为你推荐 전체 상품 ──────────────────────────────── */}
            <section className={styles.recommend_sec}>
                <div className={styles.section_head}>
                    <span className={styles.sh_icon}>✨</span>
                    <h2 className={styles.sec_title}>为你推荐</h2>
                    <span className={styles.sec_sub}>
                        {searchVal ? `"${searchVal}" 검색 결과 ${displayFiltered.length}件` : '根据您的浏览记录推荐'}
                    </span>
                    {searchVal && (
                        <button className={styles.sec_more} onClick={() => setSearchVal('')} style={{ marginLeft: 'auto' }}>清除搜索</button>
                    )}
                </div>
                <div className={styles.product_grid}>
                    {displayFiltered.map((p, i) => (
                        <div key={p.id} className={styles.card}
                            onClick={() => navigate(`/products/${p.id}`)}>
                            {(p.discount||0) > 0 && (
                                <div className={styles.card_sale_badge}>-{p.discount}%</div>
                            )}
                            {i < 3 && <div className={styles.card_hot_badge}>🔥热</div>}
                            <div className={styles.card_img}>🍶</div>
                            <div className={styles.card_body}>
                                <p className={styles.c_name}>{getProductName(p, lang)}</p>
                                {/* 产地证明 — 酒仙网 RCA: 细节越多，假酒越难 */}
                                <p className={styles.c_origin_cn}>{p.breweryZh || p.brewery} · {p.regionEn}</p>
                                {p.tastingZh && (
                                    <p className={styles.c_tasting_cn}>{p.tastingZh.nose}</p>
                                )}
                                {getStat(p,'sold') !== null
                                    ? <p className={styles.c_sold}>月销 {getStat(p,'sold').toLocaleString()}件</p>
                                    : <p className={styles.c_no_stat}>成为第一个评价者</p>}
                                <div className={styles.c_price_row}>
                                    <span className={styles.c_price}>¥{Math.round((p.price||0)*0.052).toLocaleString()}</span>
                                    {(p.discount||0)>0 && (
                                        <span className={styles.c_orig}>¥{Math.round((p.originalPrice||0)*0.052).toLocaleString()}</span>
                                    )}
                                </div>
                                <div className={styles.c_badges}>
                                    <span className={styles.cb_free}>包邮</span>
                                    {(p.discount||0)>0 && <span className={styles.cb_sale}>限时折扣</span>}
                                    <span className={styles.cb_auth}>正品</span>
                                </div>
                                <p className={styles.c_spec}>{p.alcoholPercentage}度 / {p.volumeMl}ml</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 플로팅 고객서비스 버튼 ─────────────────────────── */}
            <div className={styles.float_service}>
                {serviceMsg && (
                    <div className={styles.service_tooltip}>
                        고객센터: support@joomidang.com
                        <button onClick={() => setServiceMsg(false)} className={styles.tooltip_close}>×</button>
                    </div>
                )}
                <div className={styles.fs_item} onClick={() => setServiceMsg(v => !v)}>💬<span>客服</span></div>
                <div className={styles.fs_item} onClick={() => navigate('/cart')}>🛒<span>购物车</span></div>
                <div className={styles.fs_item} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>⬆️<span>顶部</span></div>
            </div>

            <footer className={styles.footer}>
                <div className={styles.footer_grid}>
                    <div>
                        <p className={styles.f_logo}>酒美堂 · 주미당</p>
                        <p className={styles.f_text}>韩国传统酒专营店 | 正品保证</p>
                    </div>
                    <div>
                        <p className={styles.f_head}>帮助中心</p>
                        {['购物流程','支付方式','配送方式','售后服务','投诉建议'].map(l=>(
                            <p key={l} className={styles.f_link}>{l}</p>
                        ))}
                    </div>
                    <div>
                        <p className={styles.f_head}>关于我们</p>
                        {['公司简介','联系我们','法律声明','隐私政策','营业执照'].map(l=>(
                            <p key={l} className={styles.f_link}>{l}</p>
                        ))}
                    </div>
                </div>
                <p className={styles.f_bottom}>© 2026 酒美堂 (주미당) | 未成年人禁止购买酒类商品 | ICP备XXXXXXXX号</p>
            </footer>
        </div>
    );
}

export default MainPageCN;
