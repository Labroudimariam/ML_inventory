import React from 'react';
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
import './navbar.css';

const Navbar = () => {
  return (
    <div className="sidebar">
      <nav className="nav-links">
        <NavLink to="/admin-dashboard"><FaTachometerAlt /> Dashboard</NavLink>
        <NavLink to="/products/list"><FaBoxOpen /> Products</NavLink>
        <NavLink to="/categories/list"><FaFolderOpen /> Categories</NavLink>
        <NavLink to="/orders/list"><FaFileInvoice /> Orders</NavLink>
        <NavLink to="/beneficiaries/list"><PiHandshakeFill /> Beneficiaries</NavLink>
        <NavLink to="/users/list"><FaUsers /> Users</NavLink>
        <NavLink to="/inboxes/list"><FaEnvelopeOpenText /> Inbox</NavLink>
        <NavLink to="/inventory/list"><FaChartBar /> Inventory</NavLink>
        <NavLink to="/warehouses/list"><FaWarehouse /> Warehouse</NavLink>
        <NavLink to="/reports/list"><FaChartLine /> Reports</NavLink>
        <NavLink to="/settings"><FaCog /> Settings</NavLink>
        <NavLink to="/logout" className="logout"><FaSignOutAlt /> Logout</NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
