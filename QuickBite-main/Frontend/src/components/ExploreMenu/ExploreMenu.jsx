import React, { useRef } from 'react'
import { menu_list } from '../../assets/assets'
import './exploremenu.css'

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="explore-menu" id="ExploreMenu">
      <div className="explore-header">
        <div>
          <h2>What's on your mind?</h2>
          <p>Browse our popular categories and find your perfect meal</p>
        </div>
        <div className="scroll-arrows">
          <button className="arrow-btn" onClick={() => scroll(-1)} aria-label="Scroll left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="arrow-btn" onClick={() => scroll(1)} aria-label="Scroll right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <div className="category-scroll" ref={scrollRef}>
        <button
          className={`category-chip ${category === 'All' ? 'active' : ''}`}
          onClick={() => setCategory('All')}
        >
          <span className="chip-emoji">🍽️</span>
          <span>All</span>
        </button>
        {menu_list.map((item, index) => (
          <button
            key={index}
            className={`category-chip ${category === item.menu_name ? 'active' : ''}`}
            onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
          >
            <img src={item.menu_image} alt={item.menu_name} className="chip-img" />
            <span>{item.menu_name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ExploreMenu