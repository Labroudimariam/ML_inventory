import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Send logout request to the server (if needed)
        await axios.post("/logout", {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
        // Even if the logout request fails, we'll still clear local storage
      } finally {
        // Clear user data from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to login page
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
      <p>Please wait while we securely log you out.</p>
    </div>
  );
};

export default Logout;