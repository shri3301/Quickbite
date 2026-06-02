import React, { useContext } from "react";
import style from "./fooddisplay.module.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, searchText }) => {
  const { food_list } = useContext(StoreContext);

  const filteredItems = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch =
      searchText.trim() === "" ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className={style.FoodDisplay} id="fooddisplay">
      <h2>Top dishes Near You</h2>
      <div className={style.FoodDisplayList}>
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
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
