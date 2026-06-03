import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./placeorder.css";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItem,
    URl,
    discountAmount,
    couponCode,
    applyCoupon,
    setCouponCode,
    setDiscountAmount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [localCoupon, setLocalCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Guard: redirect to cart if not logged in or cart is empty
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    }
    if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    // Build order items from cart
    const orderItems = food_list
      .filter((item) => cartItem[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItem[item._id] }));

    const finalAmount = getTotalCartAmount() + 40 - discountAmount;

    try {
      const response = await axios.post(
        URl + "/api/order/place",
        {
          address: data,
          items: orderItems,
          amount: finalAmount,
          discountCode: couponCode,
          discountAmount,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        const { orderId, razorpayOrderId, amount, currency, key } =
          response.data;

        const options = {
          key,
          amount,
          currency,
          name: "QuickBite",
          description: "Food Order",
          order_id: razorpayOrderId,
          handler: async (razorpayResponse) => {
            try {
              const verifyRes = await axios.post(URl + "/api/order/verify", {
                orderId,
                razorpayOrderId,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
              });
              if (verifyRes.data.success) {
                toast.success("Payment successful! Order placed.");
                navigate("/myorders");
              } else {
                toast.error("Payment verification failed. Please contact support.");
              }
            } catch {
              toast.error("Payment verification error. Please contact support.");
            }
          },
          prefill: {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#FC8019",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(response.data.message || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while placing your order.");
    }
  };

  const handleCouponApply = async () => {
    if (!localCoupon.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const result = await applyCoupon(localCoupon.trim(), getTotalCartAmount());
      if (result && result.success) {
        toast.success("Coupon applied successfully!");
        setCouponCode(localCoupon.trim());
      } else {
        const msg = (result && result.message) || "Invalid or expired coupon.";
        setCouponError(msg);
        toast.error(msg);
        setDiscountAmount(0);
        setCouponCode("");
      }
    } catch {
      const msg = "Failed to apply coupon.";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const subtotal = getTotalCartAmount();
  const delivery = 40;
  const total = subtotal + delivery - discountAmount;

  const cartItems = food_list.filter((item) => cartItem[item._id] > 0);

  return (
    <form className="placeorder-page" onSubmit={placeOrder}>
      {/* ─── LEFT: Delivery Details ─── */}
      <div className="placeorder-left">
        <h2 className="placeorder-title">Delivery Details</h2>

        <div className="two-col">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={data.firstName}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={data.lastName}
              onChange={onChangeHandler}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            value={data.phone}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            name="street"
            placeholder="123 Main Street"
            value={data.street}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="two-col">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Mumbai"
              value={data.city}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Maharashtra"
              value={data.state}
              onChange={onChangeHandler}
              required
            />
          </div>
        </div>

        <div className="two-col">
          <div className="form-group">
            <label>Zipcode</label>
            <input
              type="text"
              name="zipcode"
              placeholder="400001"
              value={data.zipcode}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="India"
              value={data.country}
              onChange={onChangeHandler}
              required
            />
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Order Summary ─── */}
      <div className="placeorder-right">
        <div className="order-summary-card">
          <h2 className="summary-title">Order Summary</h2>

          {/* Cart Items List */}
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <p className="empty-cart-note">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const qty = cartItem[item._id];
                const subtotalItem = item.price * qty;
                return (
                  <div className="summary-item" key={item._id}>
                    <div className="summary-item-info">
                      <img
                        src={URl + "/images/" + item.image}
                        alt={item.name}
                        className="summary-item-img"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div>
                        <p className="summary-item-name">{item.name}</p>
                        <p className="summary-item-qty">Qty: {qty}</p>
                      </div>
                    </div>
                    <span className="summary-item-price">
                      ₹{subtotalItem}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <hr className="summary-divider" />

          {/* Coupon Section */}
          <div className="coupon-section">
            <p className="coupon-label">Have a coupon?</p>
            <div className="coupon-row">
              <input
                type="text"
                className="coupon-input"
                placeholder="Enter coupon code"
                value={localCoupon}
                onChange={(e) => {
                  setLocalCoupon(e.target.value);
                  setCouponError("");
                }}
              />
              <button
                type="button"
                className="coupon-btn"
                onClick={handleCouponApply}
                disabled={couponLoading}
              >
                {couponLoading ? "Applying…" : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="coupon-error">{couponError}</p>
            )}
            {discountAmount > 0 && !couponError && (
              <p className="coupon-success">
                🎉 Coupon <strong>{couponCode}</strong> applied!
              </p>
            )}
          </div>

          <hr className="summary-divider" />

          {/* Totals */}
          <div className="totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="totals-row">
              <span>Delivery Fee</span>
              <span>₹{delivery}</span>
            </div>
            {discountAmount > 0 && (
              <div className="totals-row discount-row">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="totals-row total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button type="submit" className="pay-btn">
            Proceed to Pay ₹{total}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;