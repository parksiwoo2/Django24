import { useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [sector, setSector] = useState("");

  const fetchBooks = async (sectorId) => {
    const res = await fetch(
      `http://localhost:8000/api/books/sector/${sectorId}/`
    );
    const data = await res.json();
    setSector(data.sector);
    setBooks(data.books);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 책 추천</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => fetchBooks(1)}>📄 짧게 읽기 좋은 책</button>
        <button onClick={() => fetchBooks(2)}>📚 벽돌책</button>
        <button onClick={() => fetchBooks(3)}>🙂 독서 입문자</button>
        <button onClick={() => fetchBooks(4)}>🤯 어려운 책</button>
        <button onClick={() => fetchBooks(5)}>⭐ 평점 높은 책</button>
      </div>

      <h2>{sector}</h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {books.map((b) => (
          <div
            key={b.id}
            style={{
              width: 160,
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 6,
            }}
          >
            <img
              src={b.cover_image}
              alt={b.title}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
              }}
            />
            <h4>{b.title}</h4>
            <p>⭐ {b.rating}</p>
            <p>{b.pages} pages</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
