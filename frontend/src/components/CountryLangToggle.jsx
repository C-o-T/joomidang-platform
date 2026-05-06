import { useState, useRef, useEffect } from 'react';
import { useGeo } from '../context/GeoContext';
import { TARGET_COUNTRIES, AVAILABLE_LANGS } from '../i18n/countries';
import styles from './CountryLangToggle.module.css';

// variant: 'light' (밝은 배경용 — KR·SEA·EU) / 'dark' (어두운 배경용 — JP·CN·US)
function CountryLangToggle({ variant = 'light' }) {
    const { lang, setLang, country, setCountry } = useGeo();
    const [open, setOpen] = useState(false);
    const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
    const wrapRef = useRef(null);
    const btnRef  = useRef(null);

    useEffect(() => {
        const onClickOutside = e => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        const onScroll = () => setOpen(false);
        document.addEventListener('mousedown', onClickOutside);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, []);

    const handleToggle = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setPanelPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
        }
        setOpen(v => !v);
    };

    const cur     = TARGET_COUNTRIES.find(c => c.code === country);
    const curLang = AVAILABLE_LANGS.find(l => l.code === lang);

    return (
        <div ref={wrapRef} className={`${styles.wrap} ${styles[variant]}`}>
            <button ref={btnRef} className={styles.btn} onClick={handleToggle}>
                <span>{cur?.flag || '🌐'}</span>
                <span className={styles.code}>{country || '--'}</span>
                <span className={styles.sep}>/</span>
                <span>{curLang?.flag}</span>
                <span className={styles.code}>{lang?.toUpperCase()}</span>
                <span className={styles.arrow}>▾</span>
            </button>

            {open && (
                <div className={styles.panel}
                    style={{ position: 'fixed', top: panelPos.top, right: panelPos.right }}>
                    <p className={styles.panel_head}>Region / Country</p>
                    <div className={styles.country_grid}>
                        {TARGET_COUNTRIES.map(c => (
                            <button key={c.code}
                                className={`${styles.c_opt} ${c.code === country ? styles.c_active : ''}`}
                                onClick={() => { setCountry(c.code); setOpen(false); }}>
                                <span>{c.flag}</span>
                                <span>{c.name[lang] || c.name.en}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.divider} />

                    <p className={styles.panel_head}>Language</p>
                    <div className={styles.lang_row}>
                        {AVAILABLE_LANGS.map(l => (
                            <button key={l.code}
                                className={`${styles.l_opt} ${l.code === lang ? styles.l_active : ''}`}
                                onClick={() => { setLang(l.code); setOpen(false); }}>
                                {l.flag} {l.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CountryLangToggle;
