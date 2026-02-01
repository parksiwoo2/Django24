import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function UserInfoPage() {
  const [allBooks, setAllBooks] = useState([]);      // 전체 도서 목록
  const [interestBooks, setInterestBooks] = useState([]); // 찜한 도서 목록
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('interest'); // 'all' 또는 'interest' 전환

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 전체 도서와 찜한 도서를 동시에 가져옵니다.
      // API 엔드포인트는 실제 서버 주소에 맞게 수정이 필요할 수 있습니다.
      const [booksRes, interestRes] = await Promise.all([
        api.get('books/'), // 전체 도서 목록 엔드포인트 가정
        api.get('users/')  // 현재 찜한 목록 엔드포인트
      ]);
      
      setAllBooks(booksRes.data);
      setInterestBooks(interestRes.data);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // 찜하기 추가 또는 삭제 기능
  const toggleInterest = async (bookId, isInterested) => {
    try {
      if (isInterested) {
        // 이미 찜한 상태라면 삭제 (DELETE)
        // 찜 목록의 ID가 아닌 '도서 ID'로 삭제할 경우 백엔드 주소 확인 필요
        await api.delete(`users/${bookId}/`); 
        alert("찜 목록에서 제거되었습니다.");
      } else {
        // 찜하지 않은 상태라면 추가 (POST)
        await api.post('users/', { book: bookId });
        alert("찜 목록에 추가되었습니다.");
      }
      fetchData(); // 목록 새로고침
    } catch (error) {
      alert("요청 처리에 실패했습니다.");
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: "'Pretendard', sans-serif" },
    headerSection: { borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    tabWrapper: { display: 'flex', gap: '10px', marginBottom: '20px' },
    tabBtn: (active) => ({
      padding: '10px 20px', borderRadius: '20px', cursor: 'pointer',
      border: active ? 'none' : '1px solid #ddd',
      backgroundColor: active ? '#3498db' : '#fff',
      color: active ? '#fff' : '#555',
      fontWeight: 'bold'
    }),
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    card: { backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' },
    bookTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px', display: 'block' },
    metaInfo: { fontSize: '0.85rem', color: '#7f8c8d' },
    removeBtn: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem' },
    addBtn: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem' },
    emptyState: { textAlign: 'center', padding: '50px', color: '#95a5a6', backgroundColor: '#f9f9f9', borderRadius: '12px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={{ margin: 0 }}>📌 마이 페이지</h2>
        <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
          찜한 도서 <span style={{ color: '#e74c3c' }}>{interestBooks.length}</span>권
        </div>
      </div>

      {/* 탭 전환 버튼 */}
      <div style={styles.tabWrapper}>
        <button style={styles.tabBtn(viewMode === 'interest')} onClick={() => setViewMode('interest')}>내 찜 목록</button>
        <button style={styles.tabBtn(viewMode === 'all')} onClick={() => setViewMode('all')}>전체 도서 탐색</button>
      </div>

      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <>
          {viewMode === 'interest' ? (
            // --- 찜한 도서 목록 ---
            interestBooks.length > 0 ? (
              <div style={styles.grid}>
                {interestBooks.map((item) => (
                  <div key={item.id} style={styles.card}>
                    {/* 데이터 구조에 따라 item.book_title 혹은 item.book?.title 확인 필요 */}
                    <span style={styles.bookTitle}>📘 {item.book_title || item.title || "제목 정보 없음"}</span>
                    <span style={styles.metaInfo}>저자: {item.author || "알 수 없음"}</span>
                    <button 
                      style={styles.removeBtn} 
                      onClick={() => toggleInterest(item.id, true)}
                    >
                      찜 취소
                    </button>
                    <div style={{ borderTop: '1px dashed #ddd', paddingTop: '10px', marginTop: '10px', fontSize: '0.8rem', color: '#999' }}>
                      추가일: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>아직 찜한 도서가 없습니다.</p>
                <button style={{...styles.tabBtn(true), marginTop: '10px'}} onClick={() => setViewMode('all')}>책 보러가기</button>
              </div>
            )
          ) : (
            // --- 전체 도서 목록 (조회) ---
            <div style={styles.grid}>
              {allBooks.map((book) => {
                const isLiked = interestBooks.some(fav => fav.book_id === book.id);
                return (
                  <div key={book.id} style={styles.card}>
                    <span style={styles.bookTitle}>📖 {book.title}</span>
                    <span style={styles.metaInfo}>저자: {book.author}</span>
                    <button 
                      style={isLiked ? styles.removeBtn : styles.addBtn}
                      onClick={() => toggleInterest(book.id, isLiked)}
                    >
                      {isLiked ? '찜 취소' : '찜하기'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserInfoPage;