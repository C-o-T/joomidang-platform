//역직구 타겟 국가 목록 - 각기 완전히 다른 UI 테마를 가진 6개 주요 시장
//IP 감지 시 관련 국가들은 자동으로 해당 테마로 매핑됨 (COUNTRY_THEME_MAP 참고)
export const TARGET_COUNTRIES = [
    { code: 'KR', flag: '🇰🇷', lang: 'ko', name: { ko: '한국',     en: 'South Korea',   ja: '韓国',  zh: '韩国' },
      theme_desc: { ko: '쿠팡 / 네이버 스타일', en: 'Coupang / Naver Style' } },
    { code: 'JP', flag: '🇯🇵', lang: 'ja', name: { ko: '일본',     en: 'Japan',         ja: '日本',  zh: '日本' },
      theme_desc: { ko: '楽天 / Yahoo! 스타일',  en: '楽天 / Yahoo! Style' } },
    { code: 'CN', flag: '🇨🇳', lang: 'zh', name: { ko: '중국',     en: 'China',         ja: '中国',  zh: '中国' },
      theme_desc: { ko: '淘宝 / 京东 스타일',    en: '淘宝 / JD.com Style' } },
    { code: 'SG', flag: '🇸🇬', lang: 'en', name: { ko: '동남아시아', en: 'SE Asia',      ja: '東南アジア', zh: '东南亚' },
      theme_desc: { ko: 'Shopee / Lazada 스타일', en: 'Shopee / Lazada Style' } },
    { code: 'US', flag: '🇺🇸', lang: 'en', name: { ko: '미주',     en: 'Americas',      ja: 'アメリカ', zh: '美洲' },
      theme_desc: { ko: 'Amazon 스타일',         en: 'Amazon Style' } },
    { code: 'GB', flag: '🇪🇺', lang: 'en', name: { ko: '유럽',     en: 'Europe',        ja: 'ヨーロッパ', zh: '欧洲' },
      theme_desc: { ko: 'ASOS / Zalando 스타일', en: 'ASOS / Zalando Style' } },
];

//IP 감지된 국가 코드 → 언어 코드 매핑
//명시 안 된 국가는 영어(기본값)로 처리
export const COUNTRY_LANG_MAP = {
    KR: 'ko',
    JP: 'ja',
    CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh',
};

//Navbar 언어 선택 드롭다운에 표시할 언어 목록
export const AVAILABLE_LANGS = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文',   flag: '🇨🇳' },
];

//카테고리 DB 값 → 번역 키 매핑 (DB에 한국어로 저장되므로 표시 시 번역)
export const CATEGORY_KEYS = {
    '전체': 'cat_all',
    '막걸리': 'cat_makgeolli',
    '소주': 'cat_soju',
    '청주': 'cat_cheongju',
    '약주': 'cat_yakju',
    '과실주': 'cat_fruit',
};

//언어에 맞는 상품명 반환 (없으면 한국어 기본값)
export function getProductName(product, lang) {
    if (lang === 'en' && product.nameEn) return product.nameEn;
    if (lang === 'ja' && product.nameJa) return product.nameJa;
    if (lang === 'zh' && product.nameZh) return product.nameZh;
    return product.name || '';
}

//언어에 맞는 상품 설명 반환 (없으면 한국어 기본값)
export function getProductDesc(product, lang) {
    if (lang === 'en' && product.descriptionEn) return product.descriptionEn;
    if (lang === 'ja' && product.descriptionJa) return product.descriptionJa;
    if (lang === 'zh' && product.descriptionZh) return product.descriptionZh;
    return product.description || '';
}

//언어에 맞는 국가명 반환
export function getCountryName(countryCode, lang) {
    const found = TARGET_COUNTRIES.find(c => c.code === countryCode);
    if (!found) return countryCode;
    return found.name[lang] || found.name['en'] || countryCode;
}
