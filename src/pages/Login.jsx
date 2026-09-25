import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const isRemembered = localStorage.getItem("rememberMeEnabled") === "true";
    
    if (rememberedEmail && isRemembered) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Auto-redirect if valid token exists
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("name", response.data.name);

        // Handle "Remember Me"
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberMeEnabled", "true");
          localStorage.setItem("loginTimestamp", new Date().getTime());
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.setItem("rememberMeEnabled", "false");
        }

        navigate("/dashboard");
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card p-4">
        <div className="card-body">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold">Welcome Back</h1>
            <p className="text-muted">Login to continue your travel journey</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me on this device
              </label>
            </div>

            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-muted mb-0">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;