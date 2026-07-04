import { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ReviewList({ sellerId, productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null); // { canReview, purchased, alreadyReviewed }
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sellerId) return;
    loadReviews();
  }, [sellerId]);

  useEffect(() => {
    if (!user || !productId) {
      setEligibility(null);
      return;
    }
    api
      .get(`/reviews/eligibility/${productId}`)
      .then((res) => setEligibility(res.data))
      .catch(() => setEligibility(null));
  }, [user, productId]);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/seller/${sellerId}`);
      setReviews(res.data.reviews);
      setAverage(res.data.average);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/reviews", {
        sellerId,
        productId,
        rating: Number(form.rating),
        comment: form.comment,
      });
      setForm({ rating: 5, comment: "" });
      await loadReviews();
      setEligibility((prev) => ({ ...prev, canReview: false, alreadyReviewed: true }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post review.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!sellerId) return null;

  return (
    <div className="reviews-section">
      <h3>
        Seller reviews
        {average && ` — ${average}★ (${reviews.length})`}
      </h3>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet for this seller.</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="review-item">
            <strong>{r.reviewer?.name || "Anonymous"}</strong> — {r.rating}★
            {r.comment && <p>{r.comment}</p>}
          </div>
        ))
      )}

      {/* Reviews are only allowed after a paid purchase of this exact item —
          enforced server-side too, this just controls what the UI shows. */}
      {user && eligibility?.canReview && (
        <form className="review-form" onSubmit={handleSubmit}>
          <p className="review-form-hint">You bought this item — let others know how it went.</p>
          <select name="rating" value={form.rating} onChange={handleChange}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
            ))}
          </select>
          <textarea
            name="comment"
            placeholder="Share your experience with this seller..."
            value={form.comment}
            onChange={handleChange}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post review"}
          </button>
        </form>
      )}

      {user && eligibility?.alreadyReviewed && (
        <p className="review-form-hint">You've already reviewed this purchase. Thanks!</p>
      )}

      {user && eligibility && !eligibility.purchased && (
        <p className="review-form-hint">Buy this item to leave a review once you've received it.</p>
      )}
    </div>
  );
}
