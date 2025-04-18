import { useEffect, useState } from "react";
import { Bell, Sun, Moon, Search } from "lucide-react";
import "./navbarTop.css";

export default function NavbarTop({ isDarkMode, toggleDarkMode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cachedProfile = localStorage.getItem("cachedProfile");
    if (cachedProfile) {
      setUser(JSON.parse(cachedProfile));
    }
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-md">
      <div className={`navbar-top ${isDarkMode ? "dark" : ""}`}>
        <div className="navbar-search">
          <Search className="navbar-search-icon" size={20} />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="navbar-icons">
          <button>
            <Bell size={22} />
            <span className="notification-dot"></span>
          </button>

          <button onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <img
            src={
              user?.profile_picture
                ? `http://localhost:8000/storage/${user.profile_picture}`
                : "/images/default-profile.png"
            }
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-profile.png";
            }}
            className="navbar-profile-img"
          />
        </div>
      </div>
    </div>
  );
}
