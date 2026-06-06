import { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FoodItem from "../../components/FoodItem/FoodItem";
import "./wishlist.css";

const Wishlist = () => {
  const { food_list, wishlist, token, fetchWishlist, toggleWishlist } =
    useContext(StoreContext);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const wishlistedItems = food_list.filter(
    (item) =>
      wishlist.includes(item._id) ||
      wishlist.some(
        (w) => w === item._id || w?.toString() === item._id?.toString()
      )
  );

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1>Saved Items ❤️</h1>
          <p className="subtitle">
            {wishlistedItems.length} item{wishlistedItems.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {!token ? (
          <div className="empty-state">
            <svg
              className="empty-icon"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 54S8 38 8 22a12 12 0 0 1 24 0 12 12 0 0 1 24 0c0 16-24 32-24 32z"
                stroke="#FC8019"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#FFF0E6"
              />
            </svg>
            <h3>Sign in to view your wishlist</h3>
            <p>Save your favourite dishes and find them here anytime.</p>
            <Link to="/cart" className="btn-primary">
              Sign In
            </Link>
          </div>
        ) : wishlistedItems.length === 0 ? (
          <div className="empty-state">
            <svg
              className="empty-icon"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 54S8 38 8 22a12 12 0 0 1 24 0 12 12 0 0 1 24 0c0 16-24 32-24 32z"
                stroke="#FC8019"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#FFF0E6"
              />
            </svg>
            <h3>Nothing saved yet</h3>
            <p>Tap the ❤️ on any dish to save it here for later.</p>
            <Link to="/menu" className="btn-primary">
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="food-grid">
            {wishlistedItems.map((item, index) => (
              <FoodItem
                key={item._id}
                {...item}
                id={item._id}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
