// 상품 데이터 로딩 + 카테고리 필터 공통 훅
// 모든 테마 페이지가 공유

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';

// ─────────────────────────────────────────────────────────────────────────────
// STATS_FROM_DB: 집계 통계(별점/리뷰수/판매수) 실제 DB 사용 여부
//
// false → getStat() 이 null 반환 → 컴포넌트에서 플레이스홀더 표시
// true  → DB 응답값 그대로 사용
//
// DB 전환 체크리스트:
//   1) Product 엔티티에 rating(Float), reviewCount(Int), soldCount(Int) 추가
//   2) 집계 로직(주문 완료 이벤트 → soldCount++) 구현
//   3) 이 플래그만 true 로 변경
// ─────────────────────────────────────────────────────────────────────────────
export const STATS_FROM_DB = false;

export function getStat(product, key) {
    if (!STATS_FROM_DB) return null;
    const val = product?.[key];
    if (val === undefined || val === null) return null;
    if ((key === 'reviews' || key === 'sold') && val === 0) return null;
    return val;
}

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY_PRODUCTS — 팩트 기반 제품 데이터
//
// 포함된 팩트:
//   · brewery / region : 실제 양조장명 및 소재지
//   · ingredients      : 실제 사용 원료
//   · heritage         : 문화재 지정 여부 (국가지정/시도지정 구분)
//   · tastingKo/En     : 해당 주종의 일반적 향미 특성 (제조사 공식 설명 기반)
//   · pairing          : 전통적으로 잘 어울리는 음식
//
// DB 컬럼 대응 (백엔드 추가 예정):
//   brewery VARCHAR(100), breweryEn VARCHAR(100),
//   region VARCHAR(100),  regionEn VARCHAR(100),
//   ingredients TEXT,     ingredientsEn TEXT,
//   heritage VARCHAR(200) DEFAULT NULL,
//   tastingNoseKo TEXT, tastingPalateKo TEXT, tastingFinishKo TEXT,
//   tastingNoseEn TEXT, tastingPalateEn TEXT, tastingFinishEn TEXT,
//   pairing VARCHAR(500), pairingEn VARCHAR(500)
// ─────────────────────────────────────────────────────────────────────────────
export const DUMMY_PRODUCTS = [
    {
        id: 1,
        name: '서울 장수 막걸리', nameEn: 'Seoul Jangsu Makgeolli',
        nameJa: 'ソウル長寿マッコリ', nameZh: '首尔长寿马格利',
        price: 3500, originalPrice: 4800, discount: 27,
        alcoholPercentage: 6, volumeMl: 750, category: '막걸리',
        rating: 4.6, reviews: 1243, sold: 12400,
        // ── 팩트 데이터 ──
        brewery: '서울장수주식회사',
        breweryEn: 'Seoul Jangsoo Co., Ltd.',
        breweryJa: 'ソウル長寿株式会社',
        breweryZh: '首尔长寿股份有限公司',
        region: '서울시 서초구',
        regionEn: 'Seocho-gu, Seoul',
        ingredients: '쌀, 밀, 정제수',
        ingredientsEn: 'Rice, Wheat, Purified Water',
        heritage: null,
        tastingKo: {
            nose: '쌀 발효에서 오는 은은한 단맛과 약한 유산균 향',
            palate: '부드럽고 청량감 있는 탁주 특유의 질감, 가벼운 단맛',
            finish: '깔끔하게 마무리되는 짧고 가벼운 여운',
        },
        tastingEn: {
            nose: 'Mild sweetness from rice fermentation with subtle lactic notes',
            palate: 'Smooth and refreshing body, lightly sweet with a milky texture',
            finish: 'Clean and light, short finish',
        },
        tastingJa: {
            nose: '米発酵由来の穏やかな甘みと淡い乳酸の香り',
            palate: 'なめらかでさわやかな濁り酒特有の口当たり',
            finish: 'すっきりとした短い余韻',
        },
        tastingZh: {
            nose: '来自大米发酵的淡淡甜香，伴有轻微乳酸气息',
            palate: '口感顺滑清爽，带有淡淡甜味',
            finish: '清爽干净，余味简短',
        },
        pairing: ['파전', '김치전', '두부김치', '도토리묵'],
        pairingEn: ['Korean scallion pancakes', 'Kimchi pancakes', 'Stir-fried tofu & kimchi', 'Acorn jelly'],
        bridgeEn: 'Fans of kefir or light wheat beer will enjoy this approachable cloudy rice wine.',
    },
    {
        id: 2,
        name: '문배주', nameEn: 'Munbaeju',
        nameJa: '文培酒', nameZh: '文培酒',
        price: 45000, originalPrice: 45000, discount: 0,
        alcoholPercentage: 40, volumeMl: 500, category: '소주',
        rating: 4.8, reviews: 856, sold: 3200,
        // ── 팩트 데이터 ──
        // 국가무형문화재 제86-1호. 원래 평안도 지방 전통주이며
        // 해방 후 이경찬 명인이 경기도 김포에서 계승.
        // 쌀을 사용하지 않고 수수+좁쌀만으로 만들지만 배(문배) 향이 난다는 특징이 이름의 유래.
        brewery: '문배주 양조원',
        breweryEn: 'Munbaeju Brewery',
        breweryJa: '文培酒醸造院',
        breweryZh: '文培酒酿造院',
        region: '경기도 김포시',
        regionEn: 'Gimpo, Gyeonggi Province',
        ingredients: '수수, 좁쌀, 물 (쌀 미사용)',
        ingredientsEn: 'Sorghum, Millet, Water (no rice)',
        heritage: '국가무형문화재 제86-1호',
        heritageEn: 'National Intangible Cultural Heritage No. 86-1',
        tastingKo: {
            nose: '배(문배) 향과 꽃향기 — 과일을 넣지 않았지만 자연적으로 배향이 남',
            palate: '수수와 좁쌀의 풍부한 곡물감, 묵직하면서도 부드러운 질감',
            finish: '길고 여운 있는 마무리, 은은한 단맛이 남음',
        },
        tastingEn: {
            nose: 'Distinctive Asian pear aroma (munbae) arising naturally from fermentation — no fruit used',
            palate: 'Full-bodied grain character from sorghum and millet, smooth despite high ABV',
            finish: 'Long, lingering finish with subtle sweetness',
        },
        tastingJa: {
            nose: '洋梨（文培）を思わせる香り――果物を使わずとも自然に生まれる',
            palate: 'コーリャンとアワ由来の豊かな穀物感',
            finish: '長く続く余韻と淡い甘み',
        },
        tastingZh: {
            nose: '天然梨香（文培梨），不含水果却自然散发',
            palate: '高粱和小米带来的丰富谷物风味，口感醇厚顺滑',
            finish: '余味悠长，带有淡淡甜意',
        },
        pairing: ['갈비찜', '불고기', '삼겹살', '숙성 치즈'],
        pairingEn: ['Braised short ribs', 'Bulgogi', 'Grilled pork belly', 'Aged cheese'],
        bridgeEn: 'If you appreciate aged whisky or cognac, this Korean spirit offers a uniquely complex grain-driven experience.',
    },
    {
        id: 3,
        name: '경주법주', nameEn: 'Gyeongju Beopju',
        nameJa: '慶州法酒', nameZh: '庆州法酒',
        price: 28000, originalPrice: 35000, discount: 20,
        alcoholPercentage: 13, volumeMl: 720, category: '청주',
        rating: 4.4, reviews: 2341, sold: 8700,
        // ── 팩트 데이터 ──
        // 국가무형문화재 제86-2호. 경주 최씨 교동 최씨 가문에서 500여 년간 전승.
        // 법주(法酒)는 '법도에 맞게 빚은 술'이라는 뜻.
        brewery: '교동법주 (최씨 가문)',
        breweryEn: 'Gyodong Beopju (Choi Family)',
        breweryJa: '校洞法酒（崔氏一門）',
        breweryZh: '校洞法酒（崔氏家族）',
        region: '경상북도 경주시 교동',
        regionEn: 'Gyodong, Gyeongju, North Gyeongsang Province',
        ingredients: '찹쌀, 누룩, 물',
        ingredientsEn: 'Glutinous Rice, Nuruk (Korean fermentation starter), Water',
        heritage: '국가무형문화재 제86-2호',
        heritageEn: 'National Intangible Cultural Heritage No. 86-2',
        tastingKo: {
            nose: '맑고 깨끗한 곡물향, 은은한 단맛과 약한 꽃향기',
            palate: '부드럽고 섬세한 질감, 찹쌀의 은은한 단맛',
            finish: '깔끔하고 산뜻한 여운, 쓴맛 없음',
        },
        tastingEn: {
            nose: 'Clear and clean grain aroma with delicate sweetness and faint floral notes',
            palate: 'Silky, refined texture with gentle sweetness from glutinous rice',
            finish: 'Clean and refreshing, no bitterness',
        },
        tastingJa: {
            nose: '清潔感のある穀物香、淡い甘みと花の香り',
            palate: 'もち米由来の上品な甘みと滑らかな口当たり',
            finish: 'きれいですっきりとした余韻',
        },
        tastingZh: {
            nose: '清雅的谷物香气，淡淡甜味与花香',
            palate: '糯米带来的细腻甜味，口感柔滑精致',
            finish: '清爽干净，无苦涩',
        },
        pairing: ['회', '삼계탕', '전복죽', '담백한 나물'],
        pairingEn: ['Korean raw fish (hoe)', 'Ginseng chicken soup', 'Abalone porridge', 'Seasoned vegetables'],
        bridgeEn: 'Similar in refinement to a premium Japanese sake or a dry Chinese Shaoxing wine, but with distinctly Korean character.',
    },
    {
        id: 4,
        name: '이강주', nameEn: 'Igangju',
        nameJa: '梨薑酒', nameZh: '梨姜酒',
        price: 35000, originalPrice: 35000, discount: 0,
        alcoholPercentage: 25, volumeMl: 375, category: '약주',
        rating: 4.3, reviews: 432, sold: 1800,
        // ── 팩트 데이터 ──
        // 전라북도 무형문화재 제6-2호. '이(梨)'는 배, '강(薑)'은 생강.
        // 쌀 증류주에 배·생강·울금·계피·꿀을 넣어 숙성.
        // 울금(강황)이 황금빛 색상의 원인.
        brewery: '(주)이강주',
        breweryEn: 'Igangju Co., Ltd.',
        breweryJa: '梨薑酒株式会社',
        breweryZh: '梨姜酒有限公司',
        region: '전라북도 전주시',
        regionEn: 'Jeonju, North Jeolla Province',
        ingredients: '쌀(증류 기주), 배, 생강, 울금, 계피, 꿀',
        ingredientsEn: 'Rice (base distillate), Pear, Ginger, Turmeric, Cinnamon, Honey',
        heritage: '전라북도 무형문화재 제6-2호',
        heritageEn: 'Jeollabuk-do Intangible Cultural Heritage No. 6-2',
        tastingKo: {
            nose: '배의 달콤한 향 위로 생강과 계피의 따뜻한 스파이스, 울금의 흙향',
            palate: '배의 단맛 → 생강의 따뜻한 자극 → 계피의 복합적인 스파이스',
            finish: '생강의 온기가 오래 남는 따뜻한 마무리, 꿀의 잔향',
        },
        tastingEn: {
            nose: 'Pear sweetness layered with warm ginger, cinnamon spice, and earthy turmeric',
            palate: 'Progression from pear sweetness to ginger warmth to complex spice',
            finish: 'Long warming finish with lingering ginger and honey notes',
        },
        tastingJa: {
            nose: '洋梨の甘み、生姜と肉桂のスパイス、ウコンの土っぽい香り',
            palate: '洋梨の甘みから生姜の温感へと続く複雑な味わい',
            finish: '生姜の温もりとはちみつの余韻が長く残る',
        },
        tastingZh: {
            nose: '梨的甜香与姜和肉桂的温热香料，以及郁金的泥土气息',
            palate: '从梨的甜味过渡到姜的温热感，再到复杂的香料味',
            finish: '姜的温热感与蜂蜜尾韵悠长',
        },
        pairing: ['한우 육회', '간장게장', '생선구이', '팥빙수'],
        pairingEn: ['Korean beef tartare', 'Soy-marinated crab', 'Grilled fish', 'Korean shaved ice'],
        bridgeEn: 'Think of a Korean answer to spiced rum or ginger liqueur — complex botanical layers with natural sweetness.',
    },
    {
        id: 5,
        name: '복분자주', nameEn: 'Bokbunja (Black Raspberry Wine)',
        nameJa: '覆盆子酒', nameZh: '覆盆子酒',
        price: 22000, originalPrice: 28000, discount: 21,
        alcoholPercentage: 15, volumeMl: 500, category: '과실주',
        rating: 4.7, reviews: 1876, sold: 9500,
        // ── 팩트 데이터 ──
        // 복분자(覆盆子) = Rubus coreanus (Korean black raspberry).
        // 전라북도 고창군이 국내 최대 복분자 생산지.
        // '복분자를 먹으면 요강이 뒤집힐 만큼 기운이 난다'는 전설에서 이름 유래.
        brewery: '고창 복분자 영농조합',
        breweryEn: 'Gochang Bokbunja Agricultural Cooperative',
        breweryJa: '高敞覆盆子農業協同組合',
        breweryZh: '高敞覆盆子农业合作社',
        region: '전라북도 고창군',
        regionEn: 'Gochang, North Jeolla Province',
        ingredients: '복분자(Rubus coreanus), 쌀 증류주',
        ingredientsEn: 'Korean Black Raspberry (Rubus coreanus), Rice Distillate',
        heritage: '고창 지역 향토 명주',
        heritageEn: 'Regional Specialty of Gochang',
        tastingKo: {
            nose: '신선한 블랙베리·복분자의 진한 과일향, 약한 발효 산미',
            palate: '풍부한 과일 단맛과 적당한 탄닌감, 부드러운 질감',
            finish: '약간의 수렴감과 함께 과일 여운이 지속',
        },
        tastingEn: {
            nose: 'Rich black raspberry fruit aroma with mild fermented acidity',
            palate: 'Full fruit sweetness with moderate tannins, smooth texture',
            finish: 'Slight astringency with lingering berry fruit notes',
        },
        tastingJa: {
            nose: 'フレッシュなブラックラズベリーの濃厚な香りと穏やかな酸み',
            palate: '豊かなフルーツの甘みと適度なタンニン',
            finish: '軽い収れん感とベリーの余韻',
        },
        tastingZh: {
            nose: '新鲜浓郁的黑树莓果香，带有轻微发酵酸味',
            palate: '丰富的果实甜味与适度单宁感，口感顺滑',
            finish: '轻微收敛感，果味余韵持久',
        },
        pairing: ['치즈 플레이트', '다크 초콜릿', '오리구이', '딸기 디저트'],
        pairingEn: ['Cheese board', 'Dark chocolate', 'Roasted duck', 'Berry desserts'],
        bridgeEn: 'Comparable to a Korean Crème de Cassis or a light Pinot Noir — fruit-forward with natural sweetness.',
    },
    {
        id: 6,
        name: '안동소주', nameEn: 'Andong Soju',
        nameJa: '安東焼酎', nameZh: '安东烧酒',
        price: 40000, originalPrice: 40000, discount: 0,
        alcoholPercentage: 45, volumeMl: 500, category: '소주',
        rating: 4.9, reviews: 677, sold: 4100,
        // ── 팩트 데이터 ──
        // 경상북도 무형문화재 제12호.
        // 희석식 소주와 달리 전통 증류 방식(단식 증류기)으로 제조.
        // 1990년 조옥화 명인이 전통 방식으로 복원. 현재는 박재서 명인이 계승.
        brewery: '(주)민속주 안동소주',
        breweryEn: 'Minsokju Andong Soju Co., Ltd.',
        breweryJa: '民俗酒安東焼酎株式会社',
        breweryZh: '民俗酒安东烧酒有限公司',
        region: '경상북도 안동시',
        regionEn: 'Andong, North Gyeongsang Province',
        ingredients: '쌀, 누룩, 물 (전통 단식 증류)',
        ingredientsEn: 'Rice, Nuruk (Korean fermentation starter), Water (traditional pot still distillation)',
        heritage: '경상북도 무형문화재 제12호',
        heritageEn: 'Gyeongsangbuk-do Intangible Cultural Heritage No. 12',
        tastingKo: {
            nose: '쌀과 누룩의 깔끔한 곡물향, 증류에서 오는 깨끗한 에탄올',
            palate: '첫 모금의 강한 알코올감 이후 부드럽게 펼쳐지는 쌀의 단맛',
            finish: '깨끗하고 길게 이어지는 여운, 쌀의 고소함이 마지막까지 남음',
        },
        tastingEn: {
            nose: 'Clean grain aroma from rice and nuruk starter, pure ethanol from pot still distillation',
            palate: 'Initial warmth from high ABV, followed by smooth rice sweetness',
            finish: 'Long, clean finish with lingering nutty rice notes',
        },
        tastingJa: {
            nose: '米と麹由来のクリーンな穀物香、単式蒸留による純粋なエタノール',
            palate: '高アルコールの最初の温感に続く米の甘み',
            finish: '長くクリーンな余韻、米のナッツ感が最後まで残る',
        },
        tastingZh: {
            nose: '来自大米和酒曲的清纯谷物香，单式蒸馏带来的纯净酒精气息',
            palate: '初入口的强烈酒感后，展现出顺滑的米香甜味',
            finish: '余味悠长干净，米香萦绕至最后',
        },
        pairing: ['안동찜닭', '간고등어', '생선회', '단호박전'],
        pairingEn: ['Andong braised chicken', 'Salted mackerel', 'Korean sashimi', 'Sweet pumpkin pancakes'],
        bridgeEn: 'Similar in production method to Calvados or an unaged whisky — pure, grain-forward spirit with no added flavors.',
    },
    {
        id: 7,
        name: '해창 막걸리', nameEn: 'Haechang Makgeolli',
        nameJa: '海倉マッコリ', nameZh: '海仓马格利酒',
        price: 8000, originalPrice: 10000, discount: 20,
        alcoholPercentage: 6.5, volumeMl: 750, category: '막걸리',
        rating: 4.5, reviews: 3012, sold: 21000,
        // ── 팩트 데이터 ──
        // 전라남도 해남군 북평면 소재. 막걸리 애호가들 사이에서
        // 프리미엄 쌀 막걸리의 대표 브랜드로 알려진 해창주조장.
        // 한반도 최남단에 위치한 양조장이라 청정 지하수 사용이 특징.
        brewery: '해창주조장',
        breweryEn: 'Haechang Brewery',
        breweryJa: '海倉酒造場',
        breweryZh: '海仓酿酒厂',
        region: '전라남도 해남군 북평면',
        regionEn: 'Bukpyeong, Haenam, South Jeolla Province',
        ingredients: '쌀, 누룩, 청정 지하수',
        ingredientsEn: 'Rice, Nuruk (Korean fermentation starter), Pure Groundwater',
        heritage: '남도 명주 (지역 문화 자원)',
        heritageEn: 'Namdo Regional Renowned Spirit',
        tastingKo: {
            nose: '신선한 쌀 발효향에 달콤하고 부드러운 유산균 향, 약한 과일향',
            palate: '일반 막걸리보다 진하고 농밀한 쌀의 질감, 자연스러운 단맛과 산미의 균형',
            finish: '깔끔하면서도 여운이 있는 마무리, 쌀의 고소함이 남음',
        },
        tastingEn: {
            nose: 'Fresh rice fermentation aroma with gentle lactic sweetness and faint fruit notes',
            palate: 'Richer, creamier texture than commercial makgeolli; balanced natural sweetness and acidity',
            finish: 'Clean yet lingering, with residual nutty rice character',
        },
        tastingJa: {
            nose: '新鮮な米の発酵香に乳酸の甘みと淡い果実香',
            palate: '市販品より濃厚でクリーミー、甘みと酸みの自然な調和',
            finish: 'きれいでありながら余韻があり、米のナッツ感が残る',
        },
        tastingZh: {
            nose: '新鲜米发酵香，带有柔和的乳酸甜味和淡淡果香',
            palate: '比普通米酒更浓郁细腻，甜酸平衡自然',
            finish: '余韵干净而持久，带有米香',
        },
        pairing: ['굴전', '낙지볶음', '갈치조림', '생굴'],
        pairingEn: ['Oyster pancakes', 'Spicy stir-fried octopus', 'Braised cutlassfish', 'Fresh oysters'],
        bridgeEn: 'Think of a Korean craft wheat beer meets natural wine — unfiltered, alive, and terroir-driven.',
    },
    {
        id: 8,
        name: '오메기술', nameEn: 'Omegisul',
        nameJa: 'オメギ酒', nameZh: '欧麦其酒',
        price: 32000, originalPrice: 38000, discount: 16,
        alcoholPercentage: 10, volumeMl: 500, category: '약주',
        rating: 4.2, reviews: 521, sold: 2300,
        // ── 팩트 데이터 ──
        // 제주 전통주. '오메기'는 제주 방언으로 차조(좁쌀의 일종)를 뜻함.
        // 오메기떡(차조로 만든 떡)을 빚어 발효시키는 독특한 방식.
        // 제주 고유의 기후와 용천수를 사용해 제주에서만 만들어지는 술.
        brewery: '제주 오메기술 (복수 생산자)',
        breweryEn: 'Jeju Omegisul Breweries',
        breweryJa: '済州オメギ酒（複数生産者）',
        breweryZh: '济州欧麦其酒（多家酿造商）',
        region: '제주특별자치도',
        regionEn: 'Jeju Special Self-Governing Province',
        ingredients: '차조(Setaria italica), 누룩, 제주 용천수',
        ingredientsEn: 'Glutinous Millet (Setaria italica, Jeju native variety), Nuruk, Jeju Spring Water',
        heritage: '제주 무형문화재 (지정 단체 있음)',
        heritageEn: 'Jeju Intangible Cultural Heritage',
        tastingKo: {
            nose: '차조의 구수한 곡물향, 약간의 산미, 은은한 발효향',
            palate: '가벼운 바디감에 차조의 독특한 구수함, 쌀 막걸리와는 다른 독특한 텍스처',
            finish: '약한 산미와 함께 끝나는 가벼운 마무리',
        },
        tastingEn: {
            nose: 'Nutty, earthy aroma of glutinous millet with gentle acidity and fermented grain notes',
            palate: 'Light body with a distinctively nutty character unique to Jeju millet — quite unlike rice makgeolli',
            finish: 'Light, gently acidic finish',
        },
        tastingJa: {
            nose: 'もちキビのナッツ感と土の香り、穏やかな酸みと発酵穀物の香り',
            palate: '軽いボディに済州キビ特有のナッツ感、米マッコリとは異なるユニークな食感',
            finish: '軽く、穏やかな酸みで終わる',
        },
        tastingZh: {
            nose: '糯黍特有的坚果和泥土气息，淡淡的酸味和发酵谷物香',
            palate: '酒体轻盈，带有济州糯黍特有的坚果感，与米马格利截然不同',
            finish: '轻盈，带有温和的酸味',
        },
        pairing: ['제주 흑돼지', '한치회', '고등어구이', '제주 귤 디저트'],
        pairingEn: ['Jeju black pork', 'Flying squid sashimi', 'Grilled mackerel', 'Jeju citrus desserts'],
        bridgeEn: 'Like a craft sour ale or a Japanese nigori sake, but made from Jeju\'s unique glutinous millet with a distinctive terroir.',
    },
];

export const CATEGORIES = ['전체', '막걸리', '소주', '청주', '약주', '과실주'];

// 상품 이름 헬퍼 (기존 countries.js의 getProductName 대신 사용 가능)
export function getField(product, fieldBase, lang) {
    const langMap = { ko: '', en: 'En', ja: 'Ja', zh: 'Zh' };
    const suffix = langMap[lang] ?? 'En';
    return product?.[`${fieldBase}${suffix}`] ?? product?.[fieldBase] ?? '';
}

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('전체');

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.length > 0 ? res.data : DUMMY_PRODUCTS))
            .catch(() => setProducts(DUMMY_PRODUCTS));
    }, []);

    useEffect(() => {
        const cat = searchParams.get('category');
        setSelectedCategory(cat || '전체');
    }, [searchParams]);

    const filtered = selectedCategory === '전체'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return { products, filtered, selectedCategory };
}
