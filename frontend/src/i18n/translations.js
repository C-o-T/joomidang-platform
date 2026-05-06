//주미당 UI 전체 번역 파일
//지원 언어: 한국어(ko) / English(en) / 日本語(ja) / 中文(zh)

export const translations = {

    /* ================================================================
     * 한국어 (ko)
     * ================================================================ */
    ko: {
        //Navbar
        nav_cart:      '🛒 장바구니',
        nav_login:     '로그인',
        nav_join:      '회원가입',
        nav_logout:    '로그아웃',
        nav_export:    '수출 가이드',
        nav_greeting:  (name) => `${name}님`,

        //카테고리
        cat_all:       '전체',
        cat_makgeolli: '막걸리',
        cat_soju:      '소주',
        cat_cheongju:  '청주',
        cat_yakju:     '약주',
        cat_fruit:     '과실주',

        //메인 히어로
        hero_sub:   'Korean Traditional Liquor Platform',
        hero_title: '세계로 전하는\n우리 술 이야기',
        hero_desc:  '수백 년 역사의 전통 방식으로 빚은 한국 전통주를\n전 세계 어디서든 만나보세요.',
        hero_btn:   '지금 시작하기 →',

        //상품 목록
        filter_count: (n) => `${n}개 상품`,
        empty:        '해당 카테고리의 상품이 없습니다.',
        loading:      '로딩 중...',
        degree:       '도',
        volume_unit:  'ml',
        weight_unit:  'g',
        price_unit:   '원',

        //푸터
        footer_legal: '주미당은 통신판매중개업자로서 거래 당사자가 아니며, 상품 정보 및 거래에 대한 책임은 판매자에게 있습니다.',
        footer_biz:   '사업자등록번호: 000-00-00000 · 대표: 홍길동 · 주소: 서울특별시 강남구',

        //로그인 페이지
        login_subtitle:     '전통주 역직구 플랫폼에 오신 것을 환영합니다',
        login_email:        '이메일',
        login_pw:           '비밀번호',
        login_email_ph:     'example@email.com',
        login_pw_ph:        '비밀번호를 입력하세요',
        login_btn:          '로그인',
        login_err_invalid:  '이메일 또는 비밀번호가 올바르지 않습니다.',
        login_err_fail:     '로그인에 실패했습니다. 다시 시도해주세요.',
        login_no_account:   '계정이 없으신가요?',
        login_join_link:    '회원가입',

        //회원가입 페이지
        join_subtitle:        '새 계정을 만들어 전통주를 경험하세요',
        join_section_basic:   '기본 정보',
        join_section_extra:   '추가 정보 (선택)',
        join_role:            '가입 유형 *',
        join_role_consumer:   '소비자 (구매 목적)',
        join_role_seller:     '양조장 (판매 목적)',
        join_email:           '이메일 *',
        join_email_check:     '중복확인',
        join_pw:              '비밀번호 *',
        join_name:            '이름 *',
        join_country:         '국가',
        join_country_ph:      '국가를 선택하세요',
        join_phone:           '전화번호',
        join_phone_ph:        '+82-10-1234-5678',
        join_birth:           '생년월일',
        join_lang:            '언어',
        join_btn:             '회원가입',
        join_has_account:     '이미 계정이 있으신가요?',
        join_login_link:      '로그인',
        join_email_ok:        '사용 가능한 이메일입니다.',
        join_email_fail:      '이미 사용 중인 이메일입니다.',
        join_email_err:       '확인 중 오류가 발생했습니다.',
        join_email_required:  '이메일 중복 확인을 해주세요.',
        join_success:         '회원가입이 완료되었습니다.',
        join_fail:            '회원가입에 실패했습니다. 다시 시도해주세요.',

        //상품 상세 페이지
        detail_back:           '← 뒤로',
        detail_degree:         '도수',
        detail_volume:         '용량',
        detail_weight:         '무게',
        detail_desc:           '설명',
        detail_cart:           '장바구니 담기',
        detail_buy:            '바로 주문',
        detail_login_required: '로그인이 필요합니다.',
        detail_cart_success:   '장바구니에 담았습니다.',

        //장바구니 페이지
        cart_title:     '장바구니',
        cart_empty:     '장바구니가 비어있습니다.',
        cart_product:   '상품명',
        cart_qty:       '수량',
        cart_price:     '가격',
        cart_delete:    '삭제',
        cart_total:     (formatted) => `합계: ${formatted}`,
        cart_order_btn: '주문하기',

        //주문 페이지
        order_title:    '배송지 입력',
        order_receiver: '수령인 이름',
        order_phone:    '연락처',
        order_zip:      '우편번호',
        order_address:  '주소',
        order_country:  '배송 국가',
        order_country_ph: '배송 국가를 선택하세요',
        order_memo:     '요청사항 (선택)',
        order_memo_ph:  '배송 관련 요청사항을 입력하세요',
        order_btn:      '주문 확정',
        order_success:  '주문이 완료되었습니다!',
        order_fail:     '주문 실패. 다시 시도해주세요.',
    },

    /* ================================================================
     * English (en)
     * ================================================================ */
    en: {
        //Navbar
        nav_cart:      '🛒 Cart',
        nav_login:     'Login',
        nav_join:      'Sign Up',
        nav_logout:    'Logout',
        nav_export:    'Export Guide',
        nav_greeting:  (name) => `Hi, ${name}`,

        //Categories
        cat_all:       'All',
        cat_makgeolli: 'Makgeolli',
        cat_soju:      'Soju',
        cat_cheongju:  'Cheongju',
        cat_yakju:     'Yakju',
        cat_fruit:     'Fruit Wine',

        //Hero
        hero_sub:   'Korean Traditional Liquor Platform',
        hero_title: 'Authentic Korean\nSpirits to the World',
        hero_desc:  'Discover traditional Korean liquors brewed with\ncenturies of heritage, delivered worldwide.',
        hero_btn:   'Get Started →',

        //Products
        filter_count: (n) => `${n} products`,
        empty:        'No products in this category.',
        loading:      'Loading...',
        degree:       '%',
        volume_unit:  'ml',
        weight_unit:  'g',
        price_unit:   'KRW',

        //Footer
        footer_legal: 'Joomidang is a marketplace operator and is not a party to transactions. Sellers are responsible for product information and transactions.',
        footer_biz:   'Business Reg. No.: 000-00-00000 · CEO: Gil-dong Hong · Address: Gangnam-gu, Seoul',

        //Login
        login_subtitle:     'Welcome to the Korean Traditional Liquor Platform',
        login_email:        'Email',
        login_pw:           'Password',
        login_email_ph:     'example@email.com',
        login_pw_ph:        'Enter your password',
        login_btn:          'Login',
        login_err_invalid:  'Invalid email or password.',
        login_err_fail:     'Login failed. Please try again.',
        login_no_account:   "Don't have an account?",
        login_join_link:    'Sign Up',

        //Sign Up
        join_subtitle:        'Create an account to experience Korean traditional liquors',
        join_section_basic:   'Basic Information',
        join_section_extra:   'Additional Information (Optional)',
        join_role:            'Account Type *',
        join_role_consumer:   'Consumer (Purchasing)',
        join_role_seller:     'Brewery (Selling)',
        join_email:           'Email *',
        join_email_check:     'Check',
        join_pw:              'Password *',
        join_name:            'Full Name *',
        join_country:         'Country',
        join_country_ph:      'Select your country',
        join_phone:           'Phone Number',
        join_phone_ph:        '+1-234-567-8900',
        join_birth:           'Date of Birth',
        join_lang:            'Language',
        join_btn:             'Sign Up',
        join_has_account:     'Already have an account?',
        join_login_link:      'Login',
        join_email_ok:        'This email is available.',
        join_email_fail:      'This email is already in use.',
        join_email_err:       'An error occurred. Please try again.',
        join_email_required:  'Please verify your email first.',
        join_success:         'Registration complete!',
        join_fail:            'Registration failed. Please try again.',

        //Product Detail
        detail_back:           '← Back',
        detail_degree:         'Alcohol',
        detail_volume:         'Volume',
        detail_weight:         'Weight',
        detail_desc:           'Description',
        detail_cart:           'Add to Cart',
        detail_buy:            'Buy Now',
        detail_login_required: 'Please login first.',
        detail_cart_success:   'Added to cart.',

        //Cart
        cart_title:     'Shopping Cart',
        cart_empty:     'Your cart is empty.',
        cart_product:   'Product',
        cart_qty:       'Qty',
        cart_price:     'Price',
        cart_delete:    'Remove',
        cart_total:     (formatted) => `Total: ${formatted}`,
        cart_order_btn: 'Checkout',

        //Order
        order_title:      'Shipping Information',
        order_receiver:   "Recipient's Name",
        order_phone:      'Phone Number',
        order_zip:        'ZIP / Postal Code',
        order_address:    'Address',
        order_country:    'Shipping Country',
        order_country_ph: 'Select shipping country',
        order_memo:       'Special Instructions (Optional)',
        order_memo_ph:    'Any special requests for delivery',
        order_btn:        'Confirm Order',
        order_success:    'Order placed successfully!',
        order_fail:       'Order failed. Please try again.',
    },

    /* ================================================================
     * 日本語 (ja)
     * ================================================================ */
    ja: {
        //Navbar
        nav_cart:      '🛒 カート',
        nav_login:     'ログイン',
        nav_join:      '会員登録',
        nav_logout:    'ログアウト',
        nav_export:    '輸出ガイド',
        nav_greeting:  (name) => `${name}さん`,

        //カテゴリー
        cat_all:       'すべて',
        cat_makgeolli: 'マッコリ',
        cat_soju:      '焼酎',
        cat_cheongju:  '清酒',
        cat_yakju:     '薬酒',
        cat_fruit:     '果実酒',

        //ヒーロー
        hero_sub:   '韓国伝統酒プラットフォーム',
        hero_title: '世界へ届ける、\n韓国の伝統酒',
        hero_desc:  '数百年の歴史ある伝統的な製法で醸した\n韓国の伝統酒を、世界中へお届けします。',
        hero_btn:   '今すぐ始める →',

        //商品
        filter_count: (n) => `${n}件の商品`,
        empty:        'このカテゴリには商品がありません。',
        loading:      '読み込み中...',
        degree:       '度',
        volume_unit:  'ml',
        weight_unit:  'g',
        price_unit:   'KRW',

        //フッター
        footer_legal: 'ジュミダンは通信販売仲介業者であり、取引当事者ではありません。商品情報および取引に関する責任は販売者にあります。',
        footer_biz:   '事業者登録番号: 000-00-00000 · 代表: Hong Gil-dong · 住所: ソウル特別市 江南区',

        //ログイン
        login_subtitle:     '韓国伝統酒プラットフォームへようこそ',
        login_email:        'メールアドレス',
        login_pw:           'パスワード',
        login_email_ph:     'example@email.com',
        login_pw_ph:        'パスワードを入力してください',
        login_btn:          'ログイン',
        login_err_invalid:  'メールアドレスまたはパスワードが正しくありません。',
        login_err_fail:     'ログインに失敗しました。もう一度お試しください。',
        login_no_account:   'アカウントをお持ちでない方は',
        login_join_link:    '会員登録',

        //会員登録
        join_subtitle:        'アカウントを作成して韓国の伝統酒を体験しましょう',
        join_section_basic:   '基本情報',
        join_section_extra:   '追加情報（任意）',
        join_role:            'アカウントの種類 *',
        join_role_consumer:   '一般ユーザー（購入目的）',
        join_role_seller:     '醸造所（販売目的）',
        join_email:           'メールアドレス *',
        join_email_check:     '確認',
        join_pw:              'パスワード *',
        join_name:            'お名前 *',
        join_country:         '国',
        join_country_ph:      '国を選択してください',
        join_phone:           '電話番号',
        join_phone_ph:        '+81-90-1234-5678',
        join_birth:           '生年月日',
        join_lang:            '言語',
        join_btn:             '会員登録',
        join_has_account:     'すでにアカウントをお持ちですか？',
        join_login_link:      'ログイン',
        join_email_ok:        'このメールアドレスは使用できます。',
        join_email_fail:      'このメールアドレスはすでに使用されています。',
        join_email_err:       'エラーが発生しました。もう一度お試しください。',
        join_email_required:  'メールアドレスの重複確認をしてください。',
        join_success:         '会員登録が完了しました。',
        join_fail:            '会員登録に失敗しました。もう一度お試しください。',

        //商品詳細
        detail_back:           '← 戻る',
        detail_degree:         'アルコール度数',
        detail_volume:         '容量',
        detail_weight:         '重量',
        detail_desc:           '説明',
        detail_cart:           'カートに追加',
        detail_buy:            '今すぐ購入',
        detail_login_required: 'ログインが必要です。',
        detail_cart_success:   'カートに追加しました。',

        //カート
        cart_title:     'カート',
        cart_empty:     'カートは空です。',
        cart_product:   '商品名',
        cart_qty:       '数量',
        cart_price:     '価格',
        cart_delete:    '削除',
        cart_total:     (formatted) => `合計: ${formatted}`,
        cart_order_btn: '注文する',

        //注文
        order_title:      '配送先の入力',
        order_receiver:   '受取人のお名前',
        order_phone:      '電話番号',
        order_zip:        '郵便番号',
        order_address:    'ご住所',
        order_country:    '配送国',
        order_country_ph: '配送国を選択してください',
        order_memo:       'ご要望（任意）',
        order_memo_ph:    '配送に関するご要望をご記入ください',
        order_btn:        '注文を確定する',
        order_success:    'ご注文が完了しました！',
        order_fail:       '注文に失敗しました。もう一度お試しください。',
    },

    /* ================================================================
     * 中文 (zh)
     * ================================================================ */
    zh: {
        //Navbar
        nav_cart:      '🛒 购物车',
        nav_login:     '登录',
        nav_join:      '注册',
        nav_logout:    '退出登录',
        nav_export:    '出口指南',
        nav_greeting:  (name) => `${name}`,

        //分类
        cat_all:       '全部',
        cat_makgeolli: '马格利酒',
        cat_soju:      '烧酒',
        cat_cheongju:  '清酒',
        cat_yakju:     '药酒',
        cat_fruit:     '果酒',

        //首页横幅
        hero_sub:   '韩国传统酒平台',
        hero_title: '传递给世界的\n韩国传统酒',
        hero_desc:  '以数百年历史的传统酿造工艺精心酿制的\n韩国传统酒，送达世界各地。',
        hero_btn:   '立即开始 →',

        //商品
        filter_count: (n) => `${n}件商品`,
        empty:        '该分类暂无商品。',
        loading:      '加载中...',
        degree:       '度',
        volume_unit:  'ml',
        weight_unit:  'g',
        price_unit:   'KRW',

        //页脚
        footer_legal: '주미당是通信销售中介商，不是交易当事方，商品信息及交易责任由卖家承担。',
        footer_biz:   '营业执照号: 000-00-00000 · 代表: 洪吉童 · 地址: 首尔特别市 江南区',

        //登录
        login_subtitle:     '欢迎来到韩国传统酒平台',
        login_email:        '邮箱',
        login_pw:           '密码',
        login_email_ph:     'example@email.com',
        login_pw_ph:        '请输入密码',
        login_btn:          '登录',
        login_err_invalid:  '邮箱或密码不正确。',
        login_err_fail:     '登录失败，请重试。',
        login_no_account:   '没有账号？',
        login_join_link:    '立即注册',

        //注册
        join_subtitle:        '创建账号，体验韩国传统酒',
        join_section_basic:   '基本信息',
        join_section_extra:   '附加信息（可选）',
        join_role:            '账号类型 *',
        join_role_consumer:   '消费者（购买目的）',
        join_role_seller:     '酿酒厂（销售目的）',
        join_email:           '邮箱 *',
        join_email_check:     '验证',
        join_pw:              '密码 *',
        join_name:            '姓名 *',
        join_country:         '国家',
        join_country_ph:      '请选择国家',
        join_phone:           '电话号码',
        join_phone_ph:        '+86-138-0013-8000',
        join_birth:           '出生日期',
        join_lang:            '语言',
        join_btn:             '注册',
        join_has_account:     '已有账号？',
        join_login_link:      '立即登录',
        join_email_ok:        '该邮箱可以使用。',
        join_email_fail:      '该邮箱已被使用。',
        join_email_err:       '出现错误，请重试。',
        join_email_required:  '请先验证邮箱。',
        join_success:         '注册成功！',
        join_fail:            '注册失败，请重试。',

        //商品详情
        detail_back:           '← 返回',
        detail_degree:         '酒精度',
        detail_volume:         '容量',
        detail_weight:         '重量',
        detail_desc:           '说明',
        detail_cart:           '加入购物车',
        detail_buy:            '立即购买',
        detail_login_required: '请先登录。',
        detail_cart_success:   '已加入购物车。',

        //购物车
        cart_title:     '购物车',
        cart_empty:     '购物车为空。',
        cart_product:   '商品名',
        cart_qty:       '数量',
        cart_price:     '价格',
        cart_delete:    '删除',
        cart_total:     (formatted) => `合计: ${formatted}`,
        cart_order_btn: '去结算',

        //订单
        order_title:      '填写收货信息',
        order_receiver:   '收件人姓名',
        order_phone:      '联系电话',
        order_zip:        '邮政编码',
        order_address:    '详细地址',
        order_country:    '配送国家',
        order_country_ph: '请选择配送国家',
        order_memo:       '备注（可选）',
        order_memo_ph:    '请填写配送相关备注',
        order_btn:        '确认订单',
        order_success:    '订单提交成功！',
        order_fail:       '订单提交失败，请重试。',
    },
};
