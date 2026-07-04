export default function Terms() {
  return (
    <div className="legal-page">
      <h2>Terms &amp; Conditions</h2>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h3>1. About CampusCart</h3>
        <p>
          CampusCart is a peer-to-peer marketplace that lets students list, browse,
          and buy secondhand items from other students on campus. We provide the
          platform only — every listing, transaction, and item exchange happens
          directly between buyers and sellers.
        </p>
      </section>

      <section>
        <h3>2. Accounts</h3>
        <p>
          You must provide accurate information when creating an account. You're
          responsible for keeping your login credentials secure and for all
          activity that happens under your account.
        </p>
      </section>

      <section>
        <h3>3. Listings</h3>
        <p>
          Sellers are responsible for accurately describing the condition, price,
          and details of items they list. Prohibited items include anything
          illegal, unsafe, counterfeit, or restricted from sale to students.
          CampusCart may remove any listing that violates these terms.
        </p>
      </section>

      <section>
        <h3>4. Payments</h3>
        <p>
          Payments are processed through Razorpay. CampusCart does not store your
          card details. Buyers and sellers are responsible for resolving disputes
          about item condition or delivery directly with each other; CampusCart
          does not guarantee refunds for peer-to-peer transactions.
        </p>
      </section>

      <section>
        <h3>5. Meeting in person</h3>
        <p>
          Item handoffs happen directly between students. We recommend meeting in
          public, well-lit campus locations and inspecting items before completing
          payment. CampusCart is not responsible for incidents that occur during
          an in-person exchange.
        </p>
      </section>

      <section>
        <h3>6. Reviews</h3>
        <p>
          Reviews must reflect genuine experiences with a seller. Fake, abusive,
          or harassing reviews may be removed, and repeat offenders may lose
          account access.
        </p>
      </section>

      <section>
        <h3>7. Changes to these terms</h3>
        <p>
          We may update these terms from time to time. Continued use of
          CampusCart after changes means you accept the updated terms.
        </p>
      </section>

      <p className="legal-note">
        Questions about these terms? Reach out via our{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </div>
  );
}
