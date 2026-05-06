import { useState } from 'react';
import { useGeo } from '../context/GeoContext';
import styles from './ExportGuidePage.module.css';

// ─── 글로벌 시장 현황 ───────────────────────────────────────────
const MARKET_STATS = [
    { label: '소주 글로벌 시장 (2024)', value: '$29.7억', sub: '2030년 $75.9억 전망 (CAGR 5.4%)', icon: '🍶' },
    { label: '막걸리 글로벌 시장 (2024)', value: '$12.7억', sub: '2033년 $21.6억 전망 (CAGR 6.1%)', icon: '🥛' },
    { label: '소주 수출액 (2024)', value: '$2억+', sub: '사상 최초 2억 달러 돌파 (+3.9%)', icon: '📦' },
    { label: '막걸리 수출액 (2024)', value: '$1,427만', sub: '일본 1위, 미국·중국·호주·베트남 순', icon: '🌍' },
];

// ─── 수출 유망 국가 데이터 ────────────────────────────────────────
const COUNTRIES = [
    {
        code: 'US',
        flag: '🇺🇸',
        name: '미국',
        nameEn: 'USA',
        share: '24.3%',
        difficulty: '중',
        difficultyColor: '#f59e0b',
        fta: true,
        ftaName: '한미 FTA (KORUS)',
        demand: '높음',
        hsCode2206: '0%',
        hsCode2208: '0%',
        highlight: 'FTA 완전 철폐, 한류 영향으로 K-주류 수요 급성장',
        tariffNote: '수입관세 0% (한미 FTA 2016년 완전 철폐)',
        exciseTax: '연방 소비세: $13.50/proof gallon (증류주)',
        requirements: [
            'TTB Importer\'s Permit 취득 필수 (미국 내 사무소 必)',
            'COLA (라벨 승인) — 제품별 개별 취득',
            'FDA 식품시설 등록 (생물테러방지법)',
            'CBP 수입 사전 통보 의무',
            '영어 라벨: ABV·용량·제조사·수입사 명기',
            '도수 25% 미만 소주 → 일부 주에서 와인 면허로 유통 가능',
        ],
        tip: '캘리포니아·뉴욕·텍사스 한인 밀집 지역이 주요 진입 시장. TTB 허가는 평균 60~90일 소요 예상.',
        market: 'K-컬처 열풍으로 MZ세대 중심 프리미엄 전통주 수요 증가. 소주 전체 수출의 24.3%(1위) 차지.',
    },
    {
        code: 'JP',
        flag: '🇯🇵',
        name: '일본',
        nameEn: 'Japan',
        share: '26.4%',
        difficulty: '중',
        difficultyColor: '#f59e0b',
        fta: false,
        ftaName: 'FTA 미체결 (MFN 세율)',
        demand: '매우 높음',
        hsCode2206: 'MFN 적용',
        hsCode2208: 'MFN 적용',
        highlight: '막걸리 최대 수출국 (7,675톤/년), 한류 지속 수요',
        tariffNote: '한일 EPA 미체결 → WTO MFN(최혜국) 세율 적용',
        exciseTax: '주세: 80,000엔/kl + 소비세 10%',
        requirements: [
            '일본어 라벨 또는 병행 라벨 필수',
            '식품위생법 기준 준수 (첨가물 성분 표시)',
            '알코올 도수·용량·원산지·수입사 명기',
            '세관 통관 (일반 통관, 별도 허가 불요)',
            '수입업자 일본 내 법인 필요 권장',
        ],
        tip: '한류 3차 붐으로 막걸리·한국 소주 수요 재상승. 냉장 유통 인프라 확인 필수 (생막걸리 한정).',
        market: '전체 주류 수출 26.4%(1위) 차지. 오사카·도쿄 한인타운·일반 이자카야로 유통 확대 중.',
    },
    {
        code: 'CN',
        flag: '🇨🇳',
        name: '중국',
        nameEn: 'China',
        share: '19.9%',
        difficulty: '높음',
        difficultyColor: '#ef4444',
        fta: true,
        ftaName: '한중 FTA (부분 적용)',
        demand: '높음',
        hsCode2206: '~10%',
        hsCode2208: '~10%',
        highlight: 'GACC 등록 필수, 총 세부담 30~40%+',
        tariffNote: '수입관세 ~10% + 소비세 10~20% + VAT 13%',
        exciseTax: '소비세 10~20% + VAT 13% (총 세부담 30~40%+)',
        requirements: [
            'GACC 등록 필수 (해관총서 Decree 248, 2021년 시행)',
            'CIQ 검사: 수입 시 품질·위생 검사',
            '중국어 라벨 필수 (GB 7718 기준)',
            '중국 내 등록 법인을 통한 수입만 허용',
            '성분·알코올·용량·생산일자·보관조건·원산지 전부 명기',
            '경고 문구 (警示语) 포함 의무',
        ],
        tip: 'GACC 등록은 6개월~1년 소요 가능. 중국어 라벨 사전 심사 권장. aT(농수산식품공사) 지원 활용.',
        market: '소주 수출 19.9%(2위). K-드라마·K-팝 영향으로 프리미엄 한국주 수요 증가. 진입 비용 높으나 시장 잠재력 큼.',
    },
    {
        code: 'HK',
        flag: '🇭🇰',
        name: '홍콩',
        nameEn: 'Hong Kong',
        share: '10.3%',
        difficulty: '낮음',
        difficultyColor: '#10b981',
        fta: true,
        ftaName: '자유무역항 (무관세)',
        demand: '높음',
        hsCode2206: '0%',
        hsCode2208: '0% (30% 이하) / 100% (30% 초과)',
        highlight: 'ABV 30% 이하 완전 무관세 — 아시아 최적 진출 거점',
        tariffNote: 'ABV 30% 이하: 관세 0% / ABV 30% 초과: 100% 관세',
        exciseTax: 'GST/VAT 없음 (홍콩은 부가세 없음)',
        requirements: [
            '수입 면허 불필요 (단, 판매 시 주류판매면허 필요)',
            '알코올 도수 표시 의무',
            '영어 또는 중문 라벨 허용',
            'ABV 1.2~10%: Best Before Date 표시 필수',
        ],
        tip: '소주(ABV 20~25%)·막걸리 모두 관세 0%. 재수출 허브로 활용 가능. 고도주(안동소주 45%) 는 100% 관세 주의.',
        market: '전체 수출의 10.3%(3위). 아시아 무역 허브로 중국·동남아 재수출 거점. 프리미엄 주류 수요 높음.',
    },
    {
        code: 'AU',
        flag: '🇦🇺',
        name: '호주',
        nameEn: 'Australia',
        share: '증가세',
        difficulty: '중',
        difficultyColor: '#f59e0b',
        fta: true,
        ftaName: '한-호주 FTA (KAFTA)',
        demand: '중~높음',
        hsCode2206: '0%',
        hsCode2208: '0%',
        highlight: 'FTA 완전 무관세, 임산부 경고 문구 의무화',
        tariffNote: '수입관세 0% (KAFTA 2017년 완전 철폐)',
        exciseTax: '증류주 소비세: AUD 69.57/L 순알코올 + GST 10%',
        requirements: [
            'ABF (호주 국경서비스청) 통관',
            'FSANZ 식품 기준 준수',
            '영어 라벨 필수',
            '표준 음료 단위(Standard Drink) 표시 의무',
            '임산부 경고 문구 필수 (2020년 이후 강제)',
            '각 주별 주류 판매 면허 별도 취득',
        ],
        tip: '시드니·멜버른 한인 커뮤니티 기반 진입 후 현지 주류 유통망 확대 전략 유효.',
        market: '막걸리 주요 수출국 중 하나. 한인 이민 2세대와 현지인 K-푸드 관심 증가로 성장 가능성 높음.',
    },
    {
        code: 'CA',
        flag: '🇨🇦',
        name: '캐나다',
        nameEn: 'Canada',
        share: '성장 중',
        difficulty: '중~높음',
        difficultyColor: '#f97316',
        fta: true,
        ftaName: '한-캐나다 FTA (CKFTA)',
        demand: '중~높음',
        hsCode2206: '0%',
        hsCode2208: '0%',
        highlight: 'FTA 무관세, 주 정부 주류청 통해서만 수입 가능',
        tariffNote: '수입관세 0% (CKFTA 2024년 완전 철폐)',
        exciseTax: '연방 소비세: CAD 13.54/L 순알코올 + 주 마크업 최대 66%',
        requirements: [
            '각 주 정부 주류청 통해서만 수입 허용',
            '온타리오: LCBO, BC주: BCLDB, 퀘벡: SAQ 등록',
            '영어/불어 이중 표기 의무 (캐나다 공용어법)',
            '알코올·용량·원산지 명기',
            '주별 실험실 분석 요구 가능',
        ],
        tip: 'LCBO·BCLDB 등 주 정부 기관에 직접 제품 등록이 핵심. 토론토·밴쿠버 한인 커뮤니티 활용.',
        market: '한인 이민자 증가와 K-컬처 확산으로 프리미엄 한국 주류 수요 성장 중.',
    },
    {
        code: 'SG',
        flag: '🇸🇬',
        name: '싱가포르',
        nameEn: 'Singapore',
        share: '증가세',
        difficulty: '중',
        difficultyColor: '#f59e0b',
        fta: true,
        ftaName: '한-ASEAN FTA (AKFTA)',
        demand: '중~높음',
        hsCode2206: 'AKFTA 적용',
        hsCode2208: 'AKFTA 적용',
        highlight: '아시아 허브, 주세 SGD 88/L 순알코올',
        tariffNote: '원산지 증명서 (Form AK) 제출 시 관세 인하',
        exciseTax: '주세: SGD 88/L 순알코올 + GST 9%',
        requirements: [
            'Singapore Customs 통관',
            'SFA 식품 라벨링 기준 준수',
            '영어 라벨: 도수·용량·제조사·원산지 명기',
            '원산지 증명서 (C/O Form AK) 제출 시 AKFTA 혜택',
            '주류 소매 면허(Liquor License) 필요',
        ],
        tip: '동남아 재수출 허브로 활용 가능. 관광객 대상 프리미엄 한국 전통주 시장 유망.',
        market: '고소득 소비자 및 관광객 대상 프리미엄 시장. 한식당·K-팝 팬덤 통한 수요 창출 가능.',
    },
    {
        code: 'EU',
        flag: '🇪🇺',
        name: 'EU / 독일',
        nameEn: 'EU / Germany',
        share: '성장 중',
        difficulty: '중',
        difficultyColor: '#f59e0b',
        fta: true,
        ftaName: '한-EU FTA',
        demand: '중~높음',
        hsCode2206: '0%',
        hsCode2208: '0%',
        highlight: 'FTA 무관세, 현지 언어 라벨 필수, 영양 표시 규정 강화',
        tariffNote: '수입관세 0% (한-EU FTA 2011년 발효)',
        exciseTax: '독일 소비세: EUR 13.03/L 순알코올 + VAT 19%',
        requirements: [
            'EUR.1 원산지 증명서 필요',
            '판매 국가 언어 라벨 의무 (독일 판매: 독어 필수)',
            '알코올·용량·원산지·수입사·알레르기 성분 명기',
            'EU Regulation 2021/2117: 성분 목록·에너지 값 표시 강화',
            '영양 정보는 QR코드 제공 허용',
        ],
        tip: '베를린·프랑크푸르트 K-컬처 커뮤니티 집중. 생막걸리는 짧은 유통기한으로 항공화물 고려.',
        market: '유럽 K-팝 팬 및 아시아 음식 관심층 증가. 프리미엄 전통 발효주로 포지셔닝 유효.',
    },
    {
        code: 'VN',
        flag: '🇻🇳',
        name: '베트남',
        nameEn: 'Vietnam',
        share: '증가세',
        difficulty: '중~높음',
        difficultyColor: '#f97316',
        fta: true,
        ftaName: '한-ASEAN FTA (AKFTA)',
        demand: '중~높음',
        hsCode2206: '0~5% (AKFTA)',
        hsCode2208: '0~5% (AKFTA)',
        highlight: '특별소비세 65% (2031년 90%로 인상 예정)',
        tariffNote: '수입관세 0~5% (AKFTA) + 특별소비세 35~65% + VAT 10%',
        exciseTax: '특별소비세 (ABV 20% 이상): 65% → 2031년 90%로 인상',
        requirements: [
            'MOIT 수입 허가 (알코올 5.5% 이상 주류)',
            '식품 안전·위생 검사 통과',
            '베트남어 병행 라벨 필수',
            '알코올·용량·성분·유통기한·원산지 명기',
            '"음주 운전 금지" 등 정부 경고 문구 포함',
        ],
        tip: '2026년부터 특별소비세 단계적 인상. 지금이 진입 적기. 호찌민·하노이 한인 상권 활용.',
        market: '막걸리 주요 수출국. 한류 열풍과 함께 K-주류 인지도 빠르게 상승 중.',
    },
    {
        code: 'TH',
        flag: '🇹🇭',
        name: '태국',
        nameEn: 'Thailand',
        share: '신흥 시장',
        difficulty: '높음',
        difficultyColor: '#ef4444',
        fta: true,
        ftaName: '한-ASEAN FTA (AKFTA)',
        demand: '중',
        hsCode2206: '0% (AKFTA)',
        hsCode2208: '0% (AKFTA)',
        highlight: '소비세 THB 1,000/L 순알코올 — 실질 세부담 높음',
        tariffNote: 'AKFTA 관세 0% + 주류 소비세 THB 1,000/L 순알코올',
        exciseTax: '소비세: THB 1,000/L 순알코올 + 지방세(소비세의 17.5%) + VAT 7%',
        requirements: [
            '주류수입면허 (SOR.2/64): 주류청(Excise Department) 신청, 연 8,250 THB',
            'SOR 1/65 면허 취득 후 수입 가능',
            '라벨 샘플·인보이스 사본 제출',
            '태국 FDA 승인 필요',
            '태국어 또는 영어 라벨 허용',
        ],
        tip: '방콕 K-타운 및 한류 팬 커뮤니티 공략. 2024년 와인 세율 한시 인하로 진입 타이밍 고려.',
        market: '신흥 시장이나 한류 확산으로 K-주류 관심 급증. 실질 세부담이 높아 가격 경쟁력 전략 필요.',
    },
];

