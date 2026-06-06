import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./myorders.css";

const STEPS = [
  "Order Placed",
  "Food is Getting Ready!",
  "Out for Delivery",
  "Delivered",
];

const MyOrders = () => {
  const { URl, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.post(
        URl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setOrders(res.data.data);
    } catch (err) {
      toast.error("Could not load orders.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const shortId = (id) => (id ? id.slice(-8).toUpperCase() : "—");

  return (
    <div className="myorders-page">
      <div className="container">
        <div className="orders-page-header">
          <h1>My Orders</h1>
          <button className="refresh-btn" onClick={fetchOrders} title="Refresh">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
            >
              <path
                d="M17 10A7 7 0 1 1 3.5 5.5M3 3v3h3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="72"
              height="72"
            >
              <rect
                x="10"
                y="14"
                width="44"
                height="36"
                rx="4"
                stroke="#FC8019"
                strokeWidth="2.5"
                fill="#FFF0E6"
              />
              <path
                d="M20 26h24M20 34h16"
                stroke="#FC8019"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you place an order.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStep = Math.max(
                0,
                STEPS.indexOf(order.status)
              );

              return (
                <div className="order-card" key={order._id}>
                  <div className="order-header">
                    <div className="order-meta">
                      <span className="order-date">
                        🗓 {formatDate(order.date || order.createdAt)}
                      </span>
                      <span className="order-id">#{shortId(order._id)}</span>
                    </div>
                    <span
                      className={`payment-badge ${
                        order.payment ? "badge-paid" : "badge-pending"
                      }`}
                    >
                      {order.payment ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>

                  <div className="items-list">
                    {order.items &&
                      order.items.map((item, idx) => (
                        <span key={idx} className="item-chip">
                          {item.name} × {item.quantity}
                          {idx < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </div>

                  <div className="order-amount">
                    <span className="amount-label">Order Total</span>
                    <span className="amount-value">₹{order.amount}</span>
                  </div>

                  {/* Status Tracker */}
                  <div className="status-track">
                    {STEPS.map((step, index) => (
                      <div key={index} className="step-wrapper">
                        <div
                          className={`step ${index <= currentStep ? "done" : ""}`}
                        >
                          <div className="step-dot" />
                          <span className="step-label">{step}</span>
                        </div>
                        {index < STEPS.length - 1 && (
                          <div
                            className={`step-line ${
                              index < currentStep ? "line-done" : ""
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
