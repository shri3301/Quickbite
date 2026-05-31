import React, { useState } from 'react'
import style from './menu.module.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'

const Menu = () => {
  const [category, setCategory] = useState('All')

  return (
    <div className={style.menuPage}>
      <h1>Our Menu</h1>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  )
}

export default Menu;
