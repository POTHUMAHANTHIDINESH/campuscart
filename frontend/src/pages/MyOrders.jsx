import { useEffect, useState } from "react";
import api from "../api.js";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p><strong>Order status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.title} — ₹{item.price}</li>
              ))}
            </ul>
            <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
