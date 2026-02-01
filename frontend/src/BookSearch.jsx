import { useEffect, useState } from "react";
import "./App.css";

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

export default function BookSearch() {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [requestForm, setRequestForm] = useState({
    book_title: "",
    author: "",
    translator: "",
    publisher: "",
    reason: "",
  });

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchBooks = async () => {
    const url = category ? `/api/books/?category=${category}` : `/api/books/`;

    const res = await fetch(url);
    const data = await res.json();
    setBooks(data);
  };

  const filteredBooks = books.filter((b) =>
    (b.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRequestSubmit = async () => {
    await fetch("/api/books/requests/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestForm),
    });

    alert("요청이 관리자에게 전달되었습니다!");
    setShowModal(false);
    setRequestForm({
      book_title: "",
      author: "",
      translator: "",
      publisher: "",
      reason: "",
    });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="brandIcon">📘</div>
          <div className="brandTitle">도서 목록</div>
        </div>

        <div className="top-controls">
          <input
            placeholder="책 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <button className="request-btn" onClick={() => setShowModal(true)}>
            + 책 추가 요청
          </button>
        </div>
      </header>

      <div className="grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="card">
            <img src={book.cover_image} alt={book.title} />
            <div className="card-body">
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
              <p className="rating">⭐ {book.rating}</p>
              <span className="tag">{book.category_label}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>📚 책 추가 요청</h2>

            <input
              placeholder="책 제목"
              value={requestForm.book_title}
              onChange={(e) =>
                setRequestForm({ ...requestForm, book_title: e.target.value })
              }
            />
            <input
              placeholder="저자"
              value={requestForm.author}
              onChange={(e) =>
                setRequestForm({ ...requestForm, author: e.target.value })
              }
            />
            <input
              placeholder="번역가"
              value={requestForm.translator}
              onChange={(e) =>
                setRequestForm({ ...requestForm, translator: e.target.value })
              }
            />
            <input
              placeholder="출판사"
              value={requestForm.publisher}
              onChange={(e) =>
                setRequestForm({ ...requestForm, publisher: e.target.value })
              }
            />
            <textarea
              placeholder="요청 이유"
              value={requestForm.reason}
              onChange={(e) =>
                setRequestForm({ ...requestForm, reason: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button onClick={handleRequestSubmit}>요청 보내기</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
