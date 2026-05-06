import { createContext, useContext, useEffect, useState } from 'react';
import { COUNTRY_LANG_MAP } from '../i18n/countries';
import { translations } from '../i18n/translations';
import { getThemeForCountry } from '../i18n/themes';

const GeoContext = createContext(null);

// <html data-theme="..."> 적용 - CSS Custom Properties가 전체에 cascade
function applyTheme(countryCode) {
    const theme = getThemeForCountry(countryCode);
    document.documentElement.setAttribute('data-theme', theme);
}

export function GeoProvider({ children }) {
    // ── localStorage에서 초기값을 직접 읽어 상태 결정 ──────────────────────
    // useEffect는 첫 렌더 이후 실행되므로, localStorage 데이터가 있어도
    // 첫 프레임은 ready=false → 검은 화면 깜빡임 발생. 초기값에서 직접 처리.
    const _savedCountry = localStorage.getItem('jd_country') || '';
    const _savedLang    = localStorage.getItem('jd_lang')    || '';
    const _initLang = (_savedLang && translations[_savedLang])
        ? _savedLang
        : (_savedCountry ? COUNTRY_LANG_MAP[_savedCountry] || 'en' : 'en');

    const [country, setCountryState] = useState(_savedCountry);
    const [lang,    setLangState]    = useState(_initLang);
    // localStorage에 데이터가 있으면 첫 렌더부터 ready=true (검은 화면 없음)
    // 없으면 IP 감지 완료 후 true로 전환
    const [ready, setReady] = useState(!!(_savedCountry || _savedLang));

    useEffect(() => {
        // localStorage에서 이미 국가가 복원된 경우 → 테마 적용 후 종료
        if (_savedCountry) {
            applyTheme(_savedCountry);
            return;
        }
        // 언어만 저장된 경우도 이미 처리됨
        if (_savedLang && translations[_savedLang]) return;

        // IP API로 접속 국가 감지 (첫 방문, localStorage 없음)
        fetch('https://ip-api.com/json?fields=status,countryCode')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.countryCode) {
                    const code = data.countryCode;
                    setCountryState(code);
                    setLangState(COUNTRY_LANG_MAP[code] || 'en');
                    applyTheme(code);
                } else {
                    // localhost / private IP → 개발 환경 기본값
                    setCountryState('KR');
                    setLangState('ko');
                    applyTheme('KR');
                }
            })
            .catch(() => {
                setLangState('en');
            })
            .finally(() => setReady(true));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 국가 수동 변경: 테마 + 언어를 해당 나라 기본값으로 함께 변경
    const setCountry = (code) => {
        setCountryState(code);
        localStorage.setItem('jd_country', code);
        // 나라를 바꾸면 그 나라의 기본 언어로 초기화 (이후 언어 드롭다운으로 개별 변경 가능)
        const newLang = COUNTRY_LANG_MAP[code] || 'en';
        setLangState(newLang);
        localStorage.setItem('jd_lang', newLang);
        applyTheme(code);
    };

    // 언어 수동 변경 (나라/테마는 그대로)
    const setLang = (newLang) => {
        if (!translations[newLang]) return;
        setLangState(newLang);
        localStorage.setItem('jd_lang', newLang);
    };

    const t = translations[lang] || translations['en'];

    return (
        <GeoContext.Provider value={{ country, setCountry, lang, setLang, t, ready }}>
            {children}
        </GeoContext.Provider>
    );
}

export function useGeo() {
    return useContext(GeoContext);
}
