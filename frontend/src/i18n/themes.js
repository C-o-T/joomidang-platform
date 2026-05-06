// 나라별 쇼핑 플랫폼 테마 정의
// JP:  楽天(Rakuten) / Yahoo!ショッピング - 적색, 정보 밀집형
// CN:  淘宝(Taobao) / 天猫(Tmall) - 주황/적색, 화려한 디자인
// KR:  네이버 쇼핑 / 쿠팡 - 초록, 실용적
// SEA: Shopee(쇼피) / Lazada - 오렌지 그라데이션, 활기참
// US:  Amazon / Shopify - 다크 네이비/청록, 깔끔
// EU:  ASOS / Zalando - 밝은 에디토리얼, 미니멀
// default: 현재 다크 미니멀 스타일 유지

// 국가 코드 → 테마 그룹 매핑
export const COUNTRY_THEME_MAP = {
    // 동아시아
    JP: 'jp',
    CN: 'cn', TW: 'cn', HK: 'cn', MO: 'cn',
    KR: 'kr',
    // 동남아시아
    TH: 'sea', VN: 'sea', PH: 'sea', MY: 'sea', ID: 'sea', SG: 'sea',
    // 북미/중남미
    US: 'us', CA: 'us', MX: 'us', BR: 'us',
    // 유럽/오세아니아
    GB: 'eu', DE: 'eu', FR: 'eu', NL: 'eu', SE: 'eu', NO: 'eu',
    AU: 'eu', NZ: 'eu',
};

// 테마 메타 정보 (Navbar 지역 배지 등에 사용)
export const THEMES = {
    default: { name: 'Global',   emoji: '🌐', label: 'Default Style' },
    jp:      { name: 'Japan',    emoji: '🎌', label: '楽天 / Yahoo! Style' },
    cn:      { name: 'China',    emoji: '🏮', label: '淘宝 / 天猫 Style' },
    kr:      { name: 'Korea',    emoji: '🛒', label: 'Naver / Coupang Style' },
    sea:     { name: 'SE Asia',  emoji: '🧡', label: 'Shopee / Lazada Style' },
    us:      { name: 'Americas', emoji: '🛍️', label: 'Amazon / Shopify Style' },
    eu:      { name: 'Europe',   emoji: '✨', label: 'ASOS / Zalando Style' },
};

export function getThemeForCountry(countryCode) {
    return COUNTRY_THEME_MAP[countryCode] || 'default';
}
