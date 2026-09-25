import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="landing-hero position-relative overflow-hidden">
        <img src="/assets/images/hero-banner.png" alt="Hero Banner" className="hero-background" />
        <div className="hero-overlay d-flex flex-column justify-content-center align-items-center h-100">
          <h1 className="display-3 fw-bold text-white mb-3">Ai-Resume</h1>
          <p className="lead text-white mb-5 w-75">
            Your smart travel companion for budget solutions, AI-powered trip planning, local guides, and travel companions.
          </p>
          <div className="d-flex justify-content-center gap-3 mb-5">
            <button className="btn btn-light btn-lg fw-bold" onClick={() => navigate("/register")}>Get Started</button>
            <button className="btn btn-outline-light btn-lg fw-bold" onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center h2 fw-bold mb-5">Why Choose TripMate?</h2>
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card landing-card p-4 h-100 shadow-sm border-0 text-center hover-card">
              <img src="/assets/images/icon-budget.png" alt="Budget" className="card-icon mb-3" />
              <h5 className="mt-3">Budget Issues?</h5>
              <p className="text-muted">Get instant loan assistance and connect with trusted banks and NBFC partners.</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card landing-card p-4 h-100 shadow-sm border-0 text-center hover-card">
              <img src="/assets/images/icon-planner.png" alt="AI Planner" className="card-icon mb-3" />
              <h5 className="mt-3">AI Trip Planner</h5>
              <p className="text-muted">Fill in your preferences and let AI create a budget-friendly itinerary.</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card landing-card p-4 h-100 shadow-sm border-0 text-center hover-card">
              <img src="/assets/images/icon-guides.png" alt="Guides" className="card-icon mb-3" />
              <h5 className="mt-3">Local Guides</h5>
              <p className="text-muted">Book experienced local guides who know their destinations inside out.</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card landing-card p-4 h-100 shadow-sm border-0 text-center hover-card">
              <img src="/assets/images/icon-companions.png" alt="Companions" className="card-icon mb-3" />
              <h5 className="mt-3">Find Companions</h5>
              <p className="text-muted">Find travel buddies and create unforgettable memories together.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Showcase */}
      <div className="destinations-section py-5" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container">
          <h2 className="text-center h2 fw-bold text-white mb-5">Popular Destinations</h2>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="destination-card rounded-4 overflow-hidden shadow-lg h-100">
                <img src="/assets/images/destination-mountain.png" alt="Mountain" className="w-100" style={{height: '250px', objectFit: 'cover'}} />
                <div className="p-4">
                  <h5 className="fw-bold">Explore Mountains</h5>
                  <p className="text-muted">Experience breathtaking peaks and serene valleys. Perfect for adventure seekers.</p>
                  <button className="btn btn-sm btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="destination-card rounded-4 overflow-hidden shadow-lg h-100">
                <img src="/assets/images/destination-beach.png" alt="Beach" className="w-100" style={{height: '250px', objectFit: 'cover'}} />
                <div className="p-4">
                  <h5 className="fw-bold">Beach Getaways</h5>
                  <p className="text-muted">Relax on sandy shores and enjoy tropical paradise with crystal waters.</p>
                  <button className="btn btn-sm btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" onClick={() => window.open("https://www.google.com/search?q=best+cities+to+visit", "_blank")}>
              <div className="destination-card rounded-4 overflow-hidden shadow-lg h-100">
                <img src="/assets/images/destination-city.png" alt="City" className="w-100" style={{height: '250px', objectFit: 'cover'}} />
                <div className="p-4">
                  <h5 className="fw-bold">Explore Cities</h5>
                  <p className="text-muted">Discover vibrant cultures, historic sites, and modern architecture.</p>
                  <button className="btn btn-sm btn-primary">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section py-5 text-center" style={{background: '#f8f9fa'}}>
        <div className="container">
          <h2 className="h2 fw-bold mb-3">Start Your Adventure Today</h2>
          <p className="lead text-muted mb-4">Join thousands of travelers discovering the world together</p>
          <button className="btn btn-primary btn-lg fw-bold" onClick={() => navigate("/register")}>Create Free Account</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
