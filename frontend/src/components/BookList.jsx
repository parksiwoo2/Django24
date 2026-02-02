import BookCard from "./BookCard";

function BookList({ books }) {
  if (!books.length) {
    return <p>섹터를 선택하세요</p>;
  }

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;
