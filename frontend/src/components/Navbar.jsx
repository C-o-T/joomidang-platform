import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useGeo } from '../context/GeoContext';
import { AVAILABLE_LANGS, TARGET_COUNTRIES } from '../i18n/countries';
import { THEMES, getThemeForCountry } from '../i18n/themes';
import styles from './Navbar.module.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, lang, setLang, country, setCountry } = useGeo();

    const [user, setUser] = useState(null);
    const [langOpen, setLangOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const langRef    = useRef(null);
    const countryRef = useRef(null);

    // 페이지가 바뀔 때마다 로그인 상태 확인
    useEffect(() => {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
    }, [location]);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (langRef.current    && !langRef.current.contains(e.target))    setLangOpen(false);
            if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const currentLang    = AVAILABLE_LANGS.find(l => l.code === lang);
    const currentCountry = TARGET_COUNTRIES.find(c => c.code === country);
    // 현재 테마 정보 (배지 표시용)
    const currentTheme   = THEMES[getThemeForCountry(country)] || THEMES.default;

    return (
        <header className={styles.header_wrap}>
            {/* 상단 네이비게이션 */}
            <div className={styles.navbar_top}>
                <Link to="/" className={styles.logo}>
                    주미당 <span>酒美堂</span>
                </Link>

                <div className={styles.nav_right}>
                    {/* ── 국가 선택 드롭다운 ──────────────────────────────── */}
                    <div className={styles.lang_selector} ref={countryRef}>
                        <button
                            className={styles.lang_btn}
                            onClick={() => { setCountryOpen(!countryOpen); setLangOpen(false); }}
                            title={currentTheme.label}
                        >
                            {currentCountry
                                ? `${currentCountry.flag} ${currentCountry.code}`
                                : '🌐'
                            } ▾
                        </button>

                        {countryOpen && (
                            <div className={`${styles.lang_dropdown} ${styles.country_dropdown}`}>
                                {/* 현재 테마 배지 */}
                                <div className={styles.theme_badge}>
                                    {currentTheme.emoji} {currentTheme.label}
                                </div>
                                {TARGET_COUNTRIES.map(c => (
                                    <button
                                        key={c.code}
                                        className={`${styles.lang_opt} ${styles.country_opt} ${c.code === country ? styles.lang_active : ''}`}
                                        onClick={() => { setCountry(c.code); setCountryOpen(false); }}
                                    >
                                        <span className={styles.co_flag}>{c.flag}</span>
                                        <span className={styles.co_info}>
                                            <span className={styles.co_name}>{c.name[lang] || c.name['en']}</span>
                                            <span className={styles.co_theme}>{c.theme_desc?.[lang] || c.theme_desc?.['en'] || ''}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── 언어 선택 드롭다운 ──────────────────────────────── */}
                    <div className={styles.lang_selector} ref={langRef}>
                        <button
                            className={styles.lang_btn}
                            onClick={() => { setLangOpen(!langOpen); setCountryOpen(false); }}
                        >
                            {currentLang?.flag} {lang.toUpperCase()} ▾
                        </button>

                        {langOpen && (
                            <div className={styles.lang_dropdown}>
                                {AVAILABLE_LANGS.map(l => (
                                    <button
                                        key={l.code}
                                        className={`${styles.lang_opt} ${l.code === lang ? styles.lang_active : ''}`}
                                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                                    >
                                        {l.flag} {l.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className={styles.nav_link}>{t.nav_cart}</Link>

                    {/* SELLER 로그인 시 대시보드 + 수출 가이드 메뉴 */}
                    {user?.role === 'SELLER' && (
                        <>
                            <Link to="/seller/dashboard" className={styles.export_btn}>
                                🏭 판매자 관리
                            </Link>
                            <Link to="/export-guide" className={styles.export_btn}>
                                🌏 {t.nav_export}
                            </Link>
                        </>
                    )}

                    {/* ADMIN 로그인 시 관리자 패널 */}
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className={styles.export_btn}>
                            ⚙️ 관리자
                        </Link>
                    )}

                    {/* 로그인 상태에 따라 다른 UI */}
                    {user ? (
                        <>
                            <span className={styles.nav_link}>{t.nav_greeting(user.name)}</span>
                            <button className={styles.logout_btn} onClick={handleLogout}>{t.nav_logout}</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.nav_link}>{t.nav_login}</Link>
                            <Link to="/join"  className={styles.join_btn}>{t.nav_join}</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
