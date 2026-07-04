import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">CampusCart</Link>
      <div className="nav-links">
        <Link to="/">Browse</Link>
        <Link to="/cart">Cart{items.length > 0 ? ` (${items.length})` : ""}</Link>
        {user ? (
          <>
            <Link to="/create-listing">Sell an item</Link>
            <Link to="/my-listings">My Listings</Link>
            <Link to="/my-orders">My Orders</Link>
            <span className="user-name">Hi, {user.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
