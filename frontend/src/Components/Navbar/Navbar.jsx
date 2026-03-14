import React from "react";
import { useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
const Navbar = () => {
  const [menu, setmenu] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);

  const { getTotalCartAmount, getTotalCartItems, token, setToken, searchTerm, setSearchTerm, setshowLogin, hasActiveOrders } = useContext(StoreContext);

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };
  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setmenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setmenu("Menu")}
          className={menu === "Menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setmenu("Mobile-app")}
          className={menu === "Mobile-app" ? "active" : ""}
        >
          Mobile-app
        </a>
        <a
          href="#footer"
          onClick={() => setmenu("Contact Us")}
          className={menu === "Contact Us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        {!showSearch ? (
          <img 
            src={assets.search_icon} 
            alt="search" 
            onClick={() => setShowSearch(true)} 
            style={{cursor: 'pointer'}} 
          />
        ) : (
          <div className="navbar-search-input">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              autoFocus
            />
            <img 
              src={assets.cross_icon} 
              alt="close" 
              onClick={() => { setShowSearch(false); setSearchTerm(""); }} 
              style={{cursor: 'pointer', width: '12px'}} 
            />
          </div>
        )}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}>
            {getTotalCartItems() > 0 ? getTotalCartItems() : ""}
          </div>
        </div>
        {!token ? (
          <button onClick={() => setshowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <div className="profile-icon-wrapper">
              <img src={assets.profile_icon} alt="profile" />
              {hasActiveOrders && <div className="active-dot"></div>}
            </div>
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
                {hasActiveOrders && <div className="order-dot"></div>}
              </li>
              <hr />
              <li onClick={logOut}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
