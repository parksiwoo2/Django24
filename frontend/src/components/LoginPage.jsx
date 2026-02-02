import React, { useState } from 'react';
import api from '../api/axios'; // 이전에 만든 axios 설정 파일
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('login/', { username, password });
            localStorage.setItem('userToken', response.data.token);
            
            alert("로그인 성공!");
            navigate('/'); // 로그인 성공 시 메인 페이지('/')로 이동!
        } catch (error) {
            alert("실패!");
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto' }}>
            <h2>🔑 로그인</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" placeholder="아이디" 
                    onChange={(e) => setUsername(e.target.value)} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                />
                <input 
                    type="password" placeholder="비밀번호" 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                />
                <button type="submit" style={{ width: '100%' }}>로그인</button>
            </form>
        </div>
    );
}

export default LoginPage;