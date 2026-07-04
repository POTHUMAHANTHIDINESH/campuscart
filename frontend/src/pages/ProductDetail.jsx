import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import ReviewList from "../components/ReviewList.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const alreadyInCart = items.some((i) => i._id === product._id);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
  }

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} />
        ) : (
          <div className="no-image">No image</div>
        )}
      </div>

      <div className="product-detail-info">
        <h1>{product.title}</h1>
        <p className="price">₹{product.price}</p>
        <span className="category-tag">{product.category}</span>
        <p className="description">{product.description || "No description provided."}</p>
        <p>Sold by: <strong>{product.seller?.name}</strong></p>

        {product.status === "sold" ? (
          <p className="sold-badge">This item has been sold.</p>
        ) : alreadyInCart || added ? (
          <p>✅ In your cart. <Link to="/cart">View cart</Link></p>
        ) : (
          <button onClick={handleAddToCart}>Add to Cart</button>
        )}
      </div>

      <ReviewList sellerId={product.seller?._id} productId={product._id} />
    </div>
  );
}
