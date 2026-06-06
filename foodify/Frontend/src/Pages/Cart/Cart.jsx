import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import "./cart.css";

const Cart = () => {
  const { 
    cartItem, 
    food_list, 
    removeFromCart, 
    addToCart, 
    getTotalCartAmount, 
    URl,
    discountAmount,
    couponCode,
    applyCoupon,
    setCouponCode,
    setDiscountAmount
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [localPromo, setLocalPromo] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const totalAmount = getTotalCartAmount();
  const finalTotal = totalAmount > 0 ? totalAmount + 40 - discountAmount : 0;

  const handleApplyPromo = async () => {
    if (!localPromo.trim()) {
      toast.warning("Please enter a promo code");
      return;
    }
    setPromoLoading(true);
    const result = await applyCoupon(localPromo, totalAmount);
    setPromoLoading(false);
    
    if (result.success) {
      toast.success(`Coupon "${localPromo}" applied! You saved ₹${result.discountAmount}`);
    } else {
      toast.error(result.message || "Invalid coupon code");
    }
  };

  const handleRemovePromo = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setLocalPromo("");
    toast.info("Coupon code removed");
  };

  if (totalAmount === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
          <Link to="/" className="explore-menu-btn btn-primary">Explore Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-content">
          {/* Left Side: Cart Items */}
          <div className="cart-items-section">
            <div className="cart-header-row">
              <span className="col-img">Item</span>
              <span className="col-title">Title</span>
              <span className="col-price">Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-total">Total</span>
              <span className="col-action">Remove</span>
            </div>

            <div className="cart-items-list">
              {food_list.map((item) => {
                const qty = cartItem[item._id];
                if (qty > 0) {
                  return (
                    <div key={item._id} className="cart-item-row">
                      <div className="col-img">
                        <img
                          src={URl + "/images/" + item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.fallback_food || assets.upload_area;
                          }}
                        />
                      </div>
                      <div className="col-title">
                        <p className="item-name">{item.name}</p>
                        <p style={{ display: 'none' }} className="item-category">{item.category}</p>
                      </div>
                      <div className="col-price">₹{item.price}</div>
                      <div className="col-qty">
                        <div className="qty-control">
                          <button onClick={() => removeFromCart(item._id)} className="qty-btn" aria-label="Decrease quantity">-</button>
                          <span className="qty-val">{qty}</span>
                          <button onClick={() => addToCart(item._id)} className="qty-btn" aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                      <div className="col-total">₹{item.price * qty}</div>
                      <div className="col-action">
                        <button className="delete-btn" onClick={() => removeFromCart(item._id)} aria-label="Remove item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Bill Details</h3>
              <div className="summary-row">
                <span>Item Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Partner Fee</span>
                <span>₹40</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row">
                  <span>Coupon Discount ({couponCode})</span>
                  <span className="green-text">-₹{discountAmount}</span>
                </div>
              )}
              <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: '14px 0' }} />
              <div className="summary-row total-row">
                <span>To Pay</span>
                <span>₹{finalTotal}</span>
              </div>
              <button onClick={() => navigate('/placeorder')} className="btn-primary checkout-btn">
                Proceed to Checkout
              </button>
            </div>

            {/* Promo Code section */}
            <div className="promo-card">
              <p>Apply Coupon Code</p>
              {couponCode ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '13px' }}>{couponCode}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Saved ₹{discountAmount} on this order</span>
                  </div>
                  <button onClick={handleRemovePromo} style={{ color: 'var(--error)', fontSize: '13px', fontWeight: 600 }}>Remove</button>
                </div>
              ) : (
                <div className="promo-input-row">
                  <input 
                    type="text" 
                    placeholder="Enter promo code" 
                    value={localPromo} 
                    onChange={(e) => setLocalPromo(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button onClick={handleApplyPromo} className="promo-submit-btn" disabled={promoLoading}>
                    {promoLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
