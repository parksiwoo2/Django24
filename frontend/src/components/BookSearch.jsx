import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';

const CATEGORY_OPTIONS = [
  { value: "", label: "전체" },
  { value: "fairy_tale", label: "동화" },
  { value: "thriller", label: "스릴러" },
  { value: "mystery", label: "미스터리" },
  { value: "romance", label: "로맨스" },
  { value: "fantasy", label: "판타지" },
  { value: "it", label: "IT" },
  { value: "self_dev", label: "자기계발" },
];

function BookSearch() {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const [requestForm, setRequestForm] = useState({
    book_title: "",
    author: "",
    translator: "",
    publisher: "",
    reason: "",
  });

  useEffect(() => {
    fetchBooks();
  }, [category]);

  const fetchBooks = async () => {
    const url = category ? `/api/books/?category=${category}` : `/api/books/`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("도서 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const filteredBooks = books.filter((b) =>
    (b.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRequestSubmit = async () => {
    await fetch("/api/books/requests/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestForm),
    });

    alert("요청이 관리자에게 전달되었습니다!");
    setShowModal(false);
    setRequestForm({ book_title: "", author: "", translator: "", publisher: "", reason: "" });
  };

  // --- 인라인 스타일 정의 ---
  const styles = {
    container: { maxWidth: '720px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    brand: { display: 'flex', alignItems: 'center', gap: '8px' },
    brandTitle: { fontSize: '1.4rem', fontWeight: 'bold', color: '#333' },
    controls: { display: 'flex', gap: '10px', marginBottom: '20px' },
    input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' },
    select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' },
    requestBtn: { padding: '10px 15px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s' },
    cardImg: { width: '100%', height: '220px', objectFit: 'cover', backgroundColor: '#f0f0f0' },
    cardBody: { padding: '12px', textAlign: 'left' },
    cardTitle: { margin: '0 0 5px 0', fontSize: '1rem', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    cardAuthor: { margin: 0, fontSize: '0.85rem', color: '#666' },
    tag: { display: 'inline-block', marginTop: '8px', padding: '2px 8px', backgroundColor: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' },
    // 모달 스타일
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
    modal: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
    modalInput: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
    modalFooter: { display: 'flex', gap: '10px', marginTop: '15px' },
    submitBtn: { flex: 2, padding: '12px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f3f4', color: '#3c4043', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    card: { 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
      transition: 'transform 0.2s',
      cursor: 'pointer' // 2. 클릭 가능함을 알리는 커서 추가
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={{ fontSize: '1.5rem' }}>📘</span>
          <div style={styles.brandTitle}>도서 목록</div>
        </div>
        <button style={styles.requestBtn} onClick={() => setShowModal(true)}>
          + 책 추가 요청
        </button>
      </header>

      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="어떤 책을 찾으시나요?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div style={styles.grid}>
        {filteredBooks.map((book) => (
          <div key={book.id} style={styles.card} onClick={() => navigate(`/book/${book.id}`)}>
            <img src={book.cover_image || "https://via.placeholder.com/150x220?text=No+Image"} alt={book.title} style={styles.cardImg} />
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{book.title}</h3>
              <p style={styles.cardAuthor}>{book.author}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.85rem' }}>⭐ {book.rating || "0.0"}</span>
                <span style={styles.tag}>{book.category_label || "미분류"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>📚 책 추가 요청</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>찾으시는 책이 없나요? 관리자에게 추가를 요청하세요.</p>
            
            <input
              style={styles.modalInput}
              placeholder="책 제목 (필수)"
              value={requestForm.book_title}
              onChange={(e) => setRequestForm({ ...requestForm, book_title: e.target.value })}
            />
            <input
              style={styles.modalInput}
              placeholder="저자"
              value={requestForm.author}
              onChange={(e) => setRequestForm({ ...requestForm, author: e.target.value })}
            />
            <textarea
              style={{ ...styles.modalInput, minHeight: '80px', resize: 'none' }}
              placeholder="요청 사유를 적어주세요"
              value={requestForm.reason}
              onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
            />

            <div style={styles.modalFooter}>
              <button style={styles.submitBtn} onClick={handleRequestSubmit}>요청 보내기</button>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSearch;