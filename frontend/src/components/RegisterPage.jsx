import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', nickname: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다!");
            return;
        }

        try {
            await api.post('register/', {
                username: formData.username,
                password: formData.password,
                nickname: formData.nickname
            });
            alert("회원가입 성공! 로그인 해주세요.");
            navigate('/login');
        } catch (error) {
            alert("이미 존재하는 아이디거나 입력 정보가 잘못되었습니다.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>📝 회원가입</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="아이디" required
                    onChange={(e) => setFormData({...formData, username: e.target.value})} />
                <input type="password" placeholder="비밀번호" required
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <input type="password" placeholder="비밀번호 확인" required
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                <input type="text" placeholder="닉네임" required
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
}

export default RegisterPage;