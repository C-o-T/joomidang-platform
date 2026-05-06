import axios from 'axios';

//axios 기본 설정 - 백엔드 주소를 한 곳에서 관리
//baseURL을 여기서 설정하면 나중에 서버 주소가 바뀌어도 이 파일만 수정하면 됨
const api = axios.create({
    baseURL: 'http://localhost:8080', //백엔드 서버 주소
    headers: {
        'Content-Type': 'application/json', //JSON 형식으로 데이터를 주고받음
    },
});

//응답 인터셉터 - 401(미인증) 응답 시 로그인 페이지로 자동 이동
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            //세션 만료 또는 미인증 → localStorage 초기화 후 로그인 페이지로 이동
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
