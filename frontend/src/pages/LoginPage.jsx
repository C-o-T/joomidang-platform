import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useGeo } from '../context/GeoContext';
import styles from './LoginPage.module.css';

function LoginPage() {
    //이메일과 비밀번호를 저장할 state 변수
    const [form, setForm] = useState({ email: '', password: '' });

    //에러 메시지를 저장할 state 변수
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //번역 객체(t), 언어 변경 함수(setLang)
    const { t, setLang } = useGeo();

    //입력값이 바뀔 때마다 form state를 업데이트
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); //입력하면 에러 메시지 초기화
    };

    //로그인 폼 제출 - POST 요청으로 이메일/비밀번호 전송
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', form);
            if (res.data && res.data.id) {
                //로그인 성공 - 사용자 정보를 localStorage에 저장
                localStorage.setItem('user', JSON.stringify(res.data));
                //언어는 IP 감지 기준을 유지 (로그인해도 언어 변경 안 함)
                navigate('/');
            } else {
                setError(t.login_err_invalid);
            }
        } catch (err) {
            //401 Unauthorized: 이메일/비밀번호 불일치
            if (err.response?.status === 401) {
                setError(t.login_err_invalid);
            } else {
                setError(t.login_err_fail);
            }
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.box}>
                <p className={styles.logo}>주미당 <span>酒美堂</span></p>
                <p className={styles.subtitle}>{t.login_subtitle}</p>

                <form onSubmit={handleSubmit}>
                    <label className={styles.label}>{t.login_email}</label>
                    <input
                        className={styles.input}
                        type="email"
                        name="email"
                        placeholder={t.login_email_ph}
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <label className={styles.label}>{t.login_pw}</label>
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder={t.login_pw_ph}
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {/* 에러 메시지 - 로그인 실패 시 표시 */}
                    {error && <p className={styles.error_msg}>{error}</p>}
                    <button className={styles.submit_btn} type="submit">{t.login_btn}</button>
                </form>

                <p className={styles.footer}>
                    {t.login_no_account}
                    <Link to="/join">{t.login_join_link}</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
