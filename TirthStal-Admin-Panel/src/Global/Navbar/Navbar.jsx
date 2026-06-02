import React from 'react'
import "./Navbar.css";
import {Link} from 'react-router-dom'
import {useState} from 'react'
import { useLocation } from 'react-router-dom';
import {
    Bell,
    Search,
    Menu,
} from "lucide-react";



const PAGE_NAMES = {
     "/": "Dashboard",
  "/temple": "Temple",
  "/dieties": "Deities",
  "/festivals": "Festivals",
}
 const Navbar = ({ setIsOpen, isOpen })=>{
    const location = useLocation();
    const pageName = PAGE_NAMES[location.pathname] || "Dashboard";

    const handleSidebar = () => {
        setIsOpen(!isOpen)
    }
   return (
     <div>
        <header className={`navbar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
            <div className='navbar_left'>
                <button className="menu-btn" onClick={handleSidebar}>
                    <Menu size={22}/>
                </button>
                <h3 id='dashboard'>{pageName}</h3>
                <div className="search-box">
                    <h1>SAY MY NAME </h1>
                </div>
            </div>
            <div className="navbar_right">
                <div className="notification">
                    <Bell size={20}/>
                    <span className="notification-badge">
                        3
                    </span>
                </div>
                <div className="profile">
                      <img src="../../public/image.png" alt="" />
                    <div className="profile-info">
                        <h4>Tanjiro</h4>
                        <p>Owner</p>
                    </div>
                </div>
            </div>

        </header>
     </div>
   )
 }
 
 export default Navbar