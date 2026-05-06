# 주미당(Joomidang) 프로젝트 인수인계 문서

> 최종 업데이트: 2026-05-06  
> 이 문서는 다른 PC/세션에서 즉시 작업을 이어받을 수 있도록 작성된 완전한 인수인계 파일입니다.

---

## 1. 프로젝트 개요

한국 전통주(막걸리·소주·약주 등)를 해외로 역직구 판매하는 B2C 이커머스 플랫폼.  
**핵심 차별점**: IP 기반 국가 감지 → 나라별 UX 테마 자동 전환 (쿠팡/라쿠텐/타오바오/아마존/잘란도/쇼피 스타일)

```
주미당 = 酒美堂 = 술이 아름다운 집
도메인: joomidang.com
```

---

## 2. 기술 스택

| 계층 | 기술 | 버전/상세 |
|------|------|-----------|
| Frontend | React + Vite | CSS Modules, React Router v6 |
| Backend | Spring Boot | MyBatis XML mapper, MariaDB |
| DB | MariaDB | localhost:3306/joomidang |
| 인증 | localStorage 기반 (JWT 미구현) | `localStorage('user')` |
| 환율 | open.er-api.com | localStorage 1시간 TTL 캐싱 |

### 실행 포트
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:8080` (Spring Boot)
- DB: `localhost:3306` / DB명: `joomidang`

---

## 3. 폴더 구조 (핵심만)

```
joomidang-platform/
├── frontend/
│   └── src/
│       ├── api/              # axios 인스턴스, API 호출 함수
│       ├── components/       # 공통 컴포넌트 (Navbar, CountryLangToggle, AgeGate 등)
│       ├── context/
│       │   └── GeoContext.jsx        # IP감지→국가/언어/번역 상태 관리 (핵심!)
│       ├── hooks/
│       │   └── useProducts.js        # 상품 API + 더미데이터 폴백 + 카테고리 필터
│       ├── i18n/
│       │   └── countries.js          # 국가별 번역문, CATEGORY_KEYS, getProductName
│       ├── pages/
│       │   ├── themes/               # 6개 테마 페이지 + CSS Modules
│       │   │   ├── MainPageKR.jsx    # 쿠팡 스타일
│       │   │   ├── MainPageJP.jsx    # 라쿠텐 스타일
│       │   │   ├── MainPageCN.jsx    # 타오바오/징동 스타일
│       │   │   ├── MainPageUS.jsx    # 아마존 스타일
│       │   │   ├── MainPageEU.jsx    # 잘란도/ASOS 스타일
│       │   │   ├── MainPageSEA.jsx   # 쇼피 스타일
│       │   │   └── MainPageDefault.jsx  # 다크 미니멀 (기본값)
│       │   ├── SellerRegisterPage.jsx    # 판매자(양조장) 등록
│       │   ├── SellerDashboardPage.jsx   # 판매자 대시보드 + 상품 CRUD
│       │   ├── AdminPage.jsx             # 관리자 패널 (판매자/상품 승인)
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── JoinPage.jsx
│       ├── utils/
│       │   └── currency.js           # 다국통화 변환 + 실시간 환율 API
│       └── product-schema-extension.sql  # ⚠️ 반드시 실행해야 하는 DB 마이그레이션!
│
├── backend/
│   └── backend/src/main/java/com/joomidang/backend/
│       ├── cart/             # CartController, CartService, CartMapper, CartDTO
│       ├── config/           # WebConfig (CORS), SecurityConfig
│       ├── order/            # OrderController, OrderService, OrderMapper, OrderDTO
│       ├── product/          # ProductController, ProductService, ProductMapper, ProductDTO
│       ├── seller/           # SellerController, SellerService, SellerMapper, SellerDTO
│       └── user/             # UserController, UserService, UserMapper, UserDTO
│   └── DB/
│       └── create.sql        # DB 초기 스키마
│
├── CLAUDE.md                 # Claude Code 프로젝트 지침 (중요!)
└── HANDOFF.md                # 이 파일
```

---

## 4. 환경 설정 (새 PC 셋업)

### 4-1. 사전 요구사항
```bash
# Node.js 18+ 필요
node -v

# Java 17+ 필요
java -version

# MariaDB 설치 및 실행 확인
mysql -u root -p
```

### 4-2. DB 초기화
```sql
-- MariaDB에서 실행
CREATE DATABASE IF NOT EXISTS joomidang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE joomidang;
SOURCE backend/DB/create.sql;

