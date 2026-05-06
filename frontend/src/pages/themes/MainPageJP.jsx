// JP 테마 - 楽天市場 스타일
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES, getStat } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import styles from './MainPageJP.module.css';
import CountryLangToggle from '../../components/CountryLangToggle';

function Stars({ r }) {
    const n = Math.round(r || 4);
    return (
        <span className={styles.stars}>
            {'★'.repeat(n)}{'☆'.repeat(5 - n)}
            <em className={styles.star_val}> {(r || 4).toFixed(1)}</em>
        </span>
    );
}

// KRW → JPY (rough conversion for filter thresholds)
const KRW_TO_JPY = 0.11;
const PRICE_RANGES = {
    '〜¥1,000':          [0,      9090],
    '¥1,000〜¥3,000':   [9090,  27270],
    '¥3,000〜¥5,000':   [27270, 45450],
    '¥5,000〜¥10,000':  [45450, 90900],
    '¥10,000〜':         [90900, Infinity],
};
const ABV_RANGES = {
    '〜5%':    [0,  5],
    '5%〜10%': [5,  10],
    '10%〜20%':[10, 20],
    '20%〜':   [20, 100],
};
const INITIAL_CHECKS = { '送料無料のみ': false, 'ポイント5倍以上': false, 'レビュー4★以上': false, 'セール品のみ': false, '在庫あり': false };

const getWishlist = () => new Set(JSON.parse(localStorage.getItem('jd_wishlist') || '[]'));

