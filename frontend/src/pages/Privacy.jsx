export default function Privacy() {
  return (
    <div className="legal-page">
      <h2>Privacy Policy</h2>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h3>1. What we collect</h3>
        <p>
          When you create an account, we collect your name, college email,
          hostel block (optional), and enrollment ID. When you post a listing,
          we store the listing details you provide. We do not collect or store
          payment card information — that's handled entirely by Razorpay.
        </p>
      </section>

      <section>
        <h3>2. How we use it</h3>
        <p>
          Your information is used to run your account, display your listings
          and reviews to other students, process orders, and contact you about
          your activity on CampusCart (e.g. order confirmations).
        </p>
      </section>

      <section>
        <h3>3. Who can see what</h3>
        <p>
          Your name is visible to other students on listings you post and
          reviews you leave. Your email and enrollment ID are not shown
          publicly. Buyers and sellers can see each other's name on completed
          orders.
        </p>
      </section>

      <section>
        <h3>4. Data retention</h3>
        <p>
          We keep your account and listing data as long as your account is
          active. You can request account deletion via the Contact page.
        </p>
      </section>

      <section>
        <h3>5. Third parties</h3>
        <p>
          We use Razorpay to process payments. Their handling of your payment
          data is governed by Razorpay's own privacy policy.
        </p>
      </section>

      <p className="legal-note">
        Questions about your data? Reach out via our{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </div>
  );
}
