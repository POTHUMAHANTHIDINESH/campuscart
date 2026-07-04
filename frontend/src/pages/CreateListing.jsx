import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const CATEGORIES = ["Books", "Notes", "Electronics", "Hostel Items", "Cycles", "Other"];

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/products", { ...form, price: Number(form.price) });
      navigate("/my-listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <h2>Sell an item</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="e.g. Data Structures Textbook (3rd edition)" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Condition, edition, any details buyers should know..." value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required min="0" />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="imageUrl" placeholder="Image URL (optional — paste any image link)" value={form.imageUrl} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Posting..." : "Post listing"}</button>
      </form>
    </div>
  );
}
