import "./Sidebar.css";
import React from "react";
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  TriangleAlert,
  ChartColumn,
  CalendarDays,
  Users,
  Settings,
  X,
  Layers,
  LucideArrowUpFromLine,
  HomeIcon,
  Flame,
  SparklesIcon,
} from "lucide-react";
import { GiTempleDoor, GiTempleGate } from "react-icons/gi";
import { TbNoDerivatives } from "react-icons/tb";
const Sidebar = ({isOpen , setIsOpen}) => {

  // console.log(isOpen);
  // const slide = () => {
  //   setIsOpen = false
  // }
  

  return (
    <aside 
          className= {
            // isOpen
            // ?"sidebar active"
            // :"sidebar"
            `sidebar ${isOpen ? "open" : "close"}`}
            >

     <div className="sidebar_top">
      
      <div className="sidebar__logo">

        <div className="logo__icon">
           <img src="../../public/image.png" alt="#" />
        </div>

        <h1>Admin<span id="black">Panel</span></h1>
    
      </div>
      
      {/* <button className="close-btn"
                         onClick={() => setIsOpen(false)} > <X size = {22}/>
      </button> */}
      </div>
      <nav>

        <ul className="sidebar__menu">

          <li className="active"><Link to="/dashboard" className="link" >

            <HomeIcon size={20} />

            <span>Dashboard</span></Link>

          </li>

          <li><Link to="/temple" className="link">

            <GiTempleGate size={20} />

            <span>Temple</span></Link>

          </li>

          <li><Link to="/dieties" className="link">

            <Flame size={20} />

            <span>Deities</span></Link>

          </li>
          <li><Link to="/festivals" className="link">

            <SparklesIcon size={20} />

            <span>Festivals</span></Link>

          </li>

           </ul>

      </nav>

      <div className="user-account">
        <div className="badgeicon">
           <img src="../../public/image.png" alt="" />
        </div>
        <div>
        <h1 id="fresh">Tanjiro</h1>
        <h3 id="owner">Owner</h3>
      </div></div>

    </aside>
  );
};

export default Sidebar;



 