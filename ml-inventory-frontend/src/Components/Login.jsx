import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import "./login.css";
import LoadingSpinner from "./loading/Loading";

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

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
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotMessage("Please enter a valid email address");
      setForgotLoading(false);
      return;
    }

    try {
      const response = await axios.post("/forgot-password", {
        email: forgotEmail,
      });

      setForgotMessage(
        response.data.message || "Password reset link sent to your email"
      );
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
    <div className="login-wrapper">
      <div className="login-container">
        {/* Show loading spinner when loading is true */}
        {(loading || forgotLoading) ? (
          <div className="loading-overlay">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Show image only if not loading */}
            <div className="login-image">
              <img src="cow.jpg" alt="Login visual" />
            </div>

            <div className="login-form-section">
              {showForgotPassword ? (
                <div className="login-form">
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="back-btn"
                  >
                    <FiArrowLeft className="icon" /> Back to login
                  </button>

                  <div className="form-header">
                    <h2>Reset your password</h2>
                    <p>
                      Enter your email and we'll send you a link to reset your
                      password.
                    </p>
                  </div>

                  {forgotMessage && (
                    <div
                      className={`message ${
                        forgotMessage.includes("sent") ||
                        forgotMessage.includes("success")
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
              ) : (
                <>
                  <div className="form-header">
                    <h2>Welcome !</h2>
                    <p>Sign in to your account</p>
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
                        <input
                          id="password"
                          name="password"
                          type={passwordVisible ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <span
                          className="toggle-password-visibility"
                          onClick={togglePassword}
                          title={
                            passwordVisible ? "Hide password" : "Show password"
                          }
                        >
                          {passwordVisible ? (
                            <FiEye className="icon" />
                          ) : (
                            <FiEyeOff className="icon" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="button-row">
                      <button
                        type="button"
                        className="forgot-password"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowForgotPassword(true);
                        }}
                      >
                        Forgot password?
                      </button>
                      <button
                        type="submit"
                        className={`login-btn ${loading ? "loading" : ""}`}
                      >
                        {loading && <span className="animate-spin">⏳</span>}
                        Sign in
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default Login;
