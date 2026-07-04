import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setError("");
    setProcessing(true);
    try {
      const cartPayload = items.map((i) => ({
        productId: i._id,
        title: i.title,
        price: i.price,
      }));
      const { data } = await api.post("/orders/create-payment", { items: cartPayload });

      // No real Razorpay keys configured — run the simulated local flow
      // instead of opening a popup that would fail with an invalid key.
      // This requires an explicit confirm call; nothing gets marked paid
      // just because create-payment ran.
      if (data.localMode) {
        await api.post("/orders/complete-local-payment", { orderId: data.orderId });
        clearCart();
        navigate("/my-orders");
        return;
      }

      // Real Razorpay flow
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "CampusCart",
        description: "Purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/orders/verify-payment", {
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate("/my-orders");
          } catch (err) {
            setError("Payment succeeded but verification failed. Please contact support.");
          }
        },
        modal: {
          // Runs if the person closes the popup without paying — otherwise
          // the "Starting payment..." button would stay stuck forever.
          ondismiss: function () {
            setProcessing(false);
          },
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);

      // Fires on a genuinely declined/failed payment (e.g. a test card
      // built to simulate failure). Without this, a failed payment would
      // leave the UI stuck with no feedback — the order itself is safe
      // either way since it only becomes "paid" via verify-payment above.
      rzp.on("payment.failed", function () {
        setError("Payment failed or was declined. Your order was not charged — please try again.");
        setProcessing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start payment.");
      setProcessing(false);
    }
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {items.map((item) => (
        <div key={item._id} className="cart-item">
          <span>{item.title}</span>
          <span>₹{item.price}</span>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total: ₹{total}</strong>
      </div>
      <p className="test-mode-note">
        This uses Razorpay's <strong>test mode</strong> — use card number
        4111 1111 1111 1111, any future expiry, any CVV to simulate a payment.
      </p>
      {error && <p className="error">{error}</p>}
      <button onClick={handlePay} disabled={processing}>
        {processing ? "Starting payment..." : `Pay ₹${total}`}
      </button>
    </div>
  );
}