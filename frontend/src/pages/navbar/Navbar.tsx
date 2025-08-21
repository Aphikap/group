import React from 'react'
import './navbar.css'
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="background-header">
      <div className="header-row">
        <div className="header-left">
          <Link  to="/product-list" className="no-border-button left-font-size-large">

            <button className="no-border-button left-font-size-large">
              Seller Centre
            </button>
          </Link>
          <span>|</span>

           <Link  to="/Create-profile" className="no-border-button left-font-size-large">

            <button className="no-border-button left-font-size-large">
            Start Selling
          </button>
          </Link>
         
          <span>|</span>

          <Link  to="/Profile" className="no-border-button left-font-size-large">

            <button className="no-border-button left-font-size-large">
            ShopProfile
          </button>
          </Link>
         
          <span>|</span>
          <span className="left-font-size-large">Follow us on</span>
        </div>

        <div className="header-right">
          <Link  to="/" className="no-border-button left-font-size-large">

          <button className="no-border-button left-font-size-large">
            Login/Register
          </button>
          </Link>
       
          <button className="no-border-button left-font-size-large">
            Help
          </button>

          <select className="select-no-border left-font-size-large" defaultValue="English">
            <option value="English" style={{ color: "black" }}>English</option>
            <option value="Thai" style={{ color: "black" }}>Thai</option>
          </select>

          <select className="select-no-border left-font-size-large" defaultValue="">
            <option value="" disabled hidden>Qwerty</option>
            <option value="1" style={{ color: "black" }}>My Account</option>
            <option value="2" style={{ color: "black" }}>Logout</option>
          </select>
        </div>
      </div>
    </div>
  );
};



export default Navbar
