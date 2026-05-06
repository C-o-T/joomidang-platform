// MainPage - 선택된 국가(테마)에 맞는 완전히 다른 UI 렌더링
import { useGeo } from '../context/GeoContext';
import { getThemeForCountry } from '../i18n/themes';
import MainPageDefault from './themes/MainPageDefault';
import MainPageJP      from './themes/MainPageJP';
import MainPageCN      from './themes/MainPageCN';
import MainPageKR      from './themes/MainPageKR';
import MainPageSEA     from './themes/MainPageSEA';
import MainPageUS      from './themes/MainPageUS';
import MainPageEU      from './themes/MainPageEU';

const THEME_PAGES = {
    jp:  MainPageJP,
    cn:  MainPageCN,
    kr:  MainPageKR,
    sea: MainPageSEA,
    us:  MainPageUS,
    eu:  MainPageEU,
};

function MainPage() {
    const { country } = useGeo();
    const theme = getThemeForCountry(country);
    const Page = THEME_PAGES[theme] || MainPageDefault;
    return <Page />;
}

export default MainPage;
