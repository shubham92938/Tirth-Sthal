import React, { useState } from 'react'
import Sidebar from '../../Global/Sidebar/Sidebar';
import Navbar from '../../Global/Navbar/Navbar';
import "./MainPage.css"
import { Outlet } from "react-router-dom"

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    /* ✅ This container handles shifting your grid layouts in sync */
    <div className={`main-layout ${isOpen ? "open" : "close"}`}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        
        {/* Navbar changes its internal layout looks by reading your active state */}
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        
        <div className="page-content">
            <Outlet />
        </div>
    </div>
  )
}

export default MainPage