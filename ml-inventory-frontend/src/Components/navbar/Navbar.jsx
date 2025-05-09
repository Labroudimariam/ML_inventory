import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaFolderOpen,
  FaUsers,
  FaEnvelopeOpenText,
  FaChartBar,
  FaWarehouse,
  FaChartLine,
  FaCog,
  FaFileInvoice,
  FaSignOutAlt,
} from 'react-icons/fa';
import { PiHandshakeFill } from 'react-icons/pi';
import { FaBars, FaTimes } from 'react-icons/fa';

import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="navbar">
      <button className="mobile-menu-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="nav-links">
          <div className="nav-top">
            <NavLink to="/admin-dashboard" onClick={closeSidebar}><FaTachometerAlt /> Dashboard</NavLink>
            <NavLink to="/products/list" onClick={closeSidebar}><FaBoxOpen /> Products</NavLink>
            <NavLink to="/categories/list" onClick={closeSidebar}><FaFolderOpen /> Categories</NavLink>
            <NavLink to="/orders/list" onClick={closeSidebar}><FaFileInvoice /> Orders</NavLink>
            <NavLink to="/beneficiaries/list" onClick={closeSidebar}><PiHandshakeFill /> Beneficiaries</NavLink>
            <NavLink to="/users/list" onClick={closeSidebar}><FaUsers /> Users</NavLink>
            <NavLink to="/inboxes/list" onClick={closeSidebar}><FaEnvelopeOpenText /> Inbox</NavLink>
            <NavLink to="/inventory/list" onClick={closeSidebar}><FaChartBar /> Inventory</NavLink>
            <NavLink to="/warehouses/list" onClick={closeSidebar}><FaWarehouse /> Warehouse</NavLink>
            <NavLink to="/reports/list" onClick={closeSidebar}><FaChartLine /> Reports</NavLink>
            <NavLink to="/settings" onClick={closeSidebar}><FaCog /> Settings</NavLink>
          </div>
          <div className="nav-bottom">
            <NavLink to="/logout" className="logout" onClick={closeSidebar}><FaSignOutAlt /> Logout</NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;