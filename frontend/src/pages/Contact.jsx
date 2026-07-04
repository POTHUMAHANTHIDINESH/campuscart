export default function Contact() {
  return (
    <div className="legal-page">
      <h2>Contact &amp; Support</h2>
      <p>
        Have a question, ran into a bug, or need help with an order? We're
        happy to help.
      </p>

      <div className="contact-cards">
        <div className="contact-card">
          <h4>Email support</h4>
          <p>For account issues, disputes, or general questions.</p>
          <a href="mailto:support@campuscart.example">support@campuscart.example</a>
        </div>

        <div className="contact-card">
          <h4>Report a listing or user</h4>
          <p>Something look off with a listing or another student's behavior?</p>
          <a href="mailto:trust@campuscart.example">trust@campuscart.example</a>
        </div>

        <div className="contact-card">
          <h4>Have feedback instead?</h4>
          <p>Suggestions or feature requests go on our feedback page.</p>
          <a href="/feedback">Send feedback →</a>
        </div>
      </div>

      <p className="legal-note">
        We typically respond within 1–2 business days.
      </p>
    </div>
  );
}
