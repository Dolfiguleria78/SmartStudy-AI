import React from "react";
import api from "../lib/api";

const TripCard = ({ trip }) => {
  const sendRequest = async () => {
    try {
      await api.post(`/requests/send/${trip._id}`);
      alert("Request Sent Successfully");
    } catch (error) {
      console.error(error);
      alert("Error sending request");
    }
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">{trip.destination}</h5>
        <p className="card-text mb-1">Date: {new Date(trip.travelDate).toLocaleDateString()}</p>
        <p className="card-text mb-3">Budget: ₹{trip.budget}</p>
        <button className="btn btn-primary w-100" onClick={sendRequest}>
          Send Request
        </button>
      </div>
    </div>
  );
};

export default TripCard;