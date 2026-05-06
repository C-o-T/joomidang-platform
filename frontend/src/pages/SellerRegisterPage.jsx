import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './SellerRegisterPage.module.css';

const EMPTY_FORM = {
    breweryName: '', representativeName: '', businessNumber: '',
    licenseNumber: '', address: '', contactPhone: '', contactEmail: '',
};

function Field({ label, name, value, onChange, type = 'text', required, placeholder, hint }) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}{required && <span className={styles.req}>*</span>}</label>
            {hint && <p className={styles.hint}>{hint}</p>}
            <input
                className={styles.input}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || ''}
                required={required}
            />
        </div>
    );
}

function SellerRegisterPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const [form, setForm] = useState({ ...EMPTY_FORM, contactEmail: user?.email || '' });
    const [bnStatus, setBnStatus] = useState(null); // null | 'ok' | 'dup' | 'checking'
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        api.get(`/sellers/user/${user.id}`)
            .then(() => navigate('/seller/dashboard'))
            .catch(() => {}); // 404 = 정상 (아직 미등록)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        if (e.target.name === 'businessNumber') setBnStatus(null);
        setError('');
    };

    const checkBN = async () => {
        if (!form.businessNumber.trim()) return;
        setBnStatus('checking');
        try {
            const res = await api.get(`/sellers/check-business-number/${form.businessNumber.trim()}`);
            setBnStatus(res.data ? 'ok' : 'dup');
        } catch {
            setBnStatus(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (bnStatus === 'dup') return;
        setSubmitting(true);
        try {
            await api.post('/sellers', { ...form, userId: user.id });
            navigate('/seller/dashboard');
        } catch {
            setError('등록 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.box}>
                <h1 className={styles.title}>판매자 등록 신청</h1>
                <p className={styles.sub}>심사 완료(1~3 영업일) 후 상품을 등록하실 수 있습니다.</p>

                <form onSubmit={handleSubmit}>
                    <Field label="양조장명" name="breweryName" value={form.breweryName}
                        onChange={handleChange} required placeholder="예: 문배주양조원" />
                    <Field label="대표자명" name="representativeName" value={form.representativeName}
                        onChange={handleChange} required placeholder="예: 홍길동"
                        hint="수출신고서에 기재되는 대표자명입니다." />

                    <div className={styles.field}>
                        <label className={styles.label}>사업자등록번호<span className={styles.req}>*</span></label>
                        <div className={styles.bn_row}>
                            <input className={`${styles.input} ${styles.bn_input}`}
                                type="text" name="businessNumber"
                                value={form.businessNumber}
                                onChange={handleChange}
                                placeholder="000-00-00000"
                                required />
                            <button type="button" className={styles.check_btn} onClick={checkBN}>
                                중복 확인
                            </button>
                        </div>
                        {bnStatus === 'ok'       && <p className={styles.bn_ok}>사용 가능한 사업자등록번호입니다.</p>}
                        {bnStatus === 'dup'      && <p className={styles.bn_err}>이미 등록된 사업자등록번호입니다.</p>}
                        {bnStatus === 'checking' && <p className={styles.bn_chk}>확인 중...</p>}
                    </div>

                    <Field label="주류 제조면허 번호" name="licenseNumber" value={form.licenseNumber}
                        onChange={handleChange} placeholder="선택 입력 (면허번호)"
                        hint="수출 통관 시 필요합니다. 나중에 추가 가능합니다." />
                    <Field label="양조장 주소" name="address" value={form.address}
                        onChange={handleChange} required placeholder="예: 서울특별시 종로구 청운동 123" />
                    <Field label="담당자 전화번호" name="contactPhone" value={form.contactPhone}
                        onChange={handleChange} required placeholder="예: 010-1234-5678" />
                    <Field label="담당자 이메일" name="contactEmail" value={form.contactEmail}
                        onChange={handleChange} type="email" required placeholder="예: info@brewery.co.kr" />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.submit_btn} disabled={submitting || bnStatus === 'dup'}>
                        {submitting ? '신청 중...' : '판매자 등록 신청하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SellerRegisterPage;