function MainPageJP() {
    const navigate = useNavigate();
    const { t, lang, country } = useGeo();
    const { products, filtered, selectedCategory } = useProducts();

    const [rankTab,  setRankTab]  = useState('total');
    const [searchVal, setSearchVal] = useState('');
    const [sortVal,  setSortVal]  = useState('おすすめ順');
    const [priceFilter, setPriceFilter] = useState(null);
    const [abvFilter,   setAbvFilter]   = useState(null);
    const [filterChecks, setFilterChecks] = useState(INITIAL_CHECKS);
    const [wishlist, setWishlist] = useState(getWishlist);

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

    // 랭킹 정렬
    const rankSorted = useMemo(() => {
        if (rankTab === 'review') return [...products].sort((a, b) => (getStat(b,'reviews')||0) - (getStat(a,'reviews')||0));
        if (rankTab === 'new')    return [...products].sort((a, b) => (b.id||0) - (a.id||0));
        if (rankTab === 'sale')   return [...products].filter(p => (p.discount||0) > 0).sort((a, b) => (b.discount||0) - (a.discount||0));
        return [...products].sort((a, b) => (getStat(b,'sold')||0) - (getStat(a,'sold')||0));
    }, [products, rankTab]);

    // 검색 + 사이드바 필터 + 정렬 적용
    const displayFiltered = useMemo(() => {
        let list = [...filtered];
        const q = searchVal.trim().toLowerCase();
        if (q) list = list.filter(p =>
            getProductName(p, lang).toLowerCase().includes(q) ||
            (p.brewery||'').toLowerCase().includes(q) ||
            (p.breweryJa||'').toLowerCase().includes(q) ||
            (p.category||'').toLowerCase().includes(q)
        );
        if (priceFilter) {
            const [lo, hi] = PRICE_RANGES[priceFilter];
            list = list.filter(p => (p.price||0) >= lo && (p.price||0) < hi);
        }
        if (abvFilter) {
            const [lo, hi] = ABV_RANGES[abvFilter];
            list = list.filter(p => (p.alcoholPercentage||0) >= lo && (p.alcoholPercentage||0) < hi);
        }
        if (filterChecks['セール品のみ']) list = list.filter(p => (p.discount||0) > 0);
        if (filterChecks['在庫あり'])     list = list.filter(p => (p.stock||0) > 0);
        if (filterChecks['レビュー4★以上']) list = list.filter(p => (getStat(p,'rating')||0) >= 4);
        // 정렬
        if (sortVal === '価格の安い順')   list.sort((a, b) => (a.price||0) - (b.price||0));
        if (sortVal === '価格の高い順')   list.sort((a, b) => (b.price||0) - (a.price||0));
        if (sortVal === 'レビュー件数順') list.sort((a, b) => (getStat(b,'reviews')||0) - (getStat(a,'reviews')||0));
        if (sortVal === '新着順')         list.sort((a, b) => (b.id||0) - (a.id||0));
        return list;
    }, [filtered, searchVal, lang, priceFilter, abvFilter, filterChecks, sortVal]);

    const toggleCheck = (key) => setFilterChecks(c => ({ ...c, [key]: !c[key] }));

    return (
        <div className={styles.wrapper}>

            {/* ── 검색 헤더 ─────────────────────────────────────────── */}
            <header className={styles.search_header}>
                <div className={styles.logo_block}>
                    <div className={styles.logo_main}>楽天市場</div>
                    <div className={styles.logo_sub}>주미당 전통주점</div>
                </div>
                <div className={styles.search_block}>
                    <div className={styles.search_row}>
                        <input
                            className={styles.search_input}
                            placeholder="商品・ショップ・ブランドを探す"
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                        />
                        <button className={styles.search_btn} onClick={() => setSearchVal(searchVal)}>検索</button>
                    </div>
                    <div className={styles.search_opts}>
                        <span className={styles.so_active}>▸ {displayFiltered.length}件を表示中</span>
                        <span onClick={() => setSearchVal('')} style={{ cursor: 'pointer', color: '#999' }}>▸ 検索をリセット</span>
                        <span>▸ カテゴリーで絞り込む</span>
                    </div>
                </div>
                <nav className={styles.header_icons}>
                    <CountryLangToggle variant="dark" />
                    <div className={styles.hi_item} onClick={() => navigate('/cart')}>
                        <span>🛒</span><span className={styles.hi_label}>カート</span>
                    </div>
                    <div className={styles.hi_item} onClick={() => navigate(loggedUser ? '/' : '/login')}>
                        <span>👤</span><span className={styles.hi_label}>マイページ</span>
                    </div>
                    <div className={styles.hi_item} onClick={() => { /* wishlist page future */ }}>
                        <span>❤️</span><span className={styles.hi_label}>お気に入り({wishlist.size})</span>
                    </div>
                    <div className={styles.hi_item} onClick={() => navigate(loggedUser ? '/' : '/login')}>
                        <span>📦</span><span className={styles.hi_label}>注文履歴</span>
                    </div>
                </nav>
            </header>

            {/* ── 포인트 캠페인 배너 ─────────────────────────────────── */}
            <div className={styles.point_banner}>
                <span className={styles.pb_flame}>🔥</span>
                <span className={styles.pb_main}>
                    【期間限定】お買い物マラソン開催中！全商品ポイント最大
                    <strong className={styles.pb_pt}> 10倍 </strong>獲得！
                    さらに初回購入で <strong>500ポイント</strong>プレゼント
                </span>
                <span className={styles.pb_timer}>⏱ 終了まで 23:47:08</span>
            </div>

            {/* ── 카테고리 탭 바 ─────────────────────────────────────── */}
            <nav className={styles.cat_nav}>
                <span className={styles.cat_label}>カテゴリー :</span>
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        className={`${styles.cat_btn} ${selectedCategory === cat ? styles.cat_active : ''}`}
                        onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                        {t[CATEGORY_KEYS[cat]]}
                    </button>
                ))}
            </nav>

            {/* ── 사이드바 + 메인 2컬럼 ───────────────────────────── */}
            <div className={styles.content_layout}>

                {/* 사이드바 */}
                <aside className={styles.sidebar}>

                    <div className={styles.sb_block}>
                        <p className={styles.sb_head}>📂 カテゴリーから探す</p>
                        {CATEGORIES.map(cat => (
                            <button key={cat}
                                className={`${styles.sb_link} ${selectedCategory === cat ? styles.sb_active : ''}`}
                                onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                                ▷ {t[CATEGORY_KEYS[cat]]}
                            </button>
                        ))}
                    </div>

                    <div className={styles.sb_block}>
                        <p className={styles.sb_head}>🔍 絞り込み</p>
                        {Object.keys(INITIAL_CHECKS).map(f => (
                            <label key={f} className={styles.sb_check}>
                                <input
                                    type="checkbox"
                                    checked={filterChecks[f]}
                                    onChange={() => toggleCheck(f)}
                                />
                                {' '}{f}
                            </label>
                        ))}
                    </div>

                    <div className={styles.sb_block}>
                        <p className={styles.sb_head}>💴 価格帯</p>
                        {Object.keys(PRICE_RANGES).map(p => (
                            <button key={p}
                                className={`${styles.price_btn} ${priceFilter === p ? styles.filter_active : ''}`}
                                onClick={() => setPriceFilter(prev => prev === p ? null : p)}>
                                {p}
                            </button>
                        ))}
                    </div>

                    <div className={styles.sb_block}>
                        <p className={styles.sb_head}>🍶 アルコール度数</p>
                        {Object.keys(ABV_RANGES).map(a => (
                            <button key={a}
                                className={`${styles.price_btn} ${abvFilter === a ? styles.filter_active : ''}`}
                                onClick={() => setAbvFilter(prev => prev === a ? null : a)}>
                                {a}
                            </button>
                        ))}
                    </div>

                    <div className={styles.point_box}>
                        <p className={styles.ptb_label}>💰 現在のポイント</p>
                        {loggedUser ? (
                            <>
                                <p className={styles.ptb_val}>—<span className={styles.ptb_p}> P</span></p>
                                <p className={styles.ptb_exp}>ポイント機能は準備中です</p>
                            </>
                        ) : (
                            <>
                                <p className={styles.ptb_val}>0<span className={styles.ptb_p}> P</span></p>
                                <p className={styles.ptb_exp}>会員登録でポイント獲得</p>
                                <div className={styles.ptb_bar_wrap}>
                                    <div className={styles.ptb_bar} style={{ width: '0%' }} />
                                </div>
                                <p className={styles.ptb_hint}>登録してポイントをためよう</p>
                                <button className={styles.ptb_btn} onClick={() => navigate('/join')}>会員登録でポイントGET</button>
                            </>
                        )}
                    </div>

                    <div className={styles.sb_banner}>
                        <p>🎁 ギフト対応可能</p>
                        <p className={styles.sbb_sub}>のし・包装・メッセージカード対応</p>
                    </div>

                </aside>

                {/* 메인 영역 */}
                <main className={styles.main_area}>

                    {/* 캠페인 배너 */}
                    <div className={styles.campaign_area}>
                        <div className={styles.camp_main}>
                            <span className={styles.camp_tag}>🇰🇷 韓国直輸入 正規品</span>
                            <h1 className={styles.camp_title}>{t.hero_title}</h1>
                            <p className={styles.camp_desc}>
                                本場韓国の伝統酒をお届け。マッコリ・焼酎・薬酒など豊富なラインナップ。
                                全品<strong>送料無料</strong>・ポイント還元でお得に購入。
                            </p>
                            <div className={styles.camp_btns}>
                                <button className={styles.camp_btn_main} onClick={() => navigate('/join')}>今すぐ購入する</button>
                                <button className={styles.camp_btn_sub} onClick={() => navigate('/')}>全商品一覧を見る →</button>
                            </div>
                        </div>
                        <div className={styles.camp_cards}>
                            {[
                                { icon: '🆕', t: '新着商品', s: '今週入荷', cat: null },
                                { icon: '🏆', t: '週間1位', s: '売れ筋No.1', cat: null },
                                { icon: '🎁', t: 'ギフトセット', s: '贈り物に最適', cat: null },
                            ].map(c => (
                                <div key={c.t} className={styles.cc} onClick={() => navigate('/')}>
                                    <span className={styles.cc_icon}>{c.icon}</span>
                                    <p className={styles.cc_title}>{c.t}</p>
                                    <p className={styles.cc_sub}>{c.s}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 랭킹 섹션 */}
                    <section className={styles.rank_sec}>
                        <div className={styles.rank_head}>
                            <h2 className={styles.rank_title}>🏆 売れ筋ランキング</h2>
                            <div className={styles.rank_tabs}>
                                {[['total','総合'],['review','レビュー'],['new','新着'],['sale','セール']].map(([id, lbl]) => (
                                    <button key={id}
                                        className={`${styles.rt_btn} ${rankTab === id ? styles.rt_active : ''}`}
                                        onClick={() => setRankTab(id)}>{lbl}</button>
                                ))}
                            </div>
                            <button className={styles.rank_more} onClick={() => navigate('/')}>ランキング全件を見る &gt;&gt;</button>
                        </div>
                        <div className={styles.rank_list}>
                            {rankSorted.slice(0, 5).map((p, i) => (
                                <div key={p.id} className={styles.rank_item}
                                    onClick={() => navigate(`/products/${p.id}`)}>
                                    <div className={`${styles.rank_medal} ${
                                        i===0?styles.gold:i===1?styles.silver:i===2?styles.bronze:styles.other_rank
                                    }`}>
                                        {i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}位`}
                                    </div>
                                    <div className={styles.ri_img}>🍶</div>
                                    <div className={styles.ri_info}>
                                        <p className={styles.ri_store}>주미당 공식점 ★</p>
                                        <p className={styles.ri_name}>{getProductName(p, lang)}</p>
                                        <div className={styles.ri_row}>
                                            {getStat(p,'rating') !== null
                                                ? <Stars r={getStat(p,'rating')} />
                                                : <span className={styles.no_stat}>レビュー募集中</span>}
                                            {getStat(p,'reviews') !== null
                                                ? <span className={styles.ri_cnt}>({getStat(p,'reviews').toLocaleString()}件)</span>
                                                : null}
                                        </div>
                                        {getStat(p,'sold') !== null
                                            ? <p className={styles.ri_sold}>販売数: {getStat(p,'sold').toLocaleString()}個</p>
                                            : <p className={styles.ri_sold_placeholder}>販売データ準備中</p>}
                                    </div>
                                    <div className={styles.ri_right}>
                                        <p className={styles.ri_price}>{formatPrice(p.price, country)}</p>
                                        {(p.discount||0)>0 && <p className={styles.ri_orig}>{formatPrice(p.originalPrice, country)}</p>}
                                        <div className={styles.ri_badges}>
                                            <span className={styles.ri_pt}>P{50+i*20}倍</span>
                                            <span className={styles.ri_ship}>送料無料</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 상품 그리드 */}
                    <section className={styles.prod_sec}>
                        <div className={styles.ps_head}>
                            <h2 className={styles.ps_title}>全商品一覧</h2>
                            <p className={styles.ps_count}>{displayFiltered.length}件</p>
                            <select className={styles.sort_sel} value={sortVal} onChange={e => setSortVal(e.target.value)}>
                                <option>おすすめ順</option>
                                <option>価格の安い順</option>
                                <option>価格の高い順</option>
                                <option>レビュー件数順</option>
                                <option>新着順</option>
                            </select>
                        </div>
                        {displayFiltered.length === 0 ? (
                            <div className={styles.empty_msg}>
                                <p>条件に一致する商品がありません</p>
                                <button className={styles.reset_btn}
                                    onClick={() => { setSearchVal(''); setPriceFilter(null); setAbvFilter(null); setFilterChecks(INITIAL_CHECKS); }}>
                                    フィルターをリセット
                                </button>
                            </div>
                        ) : (
                            <div className={styles.product_grid}>
                                {displayFiltered.map((p, i) => (
                                    <div key={p.id} className={styles.card}
                                        onClick={() => navigate(`/products/${p.id}`)}>
                                        {i === 0 && sortVal === 'おすすめ順' && <div className={styles.rank1_ribbon}>1位</div>}
                                        {(p.discount||0) > 0 && <div className={styles.sale_ribbon}>{p.discount}%OFF</div>}
                                        <div className={styles.card_img}>🍶</div>
                                        <div className={styles.card_body}>
                                            <p className={styles.c_store}>주미당 공식점</p>
                                            <p className={styles.c_name}>{getProductName(p, lang)}</p>
                                            <p className={styles.c_kuramoto}>{p.breweryJa || p.brewery}</p>
                                            <p className={styles.c_sanchi}>🗾 {p.regionEn || p.region}</p>
                                            {p.heritageEn && (
                                                <span className={styles.c_bunkazai}>{p.heritageEn}</span>
                                            )}
                                            <div className={styles.c_star_row}>
                                                {getStat(p,'rating') !== null
                                                    ? <Stars r={getStat(p,'rating')} />
                                                    : <span className={styles.no_stat}>最初のレビューを書く</span>}
                                                {getStat(p,'reviews') !== null
                                                    ? <span className={styles.c_cnt}>({getStat(p,'reviews').toLocaleString()})</span>
                                                    : null}
                                            </div>
                                            <div className={styles.c_price_row}>
                                                <span className={styles.c_price}>{formatPrice(p.price, country)}</span>
                                                <span className={styles.c_tax}>税込</span>
                                            </div>
                                            {(p.discount||0)>0 && (
                                                <p className={styles.c_orig}>通常 {formatPrice(p.originalPrice, country)}</p>
                                            )}
                                            <div className={styles.c_badges}>
                                                <span className={styles.b_pt}>P{30+i*10}倍</span>
                                                <span className={styles.b_ship}>送料無料</span>
                                                {i%3===0 && <span className={styles.b_gift}>ギフト可</span>}
                                            </div>
                                            <p className={styles.c_spec}>{p.alcoholPercentage}度 · {p.volumeMl}ml</p>
                                        </div>
                                        <div className={styles.card_foot}>
                                            <button className={styles.cf_cart}
                                                onClick={e => { e.stopPropagation(); navigate('/cart'); }}>
                                                カートに入れる
                                            </button>
                                            <button
                                                className={`${styles.cf_fav} ${wishlist.has(p.id) ? styles.cf_fav_on : ''}`}
                                                onClick={e => toggleWishlist(e, p.id)}>
                                                {wishlist.has(p.id) ? '❤️' : '♡'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </main>
            </div>

            {/* 푸터 */}
            <footer className={styles.footer}>
                <div className={styles.footer_links}>
                    {['利用規約','プライバシーポリシー','特定商取引法に基づく表示','お問い合わせ','よくある質問','会社概要'].map(l => (
                        <span key={l} className={styles.fl}>{l}</span>
                    ))}
                </div>
                <p className={styles.f_copy}>
                    © 2026 주미당 (酒美堂) | 未成年者への酒類の販売はいたしません
                </p>
            </footer>
        </div>
    );
}

export default MainPageJP;
