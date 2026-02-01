import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookSearch from "./BookSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookSearch />} />
        <Route path="/books" element={<BookSearch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