// ─── 수출 준비 체크리스트 ──────────────────────────────────────
const CHECKLIST = [
    {
        category: '공통 서류',
        icon: '📄',
        items: [
            { text: 'HS Code 확정 (발효주 2206 vs 증류주 2208)', done: false },
            { text: '원산지 증명서 (C/O) 준비 — FTA 세율 적용에 필수', done: false },
            { text: '한국 식약처 수출 검역 증명서', done: false },
            { text: '알코올 도수 공인 검사 성적서 (공인기관 발급)', done: false },
            { text: '제품 안전 성분분석 보고서 (영문)', done: false },
        ],
    },
    {
        category: '라벨링',
        icon: '🏷️',
        items: [
            { text: '수출 대상국 언어 라벨 디자인 (영문 기본)', done: false },
            { text: '알코올 도수·용량·성분·제조사·원산지 표기', done: false },
            { text: '알레르기 성분 표시 (밀·쌀·누룩 등)', done: false },
            { text: '임산부·건강 경고 문구 (국가별 상이)', done: false },
            { text: '국가별 추가 요건 확인 (중국: 중문 필수, 캐나다: 영불 이중 표기)', done: false },
        ],
    },
    {
        category: '미국 수출',
        icon: '🇺🇸',
        items: [
            { text: 'TTB Federal Basic Importer\'s Permit 취득', done: false },
            { text: 'COLA (Certificate of Label Approval) — 제품별 취득', done: false },
            { text: 'FDA 식품시설 등록', done: false },
            { text: 'CBP Prior Notice 제출', done: false },
        ],
    },
    {
        category: '중국 수출',
        icon: '🇨🇳',
        items: [
            { text: 'GACC 시설 등록 (6~12개월 소요 예상)', done: false },
            { text: '중문 라벨 사전 심사·승인', done: false },
            { text: '중국 내 등록 법인(수입업자) 확보', done: false },
            { text: 'CIQ 검사 통과 준비', done: false },
        ],
    },
    {
        category: '지원 기관 활용',
        icon: '🏛️',
        items: [
            { text: 'aT 농수산식품공사 수출 지원 프로그램 신청', done: false },
            { text: 'KOTRA 해외 무역관 시장 조사 활용', done: false },
            { text: '전통주 수출 컨설팅 (농림축산식품부)', done: false },
            { text: 'KATI 농식품수출정보 (kati.net) 정보 활용', done: false },
        ],
    },
];

