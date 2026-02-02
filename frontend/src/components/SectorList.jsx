import { fetchSectorBooks } from "../api/books";

const SECTORS = [
  { id: 1, name: "📄 짧게 읽기 좋은 책" },
  { id: 2, name: "📚 벽돌책 도전" },
  { id: 3, name: "🙂 독서 입문자용" },
  { id: 4, name: "🤯 어려운 책부터" },
  { id: 5, name: "⭐ 평점 높은 책" },
];

function SectorList({ onSelect }) {
  const handleClick = async (sector) => {
    const data = await fetchSectorBooks(sector.id);
    onSelect(data.sector, data.books);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {SECTORS.map((s) => (
        <button
          key={s.id}
          onClick={() => handleClick(s)}
          style={{ marginRight: 10 }}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}

export default SectorList;
