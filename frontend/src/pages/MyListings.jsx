import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);
    const res = await api.get("/products/mine/all");
    setProducts(res.data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this listing?")) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-listings-page">
      <h2>My Listings</h2>
      <Link to="/create-listing" className="add-new-link">+ Post a new listing</Link>

      {products.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        <table className="listings-table">
          <thead>
            <tr><th>Title</th><th>Price</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><Link to={`/product/${p._id}`}>{p.title}</Link></td>
                <td>₹{p.price}</td>
                <td>{p.status}</td>
                <td><button onClick={() => handleDelete(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
