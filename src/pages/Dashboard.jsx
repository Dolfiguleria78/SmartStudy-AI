import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <h1 className="display-6 text-center fw-bold mb-2">Welcome to TripMate</h1>
        <p className="text-center text-muted mb-5">Choose a service to get started on your perfect travel experience.</p>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm dashboard-card" onClick={() => navigate("/budget")} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <img src="/assets/images/icon-budget.png" alt="Budget" className="dashboard-icon mb-3" />
                <h5 className="card-title">Budget Issues?</h5>
                <p className="card-text text-muted">Facing financial constraints? Apply for travel loans and connect with our banking partners.</p>
                <button className="btn btn-primary w-100 mt-3">Get Loan Assistance</button>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm dashboard-card" onClick={() => navigate("/planner")} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <img src="/assets/images/icon-planner.png" alt="AI Planner" className="dashboard-icon mb-3" />
                <h5 className="card-title">AI Trip Planner</h5>
                <p className="card-text text-muted">Let our AI create a customized itinerary based on your preferences and budget.</p>
                <button className="btn btn-success w-100 mt-3">Plan My Trip</button>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm dashboard-card" onClick={() => navigate("/trips")} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <img src="/assets/images/icon-companions.png" alt="Companions" className="dashboard-icon mb-3" />
                <h5 className="card-title">Companions & Guides</h5>
                <p className="card-text text-muted">Create trips, find travel companions, or book experienced local guides.</p>
                <button className="btn btn-info w-100 mt-3 text-white">Find Companions</button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <h2 className="h4 fw-bold mb-4">What do you want to do?</h2>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button className="btn btn-dark" onClick={() => navigate("/create-trip")}>Create New Trip</button>
            <button className="btn btn-outline-primary" onClick={() => navigate("/guide-booking")}>Book a Guide</button>
            <button className="btn btn-outline-success" onClick={() => navigate("/trips")}>Browse Trips</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;