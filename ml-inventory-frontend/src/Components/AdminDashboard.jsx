import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import { Bell, Sun, Moon, Search } from "lucide-react";
import "./adminDashboard.css";
import "../Components/navbar/navbar.css";
import "../Components/navbar/navbarTop.css";

const AdminDashboard = () => {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // User state
  const [user, setUser] = useState(null);

  // Navbar sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Set dark mode class on HTML element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Load user data from localStorage
  useEffect(() => {
    const cachedUser = JSON.parse(localStorage.getItem("user"));
    if (cachedUser) {
      setUser({
        ...cachedUser,
        profile_picture_url: cachedUser.profile_picture
          ? `http://127.0.0.1:8000/storage/${cachedUser.profile_picture}`
          : null,
      });
    }
  }, []);

  return (
    <div className="admin-dashboard">
      {/* NavbarTop content */}
      <div className={`navbar-top ${isDarkMode ? "dark" : ""}`}>
        <div className="navbar-left">
          <div className="navbar-logo">
            <img
              src={isDarkMode ? "/logoMLdark.png" : "/logoMLlight.png"}
              alt="Logo"
              className="navbar-logo-img"
            />
          </div>

          <div className="navbar-search">
            <Search className="navbar-search-icon" size={20} />
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        <div className="navbar-icons">
          <button>
            <Bell size={22} />
            <span className="notification-dot"></span>
          </button>

          <button onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <Link to="/admin-dashboard/settings">
            <img
              src={user?.profile_picture_url || "/unknown_user.jpeg"}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/unknown_user.jpeg";
              }}
              className="navbar-profile-img"
            />
          </Link>
        </div>
      </div>

      {/* Navbar content */}
      <div className="navbar">
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
        )}

        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <nav className="nav-links">
            <div className="nav-top">
              <NavLink to="/admin-dashboard" onClick={closeSidebar} end>
                <FaTachometerAlt /> Dashboard
              </NavLink>
              <NavLink
                to="/admin-dashboard/products/list"
                onClick={closeSidebar}
              >
                <FaBoxOpen /> Products
              </NavLink>
              <NavLink
                to="/admin-dashboard/categories/list"
                onClick={closeSidebar}
              >
                <FaFolderOpen /> Categories
              </NavLink>
              <NavLink to="/admin-dashboard/orders/list" onClick={closeSidebar}>
                <FaFileInvoice /> Orders
              </NavLink>
              <NavLink
                to="/admin-dashboard/beneficiaries/list"
                onClick={closeSidebar}
              >
                <PiHandshakeFill /> Beneficiaries
              </NavLink>
              <NavLink to="/admin-dashboard/users/list" onClick={closeSidebar}>
                <FaUsers /> Users
              </NavLink>
              <NavLink
                to="/admin-dashboard/inboxes/list"
                onClick={closeSidebar}
              >
                <FaEnvelopeOpenText /> Inbox
              </NavLink>
              <NavLink
                to="/admin-dashboard/inventory/list"
                onClick={closeSidebar}
              >
                <FaChartBar /> Inventory
              </NavLink>
              <NavLink
                to="/admin-dashboard/warehouses/list"
                onClick={closeSidebar}
              >
                <FaWarehouse /> Warehouse
              </NavLink>
              <NavLink
                to="/admin-dashboard/reports/list"
                onClick={closeSidebar}
              >
                <FaChartLine /> Reports
              </NavLink>
              <NavLink to="/admin-dashboard/settings" onClick={closeSidebar}>
                <FaCog /> Settings
              </NavLink>
            </div>
            <div className="nav-bottom">
              <NavLink to="/logout" className="logout" onClick={closeSidebar}>
                <FaSignOutAlt /> Logout
              </NavLink>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
