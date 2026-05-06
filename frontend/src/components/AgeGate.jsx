import { useState } from 'react';
import styles from './AgeGate.module.css';

// 국가별 법적 음주 가능 연령
const LEGAL_AGE = { KR: 19, JP: 20, US: 21 };
const DEFAULT_AGE = 18;

function AgeGate({ country, onVerify }) {
    const [denied, setDenied] = useState(false);
    const age = LEGAL_AGE[country] || DEFAULT_AGE;

    if (denied) {
        return (
            <div className={styles.overlay}>
                <div className={styles.card}>
                    <div className={styles.logo}>主</div>
                    <h2 className={styles.title}>Sorry</h2>
                    <p className={styles.msg}>
                        You must be of legal drinking age to visit this site.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.logo}>主</div>
                <p className={styles.brand}>JOOMIDANG</p>
                <h2 className={styles.title}>Welcome</h2>
                <p className={styles.msg}>
                    This website contains alcohol products.<br />
                    You must be <strong>{age}+</strong> years of age to enter.
                </p>
                <div className={styles.btn_row}>
                    <button className={styles.enter_btn} onClick={onVerify}>
                        Yes, I am {age} or older
                    </button>
                    <button className={styles.exit_btn} onClick={() => setDenied(true)}>
                        No, I am under {age}
                    </button>
                </div>
                <p className={styles.note}>
                    By entering, you confirm you are of legal drinking age in your country.
                </p>
            </div>
        </div>
    );
}

export default AgeGate;
