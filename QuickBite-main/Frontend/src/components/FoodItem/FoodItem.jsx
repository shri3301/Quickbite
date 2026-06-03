import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { assets, food_list as localFoodList } from '../../assets/assets'
import { toast } from 'react-toastify'
import './fooditem.css'

const FoodItem = ({ id, name, price, description, image, category, rating, deliveryTime, isVeg, offer, index }) => {
  const { cartItem, addToCart, removeFromCart, URl, toggleWishlist, isWishlisted, token } = useContext(StoreContext)

  const defaultImage = localFoodList[index % localFoodList.length]?.image
  const imageUrl = image && (image.startsWith('http') || image.startsWith('/'))
    ? image
    : image ? URl + "/images/" + image : defaultImage

  const wishlisted = isWishlisted(id)

  const handleWishlist = (e) => {
    e.stopPropagation()
    if (!token) { toast.info("Please sign in to save to wishlist"); return }
    toggleWishlist(id)
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️")
  }

  const handleAdd = () => {
    addToCart(id)
    toast.success(`${name} added to cart!`, { autoClose: 1500 })
  }

  const stars = Math.round(rating || 4)

  return (
    <div className="food-card">
      {/* Offer Badge */}
      {offer && <div className="food-offer-badge">{offer}</div>}

      {/* Image Section */}
      <div className="food-image-wrap">
        <img
          className="food-img"
          src={imageUrl}
          alt={name}
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }}
          loading="lazy"
        />
        {/* Wishlist Heart */}
        <button className={`wish-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist} aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "#E43B3B" : "none"} stroke={wishlisted ? "#E43B3B" : "white"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Cart Controls */}
        <div className="food-cart-controls">
          {!cartItem[id] ? (
            <button className="food-add-btn" onClick={handleAdd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          ) : (
            <div className="food-counter">
              <button onClick={() => removeFromCart(id)}>−</button>
              <span>{cartItem[id]}</span>
              <button onClick={() => addToCart(id)}>+</button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="food-info">
        {/* Veg/NonVeg + Delivery Time */}
        <div className="food-meta-row">
          <span className={`veg-indicator ${isVeg === false ? 'nonveg' : 'veg'}`}>
            <span></span>
          </span>
          <span className="delivery-time">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {deliveryTime || 30} min
          </span>
        </div>

        {/* Name */}
        <h3 className="food-name">{name}</h3>

        {/* Description */}
        <p className="food-desc">{description}</p>

        {/* Rating + Price Row */}
        <div className="food-bottom-row">
          <div className="food-rating">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FC8019" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{(rating || 4.0).toFixed(1)}</span>
          </div>
          <span className="food-price">₹{price}</span>
        </div>
      </div>
    </div>
  )
}

export default FoodItem