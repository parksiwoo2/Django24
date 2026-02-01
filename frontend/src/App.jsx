import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReviewPage from './components/ReviewPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserInfoPage from './components/UserInfoPage';
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

  // --- 내비게이션 바 스타일 ---
  const styles = {
    navWrapper: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eaeaea',
      display: 'flex',
      justifyContent: 'center', // 내비게이션 바 자체를 중앙으로
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    navContainer: {
      width: '100%',
      maxWidth: '720px', // ReviewPage의 maxWidth와 맞춤
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between' // 좌우로 벌림
    },
    logo: {
      fontWeight: '800',
      fontSize: '1.2rem',
      color: '#1a73e8',
      textDecoration: 'none'
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    link: {
      textDecoration: 'none',
      color: '#4b5563',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'color 0.2s'
    },
    logoutBtn: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: '#ef4444', // 로그아웃은 빨간색 계열로 포인트
      fontSize: '0.9rem',
      fontWeight: '600',
      padding: 0
    }
  };

  return (
    <Router>
      {/* 상단 헤더 영역 */}
      <nav style={styles.navWrapper}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.logo}>BookLog</Link>
          
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>홈</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/userInfo" style={styles.link}>내 정보</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.link}>로그인</Link>
                <Link to="/register" style={styles.link}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 페이지 컨텐츠 영역 */}
      <main>
        <Routes>
          <Route path="/" element={<ReviewPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/userInfo" element={<UserInfoPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;