// ─── 컴포넌트 ───────────────────────────────────────────────────
function ExportGuidePage() {
    const { t } = useGeo();
    const [activeTab, setActiveTab] = useState(0);
    const [checkStates, setCheckStates] = useState(
        CHECKLIST.map(section => section.items.map(() => false))
    );
    const [activeSection, setActiveSection] = useState('market');

    const toggleCheck = (si, ii) => {
        setCheckStates(prev =>
            prev.map((section, s) =>
                s === si ? section.map((v, i) => i === ii ? !v : v) : section
            )
        );
    };

    const country = COUNTRIES[activeTab];

    return (
        <div className={styles.page}>
            {/* 헤더 */}
            <div className={styles.header}>
                <div className={styles.header_inner}>
                    <p className={styles.header_badge}>양조장 전용 · Seller Guide</p>
                    <h1 className={styles.header_title}>🌏 전통주 수출 시장 가이드</h1>
                    <p className={styles.header_sub}>
                        한국 전통주의 세계 진출을 위한 국가별 관세·규제·수요 정보
                    </p>
                </div>
            </div>

            {/* 섹션 탭 */}
            <div className={styles.section_nav}>
                {[
                    { id: 'market', label: '📊 시장 현황' },
                    { id: 'countries', label: '🗺️ 국가별 가이드' },
                    { id: 'checklist', label: '✅ 수출 체크리스트' },
                ].map(s => (
                    <button
                        key={s.id}
                        className={`${styles.section_btn} ${activeSection === s.id ? styles.section_active : ''}`}
                        onClick={() => setActiveSection(s.id)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div className={styles.content}>

                {/* ── 섹션 1: 시장 현황 ── */}
                {activeSection === 'market' && (
                    <div>
                        {/* 핵심 지표 카드 */}
                        <div className={styles.stat_grid}>
                            {MARKET_STATS.map((s, i) => (
                                <div key={i} className={styles.stat_card}>
                                    <span className={styles.stat_icon}>{s.icon}</span>
                                    <p className={styles.stat_value}>{s.value}</p>
                                    <p className={styles.stat_label}>{s.label}</p>
                                    <p className={styles.stat_sub}>{s.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* 수출 비중 차트 (텍스트 기반) */}
                        <div className={styles.card}>
                            <h2 className={styles.card_title}>🇰🇷 소주 수출 상위 국가 (2024)</h2>
                            {[
                                { name: '미국', share: 24.3, color: '#3b82f6' },
                                { name: '중국', share: 19.9, color: '#ef4444' },
                                { name: '일본', share: 19.2, color: '#f59e0b' },
                                { name: '홍콩', share: 10.3, color: '#10b981' },
                                { name: '기타', share: 26.3, color: '#9ca3af' },
                            ].map((item, i) => (
                                <div key={i} className={styles.bar_row}>
                                    <span className={styles.bar_label}>{item.name}</span>
                                    <div className={styles.bar_track}>
                                        <div
                                            className={styles.bar_fill}
                                            style={{ width: `${item.share}%`, background: item.color }}
                                        />
                                    </div>
                                    <span className={styles.bar_value}>{item.share}%</span>
                                </div>
                            ))}
                        </div>

                        {/* FTA 현황 */}
                        <div className={styles.card}>
                            <h2 className={styles.card_title}>📋 주요국 FTA 현황 (관세 혜택)</h2>
                            <div className={styles.fta_grid}>
                                {COUNTRIES.map(c => (
                                    <div key={c.code} className={`${styles.fta_item} ${c.fta ? styles.fta_yes : styles.fta_no}`}>
                                        <span className={styles.fta_flag}>{c.flag}</span>
                                        <div>
                                            <p className={styles.fta_name}>{c.name}</p>
                                            <p className={styles.fta_agreement}>{c.ftaName}</p>
                                        </div>
                                        <span className={c.fta ? styles.badge_green : styles.badge_gray}>
                                            {c.fta ? 'FTA 적용' : 'MFN'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 주의사항 */}
                        <div className={styles.notice_card}>
                            <h3 className={styles.notice_title}>⚠️ 2025~2026 규제 변화 예고</h3>
                            <ul className={styles.notice_list}>
                                <li><strong>베트남</strong>: 2026년부터 특별소비세 단계적 인상 (최종 90%) — 진입 타이밍 고려 필요</li>
                                <li><strong>EU</strong>: 증류주 영양 표시 의무화 확대 검토 중</li>
                                <li><strong>태국</strong>: 지속적 세율 조정 중 (2024년 와인 한시 인하)</li>
                                <li><strong>중국</strong>: GACC 등록 강화 — 수출 전 반드시 사전 등록 완료</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* ── 섹션 2: 국가별 가이드 ── */}
                {activeSection === 'countries' && (
                    <div className={styles.country_layout}>
                        {/* 국가 탭 목록 */}
                        <div className={styles.country_tabs}>
                            {COUNTRIES.map((c, i) => (
                                <button
                                    key={c.code}
                                    className={`${styles.country_tab} ${activeTab === i ? styles.country_tab_active : ''}`}
                                    onClick={() => setActiveTab(i)}
                                >
                                    <span className={styles.country_flag}>{c.flag}</span>
                                    <span className={styles.country_tab_name}>{c.name}</span>
                                    <span
                                        className={styles.difficulty_dot}
                                        style={{ background: c.difficultyColor }}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* 국가 상세 정보 */}
                        <div className={styles.country_detail}>
                            {/* 헤더 */}
                            <div className={styles.detail_header}>
                                <span className={styles.detail_flag}>{country.flag}</span>
                                <div>
                                    <h2 className={styles.detail_name}>{country.name} ({country.nameEn})</h2>
                                    <p className={styles.detail_highlight}>{country.highlight}</p>
                                </div>
                            </div>

                            {/* 핵심 수치 */}
                            <div className={styles.key_metrics}>
                                <div className={styles.metric}>
                                    <p className={styles.metric_label}>수출 비중</p>
                                    <p className={styles.metric_value}>{country.share}</p>
                                </div>
                                <div className={styles.metric}>
                                    <p className={styles.metric_label}>수요</p>
                                    <p className={styles.metric_value}>{country.demand}</p>
                                </div>
                                <div className={styles.metric}>
                                    <p className={styles.metric_label}>진입 난이도</p>
                                    <p className={styles.metric_value} style={{ color: country.difficultyColor }}>
                                        {country.difficulty}
                                    </p>
                                </div>
                                <div className={styles.metric}>
                                    <p className={styles.metric_label}>FTA</p>
                                    <p className={styles.metric_value} style={{ color: country.fta ? '#10b981' : '#9ca3af' }}>
                                        {country.fta ? '적용' : '미적용'}
                                    </p>
                                </div>
                            </div>

                            {/* 관세 정보 */}
                            <div className={styles.section_block}>
                                <h3 className={styles.section_block_title}>💰 관세 및 세금</h3>
                                <div className={styles.tariff_grid}>
                                    <div className={styles.tariff_item}>
                                        <p className={styles.tariff_label}>발효주 (HS 2206) 관세</p>
                                        <p className={styles.tariff_val}>{country.hsCode2206}</p>
                                    </div>
                                    <div className={styles.tariff_item}>
                                        <p className={styles.tariff_label}>증류주 (HS 2208) 관세</p>
                                        <p className={styles.tariff_val}>{country.hsCode2208}</p>
                                    </div>
                                </div>
                                <p className={styles.tariff_note}>{country.tariffNote}</p>
                                <p className={styles.tariff_excise}>소비세/주세: {country.exciseTax}</p>
                            </div>

                            {/* 수입 요건 */}
                            <div className={styles.section_block}>
                                <h3 className={styles.section_block_title}>📋 수입 요건 및 라벨링</h3>
                                <ul className={styles.req_list}>
                                    {country.requirements.map((r, i) => (
                                        <li key={i} className={styles.req_item}>
                                            <span className={styles.req_bullet}>›</span>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 시장 분석 */}
                            <div className={styles.section_block}>
                                <h3 className={styles.section_block_title}>📈 시장 분석</h3>
                                <p className={styles.market_text}>{country.market}</p>
                            </div>

                            {/* 실전 팁 */}
                            <div className={styles.tip_box}>
                                <span className={styles.tip_icon}>💡</span>
                                <div>
                                    <p className={styles.tip_label}>실전 팁</p>
                                    <p className={styles.tip_text}>{country.tip}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 섹션 3: 체크리스트 ── */}
                {activeSection === 'checklist' && (
                    <div>
                        <p className={styles.checklist_intro}>
                            수출 준비 단계별 체크리스트입니다. 완료한 항목을 체크하며 진행 상황을 관리하세요.
                        </p>
                        {CHECKLIST.map((section, si) => {
                            const checked = checkStates[si].filter(Boolean).length;
                            const total = section.items.length;
                            return (
                                <div key={si} className={styles.check_section}>
                                    <div className={styles.check_section_header}>
                                        <span className={styles.check_icon}>{section.icon}</span>
                                        <h3 className={styles.check_section_title}>{section.category}</h3>
                                        <span className={styles.check_progress}>
                                            {checked}/{total}
                                        </span>
                                    </div>
                                    <div className={styles.check_progress_bar}>
                                        <div
                                            className={styles.check_progress_fill}
                                            style={{ width: `${(checked / total) * 100}%` }}
                                        />
                                    </div>
                                    <ul className={styles.check_list}>
                                        {section.items.map((item, ii) => (
                                            <li
                                                key={ii}
                                                className={`${styles.check_item} ${checkStates[si][ii] ? styles.check_done : ''}`}
                                                onClick={() => toggleCheck(si, ii)}
                                            >
                                                <span className={styles.check_box}>
                                                    {checkStates[si][ii] ? '✓' : ''}
                                                </span>
                                                <span className={styles.check_text}>{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}

                        {/* 지원 기관 링크 */}
                        <div className={styles.agency_card}>
                            <h3 className={styles.agency_title}>🏛️ 수출 지원 공공기관</h3>
                            <div className={styles.agency_grid}>
                                {[
                                    { name: 'aT 농수산식품공사', desc: '전통주 수출 바우처·지원 사업', url: 'https://www.at.or.kr' },
                                    { name: 'KOTRA', desc: '해외 시장 조사·무역관 네트워크', url: 'https://www.kotra.or.kr' },
                                    { name: 'KATI 농식품수출정보', desc: '국가별 관세·규제 최신 정보', url: 'https://www.kati.net' },
                                    { name: '한국전통주연구소', desc: '전통주 품질 인증·수출 컨설팅', url: 'https://www.koreansool.co.kr' },
                                ].map((a, i) => (
                                    <div key={i} className={styles.agency_item}>
                                        <p className={styles.agency_name}>{a.name}</p>
                                        <p className={styles.agency_desc}>{a.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 푸터 주의문구 */}
            <div className={styles.disclaimer}>
                <p>⚠️ 본 정보는 2024~2025년 기준 수집된 자료이며, 각국 세율·규정은 수시로 변경될 수 있습니다.</p>
                <p>수출 전 반드시 해당 국가 공식 세관 및 aT·KOTRA를 통해 최신 정보를 재확인하시기 바랍니다.</p>
            </div>
        </div>
    );
}

export default ExportGuidePage;
