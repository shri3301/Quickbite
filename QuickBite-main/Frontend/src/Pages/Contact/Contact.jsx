import React, { useState } from 'react'
import style from './contact.module.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Message sent! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className={style.contactPage}>
      <div className={style.contactHeader}>
        <h1>Get In Touch</h1>
        <p>Have a question, feedback, or need help with an order? We're here to help — reach out by phone, email, or using the form below and we'll respond within one business day.</p>
      </div>

      <div className={style.contactContainer}>
        {/* Left Side - Contact Info */}
        <div className={style.contactInfo}>
          <h2>Contact Information</h2>
          <p>Need assistance? Call us, drop an email, or send a message and our support team will get back to you fast.</p>
          
          <div className={style.infoItem}>
            <span className={style.icon}>📞</span>
            <div>
              <p>7905898608</p>
              <p>+918767633668</p>
            </div>
          </div>

          <div className={style.infoItem}>
            <span className={style.icon}>✉️</span>
            <p>shri21294@gmail.com</p>
          </div>

          <div className={style.infoItem}>
            <span className={style.icon}>📍</span>
            <p>123 Main Street, Your City</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <form className={style.contactForm} onSubmit={handleSubmit}>
          <div className={style.formGroup}>
            <label>Your Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="John Trangely"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label>Your Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="hello@nurency.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label>Your Subject</label>
            <input 
              type="text" 
              name="subject"
              placeholder="I want to hire you quickly"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label>Message</label>
            <textarea 
              name="message"
              placeholder="Write here your message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className={style.submitBtn}>Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact;
