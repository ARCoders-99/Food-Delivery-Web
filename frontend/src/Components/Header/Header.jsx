import React from 'react'
import "./Header.css"

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>
          Order your favourite food here!
        </h2>
        <p>
          Explore a wide variety of mouthwatering dishes, each prepared with the finest ingredients and exceptional culinary skill. We’re dedicated to making every meal a delightful part of your dining experience.
        </p>
        <a href="#explore-menu"><button>View Menu</button></a>
      </div>
    </div>
  )
}

export default Header