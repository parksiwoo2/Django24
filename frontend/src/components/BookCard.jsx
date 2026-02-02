import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BookCard() {
  const { id } = useParams(); // URL의 :id 값을 가져옵니다.
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 상세 데이터를 가져오는 함수
    const fetchBookDetail = async () => {
      try {
        const res = await fetch(`/api/books/${id}/`); // id를 이용해 API 호출
        if (!res.ok) throw new Error("도서를 찾을 수 없습니다.");
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>로딩 중...</div>;
  if (!book) return <div style={{ padding: '50px', textAlign: 'center' }}>책 정보를 찾을 수 없습니다.</div>;

  const styles = {
    container: { maxWidth: '720px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    backBtn: { marginBottom: '20px', border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: '600' },
    content: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
    img: { width: '250px', height: '350px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    info: { flex: 1, minWidth: '300px' },
    title: { fontSize: '2rem', margin: '0 0 10px 0' },
    author: { fontSize: '1.1rem', color: '#666', marginBottom: '20px' },
    stats: { display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' },
    description: { lineHeight: '1.6', color: '#444' }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>← 뒤로 가기</button>
      
      <div style={styles.content}>
        <img src={book.cover_image} alt={book.title} style={styles.img} />
        
        <div style={styles.info}>
          <h2 style={styles.title}>{book.title}</h2>
          <p style={styles.author}>{book.author} 저</p>
          
          <div style={styles.stats}>
            <span>⭐ <b>{book.rating}</b></span>
            <span>📄 <b>{book.pages}</b> 페이지</span>
            <span>📚 <b>{book.category_label}</b></span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '5px' }}>책 소개</h4>
            <p style={styles.description}>
              {book.description || "이 도서에 대한 상세 설명이 아직 등록되지 않았습니다."}
            </p>
          </div>

          <button style={{ 
            width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: '#fff', 
            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' 
          }}>
            이 책으로 서평 쓰기
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;