// 국가코드 → 통화 매핑 (KRW 기준 환율 — 하드코딩은 폴백용)
// 실시간 환율은 initExchangeRates() 호출 시 localStorage에 캐시됨 (1시간 TTL)
export const CURRENCY_MAP = {
    KR: { code: 'KRW', symbol: '₩',   rate: 1       },
    JP: { code: 'JPY', symbol: '¥',   rate: 0.11    },
    CN: { code: 'CNY', symbol: '¥',   rate: 0.052   },
    TW: { code: 'TWD', symbol: 'NT$', rate: 0.023   },
    HK: { code: 'HKD', symbol: 'HK$', rate: 0.0057  },
    SG: { code: 'SGD', symbol: 'S$',  rate: 0.00074 },
    MY: { code: 'MYR', symbol: 'RM',  rate: 0.0035  },
    TH: { code: 'THB', symbol: '฿',   rate: 0.027   },
    VN: { code: 'VND', symbol: '₫',   rate: 18.5    },
    PH: { code: 'PHP', symbol: '₱',   rate: 0.042   },
    ID: { code: 'IDR', symbol: 'Rp',  rate: 11.5    },
    US: { code: 'USD', symbol: '$',   rate: 0.00073 },
    CA: { code: 'CAD', symbol: 'C$',  rate: 0.00099 },
    MX: { code: 'MXN', symbol: 'MX$', rate: 0.015   },
    BR: { code: 'BRL', symbol: 'R$',  rate: 0.0038  },
    GB: { code: 'GBP', symbol: '£',   rate: 0.00057 },
    DE: { code: 'EUR', symbol: '€',   rate: 0.00069 },
    FR: { code: 'EUR', symbol: '€',   rate: 0.00069 },
    NL: { code: 'EUR', symbol: '€',   rate: 0.00069 },
    SE: { code: 'SEK', symbol: 'kr',  rate: 0.0076  },
    NO: { code: 'NOK', symbol: 'kr',  rate: 0.0076  },
    AU: { code: 'AUD', symbol: 'A$',  rate: 0.0011  },
    NZ: { code: 'NZD', symbol: 'NZ$', rate: 0.0012  },
};

const DEFAULT = { code: 'USD', symbol: '$', rate: 0.00073 };

// 모듈-레벨 오버레이: initExchangeRates() 호출 후 live 환율로 덮어씀
let _liveOverlay = {};

// 앱 시작 시 1회 호출 — 1시간 캐시, 실패 시 하드코딩 폴백
export async function initExchangeRates() {
    const CACHE_KEY = 'jd_fx_rates';
    const CACHE_TTL = 3_600_000; // 1 hour
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { ts, rates } = JSON.parse(cached);
            if (Date.now() - ts < CACHE_TTL) {
                _liveOverlay = rates;
                return;
            }
        }
        const res = await fetch('https://open.er-api.com/v6/latest/KRW');
        const data = await res.json();
        if (data.result === 'success' && data.rates) {
            const built = {};
            for (const [country, info] of Object.entries(CURRENCY_MAP)) {
                if (data.rates[info.code] != null) built[country] = data.rates[info.code];
            }
            _liveOverlay = built;
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates: built }));
        }
    } catch {
        // 네트워크 오류 → 하드코딩 환율 유지
    }
}

export function getCurrency(country) {
    const base = CURRENCY_MAP[country] || DEFAULT;
    const liveRate = _liveOverlay[country];
    return liveRate !== undefined ? { ...base, rate: liveRate } : base;
}

// KRW 금액을 해당 국가 통화로 변환해 표시
// 소액(<10): 소수점 2자리 (e.g. $7.25) / 그 외: 정수 반올림 (e.g. ¥1,650)
export function formatPrice(krwPrice, country) {
    const { code, symbol, rate } = getCurrency(country);
    const amount = Number(krwPrice) || 0;
    if (code === 'KRW') return `₩${amount.toLocaleString()}`;
    const converted = amount * rate;
    const formatted = converted < 10
        ? converted.toFixed(2)
        : Math.round(converted).toLocaleString();
    return `${symbol}${formatted}`;
}
