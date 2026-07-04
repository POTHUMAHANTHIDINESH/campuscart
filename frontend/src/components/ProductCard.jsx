import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} />
        ) : (
          <div className="no-image">No image</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.title}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          <span className="category-tag">{product.category}</span>
        </div>
        {product.seller?.name && (
          <div className="product-footer">Sold by {product.seller.name}</div>
        )}
      </div>
    </Link>
  );
}
