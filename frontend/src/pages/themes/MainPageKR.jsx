// KR 테마 - 쿠팡(Coupang) 스타일
// 구조: 로켓배송 스트립 / 탭 전환 (로켓배송|오늘의딜|전체) / 오늘의 딜 타이머 / 클린 상품 그리드
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES, getStat, STATS_FROM_DB } from '../../hooks/useProducts';
import styles from './MainPageKR.module.css';
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

function Stars({ r }) {
    const n = Math.round(r || 4);
    return <span className={styles.stars}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

const TABS = [
    { id: 'rocket', label: '🚀 로켓배송', sub: '내일 도착' },
    { id: 'deal', label: '🔥 오늘의딜', sub: '오늘만 특가' },
    { id: 'all', label: '📦 전체상품', sub: '' },
    { id: 'review', label: '⭐ 후기많은', sub: '' },
];

function MainPageKR() {
    const navigate = useNavigate();
    const { t, lang } = useGeo();
    const { products, filtered, selectedCategory } = useProducts();
    const [activeTab, setActiveTab] = useState('all');

    const dealEnd = Date.now() + 6 * 3600000 + 42 * 60000 + 18000;
    const { h, m, s } = useCountdown(dealEnd);

    const dealProducts = products.filter(p => (p.discount || 0) > 0);
    const reviewProducts = [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    const rocketProducts = products.slice(0, 5);

    let displayProducts = filtered;
    if (activeTab === 'rocket') displayProducts = rocketProducts;
    else if (activeTab === 'deal') displayProducts = dealProducts;
    else if (activeTab === 'review') displayProducts = reviewProducts;

    return (
        <div className={styles.wrapper}>

            {/* ── 국가/언어 선택 ── */}
            <div className={styles.geo_bar}><CountryLangToggle variant="light" /></div>

            {/* ── 로켓배송 스트립 ────────────────────────────────── */}
            <div className={styles.rocket_strip}>
                <div className={styles.rs_inner}>
                    <div className={styles.rs_item}>
                        <span className={styles.rs_icon}>🚀</span>
                        <div>
                            <p className={styles.rs_title}>로켓배송</p>
                            <p className={styles.rs_sub}>오늘 주문 내일 도착</p>
                        </div>
                    </div>
                    <div className={styles.rs_item}>
                        <span className={styles.rs_icon}>✅</span>
                        <div>
                            <p className={styles.rs_title}>정품 인증</p>
                            <p className={styles.rs_sub}>한국 직수입 정품</p>
                        </div>
                    </div>
                    <div className={styles.rs_item}>
                        <span className={styles.rs_icon}>🔄</span>
                        <div>
                            <p className={styles.rs_title}>30일 무료반품</p>
                            <p className={styles.rs_sub}>이유 불문 반품 가능</p>
                        </div>
                    </div>
                    <div className={styles.rs_item}>
                        <span className={styles.rs_icon}>💳</span>
                        <div>
                            <p className={styles.rs_title}>10% 할인</p>
                            <p className={styles.rs_sub}>카드 즉시할인 적용</p>
                        </div>
                    </div>
                    <button className={styles.rs_join} onClick={() => navigate('/join')}>
                        회원가입 →
                    </button>
                </div>
            </div>

            {/* ── 히어로 ─────────────────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.hero_left}>
                    <p className={styles.hero_eyebrow}>한국 전통주 전문 쇼핑몰</p>
                    <h1 className={styles.hero_title}>{t.hero_title}</h1>
                    <p className={styles.hero_desc}>{t.hero_desc}</p>
                    <div className={styles.hero_actions}>
                        <button className={styles.hero_btn_primary} onClick={() => navigate('/join')}>
                            {t.hero_btn}
                        </button>
                        <button className={styles.hero_btn_ghost} onClick={() => navigate('/')}>
                            전체 상품 보기
                        </button>
                    </div>
                </div>
                <div className={styles.hero_stats}>
                    {/* 판매 상품 수는 실제 데이터 기반으로 표시 가능 */}
                    <div className={styles.stat_box}>
                        <p className={styles.stat_val}>{products.length}+</p>
                        <p className={styles.stat_label}>판매 상품</p>
                    </div>
                    {/* 아래 세 항목은 실제 DB 데이터 연결 전까지 숨김 */}
                    {STATS_FROM_DB && (
                        <>
                            <div className={styles.stat_box}>
                                <p className={styles.stat_val}>
                                    {(products.reduce((a,p)=>a+(p.reviewCount||0),0)/1000).toFixed(1)}K+
                                </p>
                                <p className={styles.stat_label}>누적 리뷰</p>
                            </div>
                            <div className={styles.stat_box}>
                                <p className={styles.stat_val}>
                                    {products.length > 0
                                        ? (products.reduce((a,p)=>a+(p.rating||0),0)/products.length).toFixed(1)+'★'
                                        : '—'}
                                </p>
                                <p className={styles.stat_label}>평균 평점</p>
                            </div>
                            <div className={styles.stat_box}>
                                <p className={styles.stat_val}>준비 중</p>
                                <p className={styles.stat_label}>구매 만족도</p>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ── 카테고리 탭 ────────────────────────────────────── */}
            <nav className={styles.cat_nav}>
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        className={`${styles.cat_btn} ${selectedCategory === cat ? styles.cat_active : ''}`}
                        onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                        {t[CATEGORY_KEYS[cat]]}
                    </button>
                ))}
            </nav>

            {/* ── 탭 전환 섹션 ────────────────────────────────────── */}
            <section className={styles.main_section}>

                {/* 탭 헤더 */}
                <div className={styles.tab_bar}>
                    {TABS.map(tab => (
                        <button key={tab.id}
                            className={`${styles.tab_btn} ${activeTab === tab.id ? styles.tab_active : ''}`}
                            onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                            {tab.sub && <span className={styles.tab_sub}>{tab.sub}</span>}
                        </button>
                    ))}
                    {activeTab === 'deal' && (
                        <div className={styles.deal_timer}>
                            <span className={styles.dt_label}>마감까지</span>
                            <span className={styles.dt_block}>{h}</span>
                            <span className={styles.dt_colon}>:</span>
                            <span className={styles.dt_block}>{m}</span>
                            <span className={styles.dt_colon}>:</span>
                            <span className={styles.dt_block}>{s}</span>
                        </div>
                    )}
                    <p className={styles.tab_count}>{displayProducts.length}개 상품</p>
                </div>

                {/* 오늘의딜 탭 - 특별 레이아웃 */}
                {activeTab === 'deal' && dealProducts.length > 0 && (
                    <div className={styles.deal_featured}>
                        <div className={styles.df_main}
                            onClick={() => navigate(`/products/${dealProducts[0].id}`)}>
                            <div className={styles.df_img}>🍶</div>
                            <div className={styles.df_info}>
                                <span className={styles.df_badge}>⚡ 오늘만 특가</span>
                                <p className={styles.df_name}>{getProductName(dealProducts[0], lang)}</p>
                                <div className={styles.df_price_row}>
                                    <span className={styles.df_discount}>{dealProducts[0].discount}%</span>
                                    <span className={styles.df_price}>₩{dealProducts[0].price?.toLocaleString()}</span>
                                    <span className={styles.df_orig}>₩{dealProducts[0].originalPrice?.toLocaleString()}</span>
                                </div>
                                <button className={styles.df_btn}>바로 구매하기</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 상품 그리드 */}
                <div className={styles.product_grid}>
                    {displayProducts.map((p, i) => (
                        <div key={p.id} className={styles.card}
                            onClick={() => navigate(`/products/${p.id}`)}>

                            {/* 할인율 원형 배지 */}
                            {(p.discount || 0) > 0 && (
                                <div className={styles.discount_circle}>
                                    <span className={styles.dc_num}>{p.discount}</span>
                                    <span className={styles.dc_pct}>%</span>
                                </div>
                            )}

                            <div className={styles.card_img_wrap}>
                                <div className={styles.card_img}>🍶</div>
                                {activeTab === 'rocket' || (activeTab === 'all' && i < 3) ? (
                                    <div className={styles.rocket_badge}>🚀 로켓배송</div>
                                ) : null}
                            </div>

                            <div className={styles.card_body}>
                                <p className={styles.c_name}>{getProductName(p, lang)}</p>

                                {/* 생산자 투명성 — 마켓컬리 RCA: 유통 불투명성 해소 */}
                                <div className={styles.c_origin_row}>
                                    <span className={styles.c_brewery_nm}>{p.brewery}</span>
                                    <span className={styles.c_dot}>·</span>
                                    <span className={styles.c_region_nm}>{p.region}</span>
                                </div>
                                {p.heritage && (
                                    <div className={styles.c_heritage_badge}>{p.heritage}</div>
                                )}

                                <div className={styles.c_star_row}>
                                    {getStat(p,'rating') !== null ? (
                                        <>
                                            <Stars r={getStat(p,'rating')} />
                                            <span className={styles.c_rating}>{getStat(p,'rating').toFixed(1)}</span>
                                            {getStat(p,'reviews') !== null
                                                ? <span className={styles.c_review}>({getStat(p,'reviews').toLocaleString()})</span>
                                                : null}
                                        </>
                                    ) : (
                                        <span className={styles.no_review}>첫 번째 리뷰를 남겨보세요</span>
                                    )}
                                </div>

                                <div className={styles.c_price_area}>
                                    {(p.discount||0) > 0 && (
                                        <span className={styles.c_discount_pct}>{p.discount}%</span>
                                    )}
                                    <span className={styles.c_price}>₩{p.price?.toLocaleString()}</span>
                                </div>
                                {(p.discount||0) > 0 && (
                                    <p className={styles.c_orig}>₩{p.originalPrice?.toLocaleString()}</p>
                                )}

                                <div className={styles.c_badges}>
                                    {(i % 2 === 0) && <span className={styles.b_rocket}>🚀 로켓배송</span>}
                                    {(p.discount||0) > 0 && <span className={styles.b_deal}>오늘의딜</span>}
                                    {(i % 3 === 0) && <span className={styles.b_lowest}>최저가</span>}
                                </div>

                                <p className={styles.c_spec}>{p.alcoholPercentage}% · {p.volumeMl}ml</p>
                            </div>

                            <button className={styles.card_cart_btn}
                                onClick={e => { e.stopPropagation(); navigate('/cart'); }}>
                                장바구니 담기
                            </button>
                        </div>
                    ))}
                </div>

            </section>

            {/* ── 베스트리뷰 섹션 ─────────────────────────────────── */}
            <section className={styles.review_sec}>
                <h2 className={styles.review_sec_title}>💬 실제 구매 후기</h2>
                <div className={styles.review_list}>
                    {[
                        { name: '김*민', rating: 5, text: '한국 직수입이라 신선하고 맛이 진짜예요. 빠른 배송도 만족!', product: '프리미엄 막걸리' },
                        { name: 'J**n', rating: 5, text: 'Authentic taste, fast delivery. Will order again!', product: '이강주' },
                        { name: '이*준', rating: 4, text: '선물로 구매했는데 포장도 예쁘고 좋아했어요.', product: '안동소주' },
                    ].map(r => (
                        <div key={r.name} className={styles.review_card}>
                            <div className={styles.rc_header}>
                                <span className={styles.rc_name}>{r.name}</span>
                                <span className={styles.rc_stars}>{'★'.repeat(r.rating)}</span>
                                <span className={styles.rc_product}>{r.product}</span>
                            </div>
                            <p className={styles.rc_text}>{r.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footer_grid}>
                    <div>
                        <p className={styles.f_logo}>주미당 酒美堂</p>
                        <p className={styles.f_text}>한국 전통주 전문 역직구 쇼핑몰</p>
                        <p className={styles.f_text}>{t.footer_biz}</p>
                    </div>
                    <div>
                        <p className={styles.f_head}>고객 지원</p>
                        {['공지사항', '자주 묻는 질문', '1:1 문의', '반품/교환 안내'].map(l => (
                            <p key={l} className={styles.f_link}>{l}</p>
                        ))}
                    </div>
                    <div>
                        <p className={styles.f_head}>이용 안내</p>
                        {['이용약관', '개인정보처리방침', '사업자 정보', '주류 판매 신고'].map(l => (
                            <p key={l} className={styles.f_link}>{l}</p>
                        ))}
                    </div>
                </div>
                <p className={styles.f_legal}>{t.footer_legal}</p>
            </footer>
        </div>
    );
}

export default MainPageKR;
