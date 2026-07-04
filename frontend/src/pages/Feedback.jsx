import { useState } from "react";

export default function Feedback() {
  const [form, setForm] = useState({ message: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // NOTE: There's no backend endpoint for feedback yet, so this just
    // confirms locally. To actually collect feedback, wire this up to a
    // POST /api/feedback route (and a Feedback model) on the backend.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="legal-page">
        <h2>Thanks for the feedback!</h2>
        <p>We read every message and use it to improve CampusCart.</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <h2>Send feedback</h2>
      <p>Tell us what's working, what's not, or what you'd like to see next.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          name="message"
          placeholder="Your feedback..."
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
        />
        <input
          name="email"
          type="email"
          placeholder="Your email (optional, if you'd like a reply)"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">Send feedback</button>
      </form>
    </div>
  );
}
