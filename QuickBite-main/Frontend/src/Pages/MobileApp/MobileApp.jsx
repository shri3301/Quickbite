import React from 'react'
import style from './mobileapp.module.css'
import AppDownload from '../../components/AppDownload/AppDownload'

const MobileApp = () => {
  return (
    <div className={style.mobileAppPage}>
      <h1>Mobile App</h1>
      <p>Download the QuickBite app to order food faster and get exclusive offers.</p>
      <AppDownload />
    </div>
  )
}

export default MobileApp;