-- ⚠️ 반드시 추가 마이그레이션 실행! (신규 컬럼 17개 추가)
SOURCE frontend/src/product-schema-extension.sql;
```

### 4-3. Backend 설정
파일: `backend/backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/joomidang
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE   # ← 본인 MariaDB 비밀번호 입력
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
```

### 4-4. Frontend 실행
```bash
cd joomidang-platform/frontend
npm install
npm run dev
# → http://localhost:5173
```

### 4-5. Backend 실행
```bash
cd joomidang-platform/backend/backend
./mvnw spring-boot:run
# 또는 IntelliJ에서 BackendApplication.java 실행
# → http://localhost:8080
```

---

## 5. 아키텍처 핵심 개념

### 5-1. GeoContext — 국가/테마 감지
```
앱 시작 → ip-api.com으로 IP 감지 → country 코드 저장
→ getThemeForCountry(country) → 테마 키 반환
→ MainPage.jsx가 테마 키에 따라 해당 MainPageXX.jsx 렌더링
```
- localStorage 키: `jd_country`, `jd_lang`
- `ready` 플래그: AgeGate 중복 표시 방지용

### 5-2. 테마 라우팅
```js
// MainPage.jsx 내부 (대략)
const theme = getThemeForCountry(country);
if (theme === 'KR') return <MainPageKR />;
if (theme === 'JP') return <MainPageJP />;
// ... 등
```

### 5-3. 더미데이터 폴백 (DUMMY_PRODUCTS)
- `useProducts.js`에서 API 실패 시 하드코딩된 상품 데이터로 폴백
- **실제 DB에 상품이 들어오면 자동으로 실제 데이터를 사용함**
- 새 DB에서 스키마 확장 SQL 실행 후 fields가 올바르게 매핑되는지 확인 필요

### 5-4. STATS_FROM_DB 플래그
```js
// useProducts.js
export const STATS_FROM_DB = false;  // ← rating/reviews/sold 데이터 준비 전까지 false 유지
```
- `getStat(product, 'rating')` → STATS_FROM_DB가 false면 null 반환 → UI에 "리뷰 없음" 표시
- 리뷰 테이블 + API 구현 후 `true`로 변경

### 5-5. 실시간 환율
```js
// App.jsx에서 앱 시작 시 호출
initExchangeRates(); // open.er-api.com/v6/latest/KRW
// → _liveOverlay 모듈변수에 저장
// → getCurrency(country) 호출 시 실시간 환율 우선 사용
// → localStorage 'jd_fx_rates' 1시간 TTL 캐싱
```

### 5-6. 판매자/관리자 권한
```js
// localStorage에 저장된 user 객체
{ id, name, email, role: 'CONSUMER' | 'SELLER' | 'ADMIN' }
```
- ⚠️ 백엔드에 JWT 인증 미구현 — 현재 모든 엔드포인트가 인증 없이 접근 가능
- 판매자 상태 흐름: `PENDING → APPROVED / REJECTED / SUSPENDED`
- 상품 상태 흐름: `PENDING → ACTIVE / REJECTED / INACTIVE`

---

## 6. 이번 세션에서 완료한 작업

### [완료] MainPageDefault - 풍부한 상품 정보 표시
- `getBrewery(p, lang)`, `getRegion(p, lang)`, `getHeritage(p, lang)` 헬퍼 추가
- 양조장명·산지·문화유산 배지 카드에 표시
- `formatPrice(price, country)`로 다국통화 표시

### [완료] 실시간 환율 API 연동
- `currency.js` 완전 재작성: `initExchangeRates()`, `_liveOverlay`, localStorage 캐싱
- `App.jsx`에서 앱 시작 시 초기화

### [완료] 판매자 온보딩 인프라 구축

**Frontend 신규 파일:**
- `SellerRegisterPage.jsx` — 양조장 등록 폼 (사업자번호 중복확인 포함)
- `SellerDashboardPage.jsx` — 상품 CRUD 대시보드 + 상태 배너
- `AdminPage.jsx` — 판매자/상품 승인 패널

**Backend 추가 엔드포인트:**
```
GET    /sellers                     # 전체 판매자 목록 (관리자용)
PUT    /sellers/{id}/status         # 판매자 승인/거절/정지
GET    /products/admin              # 전체 상품 목록 (삭제 제외, 관리자용)
PATCH  /products/{id}/status        # 상품 상태 변경
```

**Navbar에 역할별 링크 추가:**
- SELLER: `/seller/dashboard` (🏭 판매자 관리)
- ADMIN: `/admin` (⚙️ 관리자)

### [완료] 비기능 UI 요소 전면 수정

| 페이지 | 수정 내용 |
|--------|-----------|
| **MainPageJP** | 사이드바 필터(가격대/도수/체크박스) 실제 작동, 검색 연결, 위시리스트 localStorage 저장, 랭킹탭 정렬 |
| **MainPageCN** | 검색 연결, 핫태그 클릭→검색, 장바구니/주문/고객서비스 버튼 연결, 플로팅 버튼 작동 |
| **MainPageUS** | 검색 연결, 부서 드롭다운 카테고리 필터링, 정렬 드롭다운 작동, 장바구니 버튼 연결 |
| **MainPageEU** | 검색 토글 바, 정렬 연결, 위시리스트 ❤️ 토글, Quick View 모달, 장바구니 연결 |
| **MainPageKR** | "장바구니 담기" → `/cart` 연결 (이전엔 `/join`) |
| **MainPageSEA** | 앱 다운로드 버튼 → alert 처리 |

---

## 7. 남은 작업 (우선순위 순)

### 🔴 최우선 (실제 판매자 온보딩 전 필수)

#### 1. DB 마이그레이션 실행
```bash
# MariaDB에서 실행
SOURCE frontend/src/product-schema-extension.sql;
```
이 SQL이 실행되어야 아래 컬럼들이 존재함:
`name_zh`, `original_price_krw`, `discount`, `ingredients_ko`,
`brewery_ko`, `brewery_en`, `brewery_ja`, `brewery_zh`,
`region_ko`, `region_en`, `heritage_ko`, `heritage_en`,
`tasting_ko`, `tasting_en`, `tasting_ja`, `tasting_zh`,
`pairing`, `pairing_en`, `bridge_en`

#### 2. cart-mapper.xml 업데이트
마이그레이션 후 `cart-mapper.xml` SELECT에 `p.name_zh` 추가 필요
(현재 주석 처리된 부분 있음)

#### 3. JWT 인증 구현
현재 백엔드에 인증이 전혀 없음. 판매자/관리자 엔드포인트가 누구나 접근 가능한 상태.
```
구현 순서:
1. UserController /login → JWT 토큰 발급 (jjwt 라이브러리)
2. JwtFilter → 모든 요청 헤더에서 토큰 검증
3. /sellers, /products/admin, /products/{id}/status 등에 권한 체크 추가
```

---

### 🟡 중요 기능 (출시 전 필요)

#### 4. 이미지 업로드 서비스
현재 `thumbnailUrl`은 URL 문자열만 저장 가능. 실제 파일 업로드 불가.
```
구현 필요:
- POST /upload (multipart/form-data) → 파일 저장 (로컬 or S3) → URL 반환
- SellerDashboardPage ProductForm의 이미지 업로드 버튼 연결
- 상품카드에서 thumbnailUrl이 있으면 <img/> 표시 (현재 모두 🍶 이모지)
```

#### 5. 리뷰/평점 시스템
```
구현 필요:
- reviews 테이블 생성 (user_id, product_id, rating, content, created_at)
- GET /products/{id}/reviews
- POST /products/{id}/reviews (로그인 필수)
- STATS_FROM_DB = true 로 변경
- 모든 themed pages에서 getStat() 실제 데이터 표시
```

#### 6. 장바구니 헤더 배지
모든 테마 페이지의 Cart 아이콘에 `(0)` 하드코딩됨. 실제 수량 표시 필요.
```js
// CartContext 또는 useCart hook 생성
// GET /cart/{userId} 응답의 items.length → Navbar/헤더에 전달
```

#### 7. 주문내역 페이지
현재 "Returns & Orders" / "注文履歴" 클릭 시 `/login`으로 이동.
실제 주문목록 페이지(`/orders`) 구현 필요.

---

### 🟢 개선 사항 (여유 있을 때)

#### 8. 상품 시음노트/페어링 입력 UI
`SellerDashboardPage`의 `ProductForm`에 시음노트(ko/en/ja/zh), 페어링 항목 입력 필드 미구현.
JSON 형식으로 DB에 저장되는 구조는 이미 있음.

#### 9. 모바일 반응형 검증
테마 페이지들에 `@media` 쿼리가 있지만 실제 모바일 환경에서 미검증.

#### 10. SEA 앱 다운로드 버튼
현재 `alert('모바일 앱은 준비 중입니다.')` 처리됨.
실제 앱스토어 링크 준비되면 교체.

#### 11. CORS 프로덕션 설정
`WebConfig.java`의 허용 origin이 `localhost:5173, 5174, 3000`만 등록됨.
프로덕션 도메인으로 업데이트 필요.

---

## 8. 주요 API 엔드포인트 전체 목록

### User
```
POST   /users/register         # 회원가입
POST   /users/login            # 로그인 (⚠️ JWT 미구현)
GET    /users/{id}             # 사용자 조회
PUT    /users/{id}             # 사용자 정보 수정
```

### Product
```
GET    /products               # 상품 목록 (status=ACTIVE만)
GET    /products/{id}          # 상품 상세
GET    /products/seller/{sid}  # 판매자별 상품 목록
POST   /products               # 상품 등록 (판매자용, status=PENDING)
PUT    /products/{id}          # 상품 수정
DELETE /products/{id}          # 상품 삭제 (soft delete)
GET    /products/admin         # 전체 상품 (관리자용, 삭제 제외)
PATCH  /products/{id}/status   # 상품 상태 변경 (관리자용)
```

### Seller
```
POST   /sellers                         # 판매자 등록 신청
GET    /sellers/user/{userId}           # 특정 유저의 판매자 정보
GET    /sellers/check-business-number/{bn}  # 사업자번호 중복확인
GET    /sellers                         # 전체 판매자 목록 (관리자용)
PUT    /sellers/{id}/status             # 판매자 상태 변경 (관리자용)
```

### Cart
```
GET    /cart/{userId}          # 장바구니 조회
POST   /cart/{userId}          # 장바구니 아이템 추가
PUT    /cart/{userId}/{itemId}  # 수량 변경
DELETE /cart/{userId}/{itemId}  # 아이템 삭제
```

### Order
```
POST   /orders                 # 주문 생성
GET    /orders/user/{userId}   # 사용자 주문 목록
GET    /orders/{id}            # 주문 상세
PATCH  /orders/{id}/status     # 주문 상태 변경
```

---

## 9. 알려진 주의사항 / 트랩

### 주의 1: product-schema-extension.sql 미실행
가장 흔한 문제. create.sql만 실행하면 신규 컬럼들이 없어서 상품 등록/수정 시 SQL 오류 발생.
→ **반드시 `product-schema-extension.sql`도 실행할 것**

### 주의 2: STATS_FROM_DB = false
`useProducts.js`에 이 플래그가 있음. false인 동안 rating/reviews/sold는 모두 null 처리됨.
KR 테마에서도 이를 사용하므로 true로 바꾸기 전 리뷰 API가 완전히 구현되어야 함.

### 주의 3: AgeGate 렌더링 순서
`GeoContext`의 `ready` 플래그가 true가 되기 전에 AgeGate가 뜨면 안 됨.
IP 감지 완료 후 `ready = true` → AgeGate 표시 흐름임. 이 로직 수정 시 주의.

### 주의 4: CountryLangToggle 드롭다운
`position: fixed + getBoundingClientRect()` 로 구현됨. 부모의 overflow:hidden을 탈출하기 위함.
레이아웃 변경 시 위치 계산이 틀어질 수 있음.

### 주의 5: @JsonRawValue ProductDTO
`tastingKo`, `tastingEn`, `pairingEn` 등 JSON 컬럼들이 `@JsonRawValue`로 선언됨.
DB에 JSON 문자열(`["페어링1","페어링2"]`)로 저장하면 프론트에서 파싱 없이 배열로 받음.
일반 String으로 변경하면 이중 직렬화 문제 발생.

### 주의 6: 위시리스트 localStorage 키
JP 테마와 EU 테마가 동일한 `jd_wishlist` 키 사용 (의도된 공유).
Set 형태로 관리: `new Set(JSON.parse(localStorage.getItem('jd_wishlist') || '[]'))`

---

## 10. 개발 팁

### 빠른 테스트 계정 생성
```sql
-- 관리자 계정
INSERT INTO users (email, password, name, role) VALUES ('admin@joomidang.com', 'hashed_pw', '관리자', 'ADMIN');

-- 테스트 판매자
INSERT INTO users (email, password, name, role) VALUES ('seller@test.com', 'hashed_pw', '테스트양조장', 'SELLER');
```

### 테마 강제 변경 (개발용)
```js
// 브라우저 콘솔에서
localStorage.setItem('jd_country', 'JP');  // JP 테마 강제
location.reload();
```

### 환율 캐시 초기화
```js
// 브라우저 콘솔에서
localStorage.removeItem('jd_fx_rates');
location.reload();
```

### 위시리스트 초기화
```js
localStorage.removeItem('jd_wishlist');
```

---

## 11. 프로젝트 비전 (참고용)

1. **Phase 1 (현재)**: MVP — 6개국 테마, 상품 카탈로그, 판매자 온보딩 인프라
2. **Phase 2**: 실 판매자 온보딩, JWT 인증, 이미지 업로드, 리뷰 시스템
3. **Phase 3**: 결제 연동 (Stripe/PayPal/현지 결제수단), 배송 추적, 세관신고 자동화
4. **Phase 4**: 모바일 앱 (React Native), 구독 서비스, B2B 대량구매

---

*문서 끝 — 궁금한 점은 이 파일을 Claude Code에 열고 질문하세요.*
