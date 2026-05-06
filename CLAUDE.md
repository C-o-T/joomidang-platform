# joomidang-platform — Claude Code 컨텍스트

한국 전통주(막걸리·청주·소주·약주) **역직구 이커머스 플랫폼** (KDT 부트캠프 프로젝트)
해외 소비자가 한국 전통주를 직접 구매할 수 있는 B2C 플랫폼.

---

## 프로젝트 구조

```
joomidang-platform/
├── backend/backend/          # Spring Boot 백엔드 (port 8080)
│   ├── src/main/java/com/joomidang/backend/
│   │   ├── user/             # 회원
│   │   ├── product/          # 상품
│   │   ├── cart/             # 장바구니
│   │   ├── order/            # 주문
│   │   ├── seller/           # 판매자
│   │   └── config/           # WebConfig (CORS 등)
│   └── src/main/resources/
│       ├── application.properties        # ← git 제외 (직접 생성)
│       ├── application.properties.example
│       └── mapper/**/*.xml               # MyBatis XML
└── frontend/                 # React + Vite (port 5173)
    └── src/
        ├── api/api.js         # Axios 인스턴스 (baseURL: localhost:8080)
        ├── context/GeoContext.jsx
        ├── i18n/translations.js  # ko/en/ja/zh 100+ 키
        ├── i18n/countries.js     # 25개국 TARGET_COUNTRIES
        └── pages/themes/         # 국가별 메인 테마 (KR/JP/CN/US/EU/SEA)
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | Java 21, Spring Boot, MyBatis, MariaDB (port 3306) |
| 인증 | BCrypt (at.favre.lib:bcrypt), Lombok |
| Frontend | React 18, Vite, React Router v6, Axios |
| 다국어 | 자체 translations.js (ko/en/ja/zh), IP 기반 자동감지 (ip-api.com) |

---

## 로컬 환경 설정

### 1. application.properties 생성

```bash
cp backend/backend/src/main/resources/application.properties.example \
   backend/backend/src/main/resources/application.properties
```

`application.properties` 열어서 실제 DB 정보 입력:
```properties
spring.datasource.url=jdbc:log4jdbc:mariadb://localhost:3306/joomidang?useUTF8=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=mariadb
```

### 2. DB 생성

MariaDB에서 `joomidang` 데이터베이스 생성.
`backend/backend/src/main/resources/db/product-schema-extension.sql` 실행.

### 3. 백엔드 실행

```bash
cd backend/backend
./gradlew bootRun
# http://localhost:8080
```

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

---

## 아키텍처 패턴

- **Controller → Service → Mapper(인터페이스) → MyBatis XML → MariaDB**
- CORS: localhost:5173, 5174, 3000 허용
- Soft Delete: `is_deleted` 컬럼
- 에러 처리: try-catch + e.printStackTrace() + 500 + 한국어 메시지
- 응답: POST=201, GET=객체직접, PUT/DELETE=200

---

## REST API

### Users
- `POST /users` — 회원가입
- `GET /users/check-email?email=...` — 이메일 중복확인 (query param, @ 이슈로 path variable 불가)
- `POST /users/login` — 로그인 (BCrypt 검증, 성공 시 userDTO, 실패 시 401)
- `GET /users/{id}` — 단건 조회

### Products
- `POST /products` — 등록
- `GET /products` — 전체 목록 (ON_SALE만)
- `GET /products/{id}` — 단건
- `GET /products/seller/{sellerId}` — 판매자별
- `PUT /products/{id}` — 수정
- `DELETE /products/{id}` — soft delete

### Cart
- `POST /cart` — 추가 (upsert: 동일상품이면 수량만 증가)
- `GET /cart/user/{userId}` — 목록 (products JOIN 포함)
- `PUT /cart/{id}` — 수량 수정
- `DELETE /cart/{id}` — 항목 삭제
- `DELETE /cart/user/{userId}` — 전체 비우기

### Orders
- `POST /orders` — 생성 (@Transactional: orders+order_items+재고감소)
- `GET /orders/{id}` — 단건 (items 포함)
- `GET /orders/user/{userId}` — 사용자별
- `PUT /orders/{id}/status` — 상태 변경

### Sellers
- `POST /sellers` — 판매자 등록 신청
- `GET /sellers/check-business-number/{num}` — 사업자번호 중복확인
- `GET /sellers/{id}` — 단건 (seller id)
- `GET /sellers/user/{userId}` — 단건 (user id)

---

## Frontend 라우트

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | MainPage | 상품 목록 + 카테고리 필터 |
| `/login` | LoginPage | 로그인 |
| `/join` | JoinPage | 회원가입 |
| `/products/:id` | ProductDetailPage | 상품 상세 |
| `/cart` | CartPage | 장바구니 |
| `/order` | OrderPage | 주문 (state로 items 전달) |
| `/export-guide` | ExportGuidePage | 수출 가이드 (SELLER 전용) |

---

## 코딩 컨벤션

### Backend
- 어노테이션: `@RestController`, `@RequiredArgsConstructor`, `@Data` (Lombok)
- `@Transactional`: OrderService만 사용
- 금액: `BigDecimal`
- 타임스탬프: `LocalDateTime`, 날짜: `LocalDate`
- 패키지: `com.joomidang.backend.{모듈}.{controller|service|mapper|dto}`

### Frontend
- 컴포넌트: 함수형, PascalCase 파일명
- 스타일: CSS Modules (`*.module.css`)
- API: `src/api/api.js`의 axios 인스턴스 사용
- 세션: localStorage에 `user` JSON 저장
- 다국어: `useGeo()` hook → `{ lang, t, country }` → `t('key')`

---

## DTO ↔ DB 주요 컬럼 매핑

### UserDTO
`id, email, password, name, role(CONSUMER|SELLER|ADMIN), country, phone, birthDate(birth_date), ageVerified(age_verified), preferredLanguage(preferred_language), createdAt, updatedAt`

### ProductDTO
`id, sellerId, name(name_ko), nameEn, nameJa, category(막걸리|청주|소주|약주|기타), description(description_ko), descriptionEn, price(price_krw), stock, alcoholPercentage(alcohol), volumeMl(volume), status(PENDING|ACTIVE|INACTIVE|REJECTED)`

### OrderDTO
`id, userId, sellerId, productPrice, shippingFee, totalPrice, currency, exchangeRate, receiverName, receiverPhone, shippingCountry, shippingZip, shippingAddress, status(PENDING|PAID|PREPARING|SHIPPED|DELIVERED|CANCELLED|REFUNDED)`

### SellerDTO
`id, userId, breweryName(brewery_name), representativeName, businessNumber, licenseNumber, address, contactPhone, contactEmail, commissionRate, status(PENDING|APPROVED|REJECTED|SUSPENDED)`

---

## 다국어 헬퍼 (i18n)

```js
// countries.js 주요 함수
getProductName(product, lang)   // product.nameKo / nameEn / nameJa
getProductDesc(product, lang)   // product.description / descriptionEn
getCountryName(country, lang)   // 국가명 현지화

// GeoContext
const { lang, t, country, setCountry } = useGeo()
t('nav.home')  // translations.js에서 ko/en/ja/zh 자동 선택
```
