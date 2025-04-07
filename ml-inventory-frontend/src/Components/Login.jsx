import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("/login", {
        email,
        password,
      });
  
      const { token, user } = response.data;
  
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      // Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "subadmin":
          navigate("/subadmin-dashboard");
          break;
        case "storekeeper":
          navigate("/storekeeper-dashboard");
          break;
        default:
          navigate("/profile"); // fallback
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;