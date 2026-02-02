function BookCard({ book }) {
    return (
      <div
        style={{
          width: 160,
          border: "1px solid #ddd",
          padding: 10,
          borderRadius: 6,
        }}
      >
        <img
          src={book.cover_image}
          alt={book.title}
          style={{ width: "100%", height: 220, objectFit: "cover" }}
        />
        <h4>{book.title}</h4>
        <p>⭐ {book.rating}</p>
        <p>{book.pages} pages</p>
      </div>
    );
  }
  
  export default BookCard;
  