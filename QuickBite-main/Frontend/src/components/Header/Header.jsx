import React from 'react'
import { Link } from 'react-router-dom'
import style from './header.module.css'

const Header = () => {
  return (
    <div className={style.header}>
        <div className={style.headerContent}>
            <h2>Order your faourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes Lorem ipsum dolor sit amet. Lorem ipsum dolor sit.</p>
            <Link to="/menu"><button>View Menu</button></Link>
        </div>
    </div>
  )
}

export default Header