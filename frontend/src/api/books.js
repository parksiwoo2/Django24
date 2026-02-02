const API_BASE = "http://localhost:8000/api/books";

export async function fetchSectorBooks(sectorId) {
  const res = await fetch(`${API_BASE}/sector/${sectorId}/`);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}
