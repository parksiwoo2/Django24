import { useState } from "react";
import SectorList from "./components/SectorList";
import BookList from "./components/BookList";

function App() {
  const [sectorName, setSectorName] = useState("");
  const [books, setBooks] = useState([]);

  // SectorList에서 호출됨
  const handleSectorSelect = (sector, books) => {
    setSectorName(sector);
    setBooks(books);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 도서 추천</h2>

      {/* 섹터 버튼 */}
      <SectorList onSelect={handleSectorSelect} />

      {/* 선택된 섹터명 */}
      {sectorName && <h3>{sectorName}</h3>}

      {/* 도서 리스트 */}
      <BookList books={books} />
    </div>
  );
}

export default App;
