import React from 'react'
import style from './about.module.css'

const About = () => {
  return (
    <div className={style.aboutPage}>
      <h1>About QuickBite</h1>
      <p>QuickBite is your local food ordering app built to make ordering fast and easy.</p>
      <p>Browse our menu, place an order, and enjoy fresh meals delivered to your door.</p>
    </div>
  )
}

export default About;
