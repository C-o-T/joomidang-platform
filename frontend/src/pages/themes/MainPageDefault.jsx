// Default 테마 - 현재 다크 미니멀 스타일 유지
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../context/GeoContext';
import { CATEGORY_KEYS, getProductName } from '../../i18n/countries';
import { useProducts, CATEGORIES } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import styles from './MainPageDefault.module.css';

function getBrewery(p, lang) {
    if (lang === 'ja') return p.breweryJa || p.breweryEn || p.brewery || '';
    if (lang === 'zh') return p.breweryZh || p.breweryEn || p.brewery || '';
    if (lang === 'en') return p.breweryEn || p.brewery || '';
    return p.brewery || p.breweryEn || '';
}
function getRegion(p, lang) {
    if (lang === 'ko') return p.region || p.regionEn || '';
    return p.regionEn || p.region || '';
}
function getHeritage(p, lang) {
    if (lang === 'ko') return p.heritage || p.heritageEn || '';
    return p.heritageEn || p.heritage || '';
}

function MainPageDefault() {
    const navigate = useNavigate();
    const { t, lang, country } = useGeo();
    const { filtered, selectedCategory } = useProducts();

    return (
        <div>
            <section className={styles.hero}>
                <p className={styles.hero_sub}>{t.hero_sub}</p>
                <h1 className={styles.hero_title} style={{ whiteSpace: 'pre-line' }}>{t.hero_title}</h1>
                <p className={styles.hero_desc} style={{ whiteSpace: 'pre-line' }}>{t.hero_desc}</p>
                <button className={styles.hero_btn} onClick={() => navigate('/join')}>{t.hero_btn}</button>
            </section>

            <div className={styles.body}>
                <div className={styles.filter_row}>
                    {CATEGORIES.map(cat => (
                        <button key={cat}
                            className={`${styles.filter_btn} ${selectedCategory === cat ? styles.active : ''}`}
                            onClick={() => navigate(cat === '전체' ? '/' : `/?category=${cat}`)}>
                            {t[CATEGORY_KEYS[cat]]}
                        </button>
                    ))}
                    <span className={styles.filter_count}>{t.filter_count(filtered.length)}</span>
                </div>

                {filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <span style={{ fontSize: '48px' }}>🍶</span>
                        <p>{t.empty}</p>
                    </div>
                ) : (
                    <div className={styles.product_grid}>
                        {filtered.map(product => (
                            <div key={product.id} className={styles.product_card}
                                onClick={() => navigate(`/products/${product.id}`)}>
                                <div className={styles.img_box}>🍶</div>
                                <div className={styles.card_body}>
                                    <span className={styles.badge}>{t[CATEGORY_KEYS[product.category]] || product.category}</span>
                                    <h3 className={styles.product_name}>{getProductName(product, lang)}</h3>
                                    {(getBrewery(product, lang) || getRegion(product, lang)) && (
                                        <p className={styles.card_origin}>
                                            {getBrewery(product, lang)}
                                            {getBrewery(product, lang) && getRegion(product, lang) && (
                                                <span className={styles.dot}> · </span>
                                            )}
                                            {getRegion(product, lang)}
                                        </p>
                                    )}
                                    {getHeritage(product, lang) && (
                                        <span className={styles.heritage}>{getHeritage(product, lang)}</span>
                                    )}
                                    <p className={styles.product_spec}>{product.alcoholPercentage}{t.degree} · {product.volumeMl}{t.volume_unit}</p>
                                    <p className={styles.product_price}>{formatPrice(product.price, country)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className={styles.footer}>
                <div className={styles.footer_inner}>
                    <p className={styles.footer_logo}>주미당 酒美堂</p>
                    <p className={styles.footer_legal}>{t.footer_legal}</p>
                    <p className={styles.footer_legal} style={{ marginTop: '4px' }}>{t.footer_biz}</p>
                </div>
            </footer>
        </div>
    );
}

export default MainPageDefault;
