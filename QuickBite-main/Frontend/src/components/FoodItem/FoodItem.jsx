import React, { useContext } from 'react'
import style from './fooditem.module.css'
import { assets, fallback_food, food_list as localFoodList } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image,category,index}) => {

    const {cartItem,addToCart,removeFromCart,URl} = useContext(StoreContext)

    const defaultImage = localFoodList[index % localFoodList.length]?.image || fallback_food
    const imageUrl = image && (image.startsWith('http') || image.startsWith('/')) ? image : (image ? URl + "/images/" + image : defaultImage)

  return (
    <div className={style.FoodItem}>
        <div className={style.FoodItemImageContainer}>
            <img
                className={style.FoodItemImage}
                src={imageUrl}
                alt={name}
                onError={(e)=>{ e.target.onerror = null; e.target.src = defaultImage }}
            />
            {
                !cartItem[id]
                ?<img className={style.add} onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="Add to cart" />
                :<div className={style.FoodItemCount}>
                    <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)}  alt="Remove" />
                    <p>{cartItem[id]}</p>
                    <img src={assets.add_icon_green} onClick={()=>addToCart(id)}  alt="Add" />
                </div>
            }
        </div>
        <div className={style.FoodItemInfo}>
            <div className={style.FoodItemName}> 
                <p>{name}</p>
                <img src={assets.rating_starts} alt="Rating" />
            </div>
            <p className={style.FoodItemDescription}>
                {description}
            </p>
            <p className={style.FoodItemPrice}>${price}</p>
        </div>
    </div>
  )
}

export default FoodItem