import { useEffect, useState } from "react";
import { Bell, Sun, Moon, Search } from "lucide-react";
import "./navbarTop.css";

export default function NavbarTop({ isDarkMode, toggleDarkMode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cachedUser = JSON.parse(localStorage.getItem("user"));
    if (cachedUser) {
      setUser({
        ...cachedUser,
        profile_picture_url: cachedUser.profile_picture 
          ? `http://127.0.0.1:8000/storage/${cachedUser.profile_picture}`
          : null
      });
    }
  }, []);

  return (
    <div className={`navbar-top ${isDarkMode ? "dark" : ""}`}>
      {/* Left section with logo and search */}
      <div className="navbar-left">
        <div className="navbar-logo">
          <img 
            src="/logoMLlight.jpg" 
            alt="Logo" 
            className="navbar-logo-img" 
            width="52"
          />
        </div>
        
        <div className="navbar-search">
          <Search className="navbar-search-icon" size={20} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      {/* Right section with icons */}
      <div className="navbar-icons">
        <button>
          <Bell size={22} />
          <span className="notification-dot"></span>
        </button>

        <button onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <img
          src={user?.profile_picture_url || "/unknown_user.jpeg"}
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/unknown_user.jpeg";
          }}
          className="navbar-profile-img"
        />
      </div>
    </div>
  );
}