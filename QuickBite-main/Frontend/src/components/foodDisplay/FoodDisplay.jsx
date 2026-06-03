import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import "./fooddisplay.css";

const ShimmerCard = () => (
  <div className="shimmer-food-card">
    <div className="shimmer-img shimmer-card"></div>
    <div className="shimmer-body">
      <div className="shimmer-line shimmer-card" style={{width:'60%', height:'14px'}}></div>
      <div className="shimmer-line shimmer-card" style={{width:'90%', height:'12px'}}></div>
      <div className="shimmer-line shimmer-card" style={{width:'40%', height:'16px'}}></div>
    </div>
  </div>
);

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery } = useContext(StoreContext);
  const [sortBy, setSortBy] = useState("default");

  const filteredItems = food_list
    .filter((item) => {
      const matchesCategory = category === "All" || category === item.category;
      const q = searchQuery?.trim().toLowerCase() || "";
      const matchesSearch = q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 4) - (a.rating || 4);
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "delivery") return (a.deliveryTime || 30) - (b.deliveryTime || 30);
      return 0;
    });

  return (
    <div className="food-display" id="fooddisplay">
      <div className="food-display-header">
        <h2>Top Dishes Near You</h2>
        <div className="sort-controls">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
            <option value="default">Sort By</option>
            <option value="rating">⭐ Rating</option>
            <option value="delivery">⚡ Fastest Delivery</option>
            <option value="price_asc">₹ Price: Low to High</option>
            <option value="price_desc">₹ Price: High to Low</option>
          </select>
        </div>
      </div>

      {food_list.length === 0 ? (
        <div className="food-display-grid">
          {[...Array(8)].map((_, i) => <ShimmerCard key={i} />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="no-results">
          <p>🍽️ No dishes found matching your search.</p>
          <span>Try searching something else or changing the category.</span>
        </div>
      ) : (
        <div className="food-display-grid">
          {filteredItems.map((item, index) => (
            <FoodItem
              key={item._id}
              index={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
              rating={item.rating}
              deliveryTime={item.deliveryTime}
              isVeg={item.isVeg}
              offer={item.offer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
