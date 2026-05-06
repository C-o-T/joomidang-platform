import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { initExchangeRates } from './utils/currency';
import { GeoProvider } from './context/GeoContext';
import { useGeo } from './context/GeoContext';
import { getThemeForCountry } from './i18n/themes';
import Navbar from './components/Navbar';
import AgeGate from './components/AgeGate';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import ExportGuidePage from './pages/ExportGuidePage';
import SellerRegisterPage from './pages/SellerRegisterPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AdminPage from './pages/AdminPage';

// 6개 테마 페이지는 자체 헤더를 포함 → 메인(/)에서 전역 Navbar와 충돌
// Default 테마(지원 외 국가)는 자체 헤더 없음 → Navbar 유지
// 내부 페이지(/cart, /order 등)는 항상 Navbar 표시
function AppRoutes() {
    const location = useLocation();
    const { country, ready } = useGeo();
    const theme = getThemeForCountry(country);
    const showNavbar = location.pathname !== '/' || theme === 'default';

    const [ageVerified, setAgeVerified] = useState(!!localStorage.getItem('jm_age_ok'));
    const handleAgeVerify = () => {
        localStorage.setItem('jm_age_ok', '1');
        setAgeVerified(true);
    };

    // IP 감지 완료 전: 빈 화면 (AgeGate에 country=''가 넘어가 age=18로 깜빡이는 현상 방지)
    if (!ready) return <div style={{ minHeight: '100vh', background: '#0a0805' }} />;

    if (!ageVerified) {
        return <AgeGate country={country} onVerify={handleAgeVerify} />;
    }

    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/"             element={<MainPage />} />
                <Route path="/login"        element={<LoginPage />} />
                <Route path="/join"         element={<JoinPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart"         element={<CartPage />} />
                <Route path="/order"        element={<OrderPage />} />
                <Route path="/export-guide"      element={<ExportGuidePage />} />
                <Route path="/seller/register"   element={<SellerRegisterPage />} />
                <Route path="/seller/dashboard"  element={<SellerDashboardPage />} />
                <Route path="/admin"             element={<AdminPage />} />
            </Routes>
        </>
    );
}

function App() {
    useEffect(() => { initExchangeRates(); }, []);
    return (
        <GeoProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </GeoProvider>
    );
}

export default App;
