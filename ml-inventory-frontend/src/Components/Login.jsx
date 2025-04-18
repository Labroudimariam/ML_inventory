import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import './login.css';
import LoadingSpinner from "./loading/Loading";

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
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
          navigate("/");
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    
    // Basic email validation
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotMessage("Please enter a valid email address");
      setForgotLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("/forgot-password", {
        email: forgotEmail,
      });
      
      setForgotMessage(response.data.message || "Password reset link sent to your email");
      setForgotEmail("");
    } catch (error) {
      let errorMsg = "Failed to send reset link";
      if (error.response) {
        if (error.response.status === 422) {
          errorMsg = error.response.data.email?.[0] || "Validation error";
        } else if (error.response.status === 404) {
          errorMsg = "No account found with this email";
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.request) {
        errorMsg = "No response from server. Please try again later.";
      }
      setForgotMessage(errorMsg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="login-container">
        {loading ? (
          <LoadingSpinner />
        ) : !showForgotPassword ? (
          <>
            <div className="form-header">
              <h2>Sign in to your account</h2>
              <p>Welcome back! Please enter your details</p>
            </div>
  
            {error && (
              <div className="message error">
                <FiAlertCircle /> {error}
              </div>
            )}
  
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <div className="input-with-icon">
                  <FiMail className="icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
  
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <FiLock className="icon" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <a
                  href="#"
                  className="forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot password?
                </a>
              </div>
  
              <button type="submit" className="login-btn">
                Sign in
              </button>
            </form>
          </>
        ) : forgotLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="login-form">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="back-btn"
            >
              <FiArrowLeft className="icon" /> Back to login
            </button>
  
            <div className="form-header">
              <h2>Reset your password</h2>
              <p>Enter your email and we'll send you a link to reset your password.</p>
            </div>
  
            {forgotMessage && (
              <div
                className={`message ${
                  forgotMessage.includes("sent") || forgotMessage.includes("success")
                    ? "success"
                    : "error"
                }`}
              >
                <FiAlertCircle /> {forgotMessage}
              </div>
            )}
  
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="forgot-email">Email address</label>
                <div className="input-with-icon">
                  <FiMail className="icon" />
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
  
              <button type="submit" className="login-btn">
                Send reset link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Login;