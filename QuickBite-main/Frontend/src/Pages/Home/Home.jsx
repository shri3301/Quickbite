import React from 'react'
import style from './home.module.css'
import Header from '../../components/Header/Header'

const Home = () => {
  return (
    <div className={style.a1}>
      <Header />
      <div className={style.homeContent}>
        <h2>Welcome to Foodify</h2>
        <p>Use the menu page to browse food options and the mobile app page to download the app.</p>
      </div>
    </div>
  );
}

export default Home