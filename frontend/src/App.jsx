import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 기존 컴포넌트들
import ReviewPage from './components/ReviewPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserInfoPage from './components/UserInfoPage';

// 도서 추천 관련 컴포넌트들
import SectorList from "./components/SectorList";
import BookList from "./components/BookList";
import BookSearch from './components/BookSearch';
import BookCard from './components/BookCard';

// --- 별도의 추천 페이지 컴포넌트로 분리 ---
function RecommendPage() {
  const [sectorName, setSectorName] = useState("");
  const [books, setBooks] = useState([]);

  const handleSectorSelect = (sector, books) => {
    setSectorName(sector);
    setBooks(books);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '720px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a73e8' }}>📚 도서 추천 섹터</h2>
      <p style={{ color: '#666' }}>원하는 분야를 선택하여 추천 도서를 확인해보세요.</p>
      
      {/* 섹터 버튼 리스트 */}
      <SectorList onSelect={handleSectorSelect} />

      {/* 선택된 섹터명 및 도서 리스트 */}
      {sectorName && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ borderLeft: '4px solid #1a73e8', paddingLeft: '10px' }}>{sectorName}</h3>
          <BookList books={books} />
        </div>
      )}
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    }
  };

  // --- 스타일 정의 (첫 번째 코드 스타일 유지) ---
  const styles = {
    navWrapper: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eaeaea',
      display: 'flex',
      justifyContent: 'center',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    navContainer: {
      width: '100%',
      maxWidth: '720px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: { fontWeight: '800', fontSize: '1.2rem', color: '#1a73e8', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
    link: { textDecoration: 'none', color: '#4b5563', fontSize: '0.9rem', fontWeight: '600' },
    logoutBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', fontWeight: '600' }
  };

  return (
    <Router>
      {/* 상단 내비게이션 바 */}
      <nav style={styles.navWrapper}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.logo}>BookLog</Link>
          
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>홈</Link>
            {/* 도서 추천 링크 추가 */}
            <Link to="/review" style={styles.link}>리뷰</Link>
            <Link to="/recommend" style={styles.link}>도서 추천</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/userInfo" style={styles.link}>내 정보</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>로그아웃</button>
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
      <main style={{ backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 60px)', paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={<BookSearch />} />
          <Route path="/book/:id" element={<BookCard />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/userInfo" element={<UserInfoPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;