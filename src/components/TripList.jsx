import React, { useEffect, useState } from "react";
import api from "../lib/api";

const TripList = () => {
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    const res = await api.get("/trips");
    setTrips(res.data.data || []);
  };

  const sendRequest = async (tripId) => {
    try {
      const res = await api.post(`/requests/send/${tripId}`);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2">🌍 Explore Available Trips</h1>
        <p className="text-muted">Find travel companions and join exciting trips planned by fellow travelers.</p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-5">
          <div className="fs-1 mb-3">🗺️</div>
          <h3 className="h5 mb-2">No trips available</h3>
          <p className="text-muted">Check back later or create your own trip!</p>
        </div>
      ) : (
        <div className="row g-4">
          {trips.map((trip) => (
            <div key={trip._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body"> 
                  <h5 className="card-title">📍 {trip.destination}</h5>
                <p className="card-text mb-1">💰 Budget: ₹{trip.budget}</p>
                <p className="card-text mb-1">🪑 Available Seats: {trip.seatsAvailable}</p>
                <p className="card-text mb-3">👤 Organized by: {trip.userId.name}</p>
                <button className="btn btn-primary w-100" onClick={() => sendRequest(trip._id)}>
                  Send Join Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
 );
};

export default TripList;