import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/register", { name, email, password, role });

      if (response.data.success) {
        navigate("/login");
      } else {
        setMessage(response.data.message || "Registration failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="card register-card p-4">
        <div className="card-body">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold">Join TripMate</h1>
            <p className="text-muted">Create your account and start your journey</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Your Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Traveller</option>
                <option value="vendor">Hotels/Restaurant</option>
                <option value="guide">Guide</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-muted mb-0">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;