import { useEffect, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Books", "Notes", "Electronics", "Hostel Items", "Cycles", "Gym", "Other"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  async function loadProducts() {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;
    const res = await api.get("/products", { params });
    setProducts(res.data);
    setLoading(false);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadProducts();
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <h1>Buy and sell campus essentials in one place</h1>
          <p>
            Find books, notes, gadgets, hostel items, and more from fellow students.
            Everything is simple, local, and built for campus life.
          </p>
        </div>
        <div className="hero-card">
          <strong>Fresh listings every day</strong>
          <span>Browse student-made deals, save money, and declutter your room.</span>
        </div>
      </section>

      <section className="search-panel">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            placeholder="Search books, notes, electronics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="category-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={c === category ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <p>Loading listings...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">No listings found. Be the first to post one!</div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
