import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import "./CreateTrip.css";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    destination: "",
    travelDate: "",
    budget: "",
    seatsAvailable: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/trips/create", form);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="card create-trip-card p-5 shadow-lg rounded-4" style={{maxWidth: '600px', margin: 'auto'}}>
        <div className="text-center mb-4">
          <h1 className="h2 fw-bold mb-2">✈️ Create Your Dream Trip</h1>
          <p className="text-muted">Share your travel plan and find companions who want to join you</p>
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label fw-bold">Destination *</label>
            <input
              className="form-control form-control-lg"
              type="text"
              name="destination"
              placeholder="Where are you going?"
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-bold">Travel Date</label>
            <input
              className="form-control form-control-lg"
              type="date"
              name="travelDate"
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-bold">Budget (₹)</label>
            <input
              className="form-control form-control-lg"
              type="number"
              name="budget"
              placeholder="Total budget for the trip"
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-bold">Available Seats</label>
            <input
              className="form-control form-control-lg"
              type="number"
              name="seatsAvailable"
              placeholder="How many companions can join?"
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          {message && (
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}

          <div className="col-12">
            <button
              className="btn btn-primary btn-lg w-100 fw-bold"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Trip..." : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
  );
};

export default CreateTrip;