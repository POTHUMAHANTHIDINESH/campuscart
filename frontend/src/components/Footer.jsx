import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <span className="footer-brand-name">CampusCart</span>
          <p>Buy and sell campus essentials — books, notes, gadgets, and more — with fellow students.</p>
          <p className="footer-credit">Built for students at NIT Srinagar</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Browse listings</Link>
          <Link to="/create-listing">Sell an item</Link>
          <Link to="/my-orders">My orders</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/contact">Contact / Support</Link>
          <Link to="/feedback">Send feedback</Link>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        <div className="footer-col footer-safety">
          <h4>Stay safe</h4>
          <ul>
            <li>Meet buyers/sellers in public campus spots</li>
            <li>Inspect items before paying</li>
            <li>Never share your password with anyone</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} CampusCart. All rights reserved.</span>
      </div>
    </footer>
  );
}
