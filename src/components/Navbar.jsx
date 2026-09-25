import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Preserve remember me settings
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberMeEnabled = localStorage.getItem("rememberMeEnabled");
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    
    localStorage.clear();
    
    // Restore remember me settings
    if (rememberedEmail) localStorage.setItem("rememberedEmail", rememberedEmail);
    if (rememberMeEnabled) localStorage.setItem("rememberMeEnabled", rememberMeEnabled);
    if (loginTimestamp) localStorage.setItem("loginTimestamp", loginTimestamp);
    
    navigate("/welcome");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">TripMate</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><button className="nav-link btn btn-link text-white" onClick={() => navigate("/dashboard")}>Dashboard</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link text-white" onClick={() => navigate("/trips")}>Trips</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link text-white" onClick={() => navigate("/budget")}>Budget Issue</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link text-white" onClick={() => navigate("/planner")}>AI Planner</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link text-white" onClick={() => navigate("/create-trip")}>+ Create Trip</button></li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 text-light">Hi {name || "Traveller"}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;