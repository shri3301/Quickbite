import React, { useState } from 'react'
import style from './menu.module.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'

const Menu = () => {
  const [category, setCategory] = useState('All')
  const [searchText, setSearchText] = useState('')

  return (
    <div className={style.menuPage}>
      <h1>Our Menu</h1>
      <div className={style.menuSearch}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search menu items..."
        />
      </div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} searchText={searchText} />
    </div>
  )
}

export default Menu;
