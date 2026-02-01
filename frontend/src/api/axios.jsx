import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // 장고 API의 기본 주소
    timeout: 5000, // 5초 안에 응답 없으면 중단
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default instance;