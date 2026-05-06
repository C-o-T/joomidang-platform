-- products 테이블 확장 마이그레이션
-- 실행 전: MariaDB에서 joomidang DB 선택 후 실행
-- USE joomidang;

ALTER TABLE products
  -- 상품명 중국어
  ADD COLUMN name_zh             VARCHAR(200)   NULL AFTER name_ja,

  -- 가격 확장 (원가 + 할인율)
  ADD COLUMN original_price_krw  DECIMAL(12,2)  NULL AFTER price_krw,
  ADD COLUMN discount            INT            NOT NULL DEFAULT 0 AFTER original_price_krw,

  -- 원재료 한국어 (기존 ingredients_en 옆에)
  ADD COLUMN ingredients_ko      TEXT           NULL AFTER ingredients_en,

  -- 양조장 다국어
  ADD COLUMN brewery_ko          VARCHAR(200)   NULL,
  ADD COLUMN brewery_en          VARCHAR(200)   NULL,
  ADD COLUMN brewery_ja          VARCHAR(200)   NULL,
  ADD COLUMN brewery_zh          VARCHAR(200)   NULL,

  -- 산지
  ADD COLUMN region_ko           VARCHAR(100)   NULL,
  ADD COLUMN region_en           VARCHAR(100)   NULL,

  -- 문화재/유산 인증
  ADD COLUMN heritage_ko         VARCHAR(500)   NULL,
  ADD COLUMN heritage_en         VARCHAR(500)   NULL,

  -- 테이스팅 노트 (JSON: {"nose":"...","palate":"...","finish":"..."})
  ADD COLUMN tasting_ko          JSON           NULL,
  ADD COLUMN tasting_en          JSON           NULL,
  ADD COLUMN tasting_ja          JSON           NULL,
  ADD COLUMN tasting_zh          JSON           NULL,

  -- 페어링 (JSON array: ["김치","삼겹살"])
  ADD COLUMN pairing             JSON           NULL,
  ADD COLUMN pairing_en          JSON           NULL,

  -- 서양 주종 비교 문구 (US/EU 타겟용)
  ADD COLUMN bridge_en           TEXT           NULL;

-- 예시 데이터 삽입 (백화수복 - id=1 기준, 실제 id로 수정 필요)
-- UPDATE products SET
--   brewery_ko='배상면주가', brewery_en='Bae Sang-Myun Brewery',
--   region_ko='경기도 포천', region_en='Pocheon, Gyeonggi',
--   heritage_ko='대한민국 식품명인 제1호', heritage_en='Korea Food Master No.1',
--   tasting_ko='{"nose":"쌀과 누룩의 은은한 향","palate":"부드럽고 달콤한 목넘김","finish":"깔끔한 여운"}',
--   tasting_en='{"nose":"Subtle rice and nuruk aroma","palate":"Smooth and gently sweet","finish":"Clean refreshing finish"}',
--   pairing='["김치전","삼겹살","두부김치"]',
--   pairing_en='["Kimchi pancake","Grilled pork belly","Soft tofu kimchi"]',
--   bridge_en='If you enjoy sake or light white wine, you will love this'
-- WHERE id = 1;
