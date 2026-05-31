import React from 'react'
import style from './contact.module.css'

const Contact = () => {
  return (
    <div className={style.contactPage}>
      <h1>Contact QuickBite</h1>
      <div className={style.details}>
        <p><strong>Phone:</strong> 7905898608</p>
        <p><strong>Email:</strong> shri21294@gmail.com</p>
        <p><strong>Address:</strong> 123 Main Street, Your City</p>
        <p><strong>Website:</strong> www.quickbite.com</p>
      </div>
    </div>
  )
}

export default Contact;
