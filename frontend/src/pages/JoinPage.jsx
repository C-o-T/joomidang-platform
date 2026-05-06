import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useGeo } from '../context/GeoContext';
import { TARGET_COUNTRIES, AVAILABLE_LANGS } from '../i18n/countries';
import styles from './JoinPage.module.css';

function JoinPage() {
    //번역 객체(t), 감지된 국가(country), 현재 언어(lang)
    const { t, country, lang } = useGeo();

    //회원가입 폼 입력값을 저장할 state 변수
    //role: CONSUMER(소비자) 또는 SELLER(양조장) - 필수 선택
    //country: 접속 국가로 자동 선택, preferredLanguage: 현재 언어로 자동 선택
    const [form, setForm] = useState({
        role: '',
        email: '',
        password: '',
        name: '',
        country: country || '',
        phone: '',
        birthDate: '',
        preferredLanguage: lang || 'en',
    });

    //IP 감지 완료 후 country/lang이 확정되면 폼 자동 채우기 (사용자가 아직 변경 안 했을 때만)
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            country: prev.country || country || '',
            preferredLanguage: prev.preferredLanguage !== 'en' ? prev.preferredLanguage : (lang || 'en'),
        }));
    }, [country, lang]);

    //이메일 중복 확인 결과를 저장할 state 변수 (null: 미확인 | 'ok': 사용가능 | 'fail': 중복)
    const [emailStatus, setEmailStatus] = useState(null);
    //이메일 중복 확인 메시지를 저장할 state 변수
    const [emailMsg, setEmailMsg] = useState('');
    const navigate = useNavigate();

    //입력값이 바뀔 때마다 form state를 업데이트
    //이메일 필드가 바뀌면 중복확인 결과도 초기화
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === 'email') setEmailStatus(null);
    };

    //이메일 중복 확인 - query parameter 방식 (@ 문자가 URL 경로에 들어가면 Tomcat이 차단)
    const checkEmail = async () => {
        if (!form.email) return;
        try {
            const res = await api.get('/users/check-email', { params: { email: form.email } });
            if (res.data) {
                setEmailStatus('ok');
                setEmailMsg(t.join_email_ok);
            } else {
                setEmailStatus('fail');
                setEmailMsg(t.join_email_fail);
            }
        } catch {
            setEmailStatus('fail');
            setEmailMsg(t.join_email_err);
        }
    };

    //회원가입 폼 제출 - 역할 선택 및 이메일 중복확인이 완료된 경우에만 API 호출
    const handleSubmit = async (e) => {
        e.preventDefault();
        //역할을 선택하지 않은 경우 제출 차단
        if (!form.role) {
            alert(t.join_role);
            return;
        }
        //이메일 중복확인을 하지 않은 경우 제출 차단
        if (emailStatus !== 'ok') {
            alert(t.join_email_required);
            return;
        }
        try {
            await api.post('/users', form);
            alert(t.join_success);
            navigate('/login');
        } catch {
            alert(t.join_fail);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.box}>
                <p className={styles.logo}>주미당 <span>酒美堂</span></p>
                <p className={styles.subtitle}>{t.join_subtitle}</p>

                <form onSubmit={handleSubmit}>
                    <p className={styles.section_label}>{t.join_section_basic}</p>

                    {/* 가입 유형 선택 - 소비자 또는 양조장 (필수) */}
                    <label className={styles.label}>{t.join_role}</label>
                    <div className={styles.role_row}>
                        <label className={`${styles.role_card} ${form.role === 'CONSUMER' ? styles.role_active : ''}`}>
                            <input
                                type="radio"
                                name="role"
                                value="CONSUMER"
                                checked={form.role === 'CONSUMER'}
                                onChange={handleChange}
                                className={styles.role_radio}
                            />
                            <span className={styles.role_icon}>🛍️</span>
                            <span className={styles.role_text}>{t.join_role_consumer}</span>
                        </label>
                        <label className={`${styles.role_card} ${form.role === 'SELLER' ? styles.role_active : ''}`}>
                            <input
                                type="radio"
                                name="role"
                                value="SELLER"
                                checked={form.role === 'SELLER'}
                                onChange={handleChange}
                                className={styles.role_radio}
                            />
                            <span className={styles.role_icon}>🍶</span>
                            <span className={styles.role_text}>{t.join_role_seller}</span>
                        </label>
                    </div>

                    <label className={styles.label}>{t.join_email}</label>
                    <div className={styles.email_row}>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            placeholder={t.login_email_ph}
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" className={styles.check_btn} onClick={checkEmail}>
                            {t.join_email_check}
                        </button>
                    </div>
                    {emailMsg && (
                        <p className={emailStatus === 'ok' ? styles.email_ok : styles.email_fail}>
                            {emailMsg}
                        </p>
                    )}

                    <label className={styles.label}>{t.join_pw}</label>
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder={t.login_pw_ph}
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <label className={styles.label}>{t.join_name}</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="name"
                        placeholder={t.join_name.replace(' *', '')}
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <div className={styles.divider} />
                    <p className={styles.section_label}>{t.join_section_extra}</p>

                    <label className={styles.label}>{t.join_country}</label>
                    {/* 역직구 타겟 국가 목록으로 선택지 제공, 감지된 국가 자동 선택 */}
                    <select className={styles.input} name="country" value={form.country} onChange={handleChange}>
                        <option value="">{t.join_country_ph}</option>
                        {TARGET_COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.flag} {c.name[lang] || c.name['en']} ({c.code})
                            </option>
                        ))}
                    </select>

                    <label className={styles.label}>{t.join_phone}</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="phone"
                        placeholder={t.join_phone_ph}
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <label className={styles.label}>{t.join_birth}</label>
                    <input
                        className={styles.input}
                        type="date"
                        name="birthDate"
                        value={form.birthDate}
                        onChange={handleChange}
                    />

                    <label className={styles.label}>{t.join_lang}</label>
                    {/* 현재 감지된 언어로 자동 선택 */}
                    <select className={styles.input} name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange}>
                        {AVAILABLE_LANGS.map(l => (
                            <option key={l.code} value={l.code}>
                                {l.flag} {l.name}
                            </option>
                        ))}
                    </select>

                    <button className={styles.submit_btn} type="submit">{t.join_btn}</button>
                </form>

                <p className={styles.footer}>
                    {t.join_has_account}
                    <Link to="/login">{t.join_login_link}</Link>
                </p>
            </div>
        </div>
    );
}

export default JoinPage;
