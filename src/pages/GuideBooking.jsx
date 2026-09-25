import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";

const GuideBooking = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";
  const initialLanguage = searchParams.get("language") || "";

  const [destination, setDestination] = useState(initialDestination);
  const [language, setLanguage] = useState(initialLanguage);
  const [guides, setGuides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const [loadingGuides, setLoadingGuides] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [message, setMessage] = useState("");

  const fetchGuides = async () => {
    setLoadingGuides(true);
    try {
      const res = await api.get("/guides/search", { params: { destination, language } });
      setGuides(res.data.guides || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not search guides");
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get("/guides/bookings/mine");
      setMyBookings(res.data.bookings || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load your bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const createBooking = async (guideId) => {
    try {
      await api.post(
        "/guides/bookings",
        {
          guideId,
          destination,
          language,
          message: "",
        }
      );
      setMessage("Guide booking request sent.");
      fetchMyBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not create booking");
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await api.put(`/guides/bookings/${bookingId}/cancel`);
      setMessage("Booking cancelled.");
      fetchMyBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not cancel booking");
    }
  };

  useEffect(() => {
    fetchMyBookings();
    if (initialDestination) {
      fetchGuides();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-6 fw-bold">🧑‍🏫 Find Local Guides</h1>
        <p className="text-muted">Connect with experienced local guides who can help you navigate and explore your destination.</p>
      </div>

      {message && (
        <div className="alert alert-info mb-4 text-center">{message}</div>
      )}

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Destination</label>
              <input
                className="form-control"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Shimla"
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">Language</label>
              <input
                className="form-control"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., Hindi/English"
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={fetchGuides}
                disabled={loadingGuides || !destination}
              >
                {loadingGuides ? "Searching..." : "Search Guides"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="h5 fw-semibold mb-3">Available Guides</h2>

        {guides.length === 0 ? (
          <div className="text-center py-5 bg-light rounded"> 
            <div className="fs-1 mb-3">🔍</div>
            <h3 className="h6 mb-2">{destination ? "No guides found" : "Search for guides"}</h3>
            <p className="text-muted">{destination ? "Try different destination or language preferences" : "Enter a destination to find available guides"}</p>
          </div>
        ) : (
          <div className="row g-3">
            {guides.map((g) => (
              <div key={g._id} className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <h6 className="fw-semibold mb-1">{g.guideId?.name || "Guide"}</h6>
                        <p className="mb-1 text-muted">{g.hourlyRate ? `₹${g.hourlyRate}/hour` : "Rate not set"} • {g.availability}</p>
                      </div>
                      <span className="badge bg-success">Available</span>
                    </div>
                    {g.languages?.length > 0 && <p className="mb-1"><strong>Languages:</strong> {g.languages.join(", ")}</p>}
                    {g.destinations?.length > 0 && <p className="mb-2"><strong>Destinations:</strong> {g.destinations.slice(0, 3).join(", ")}{g.destinations.length > 3 ? "..." : ""}</p>}
                    {g.bio && <p className="text-muted mb-3">{g.bio}</p>}
                    <button className="btn btn-success w-100" onClick={() => createBooking(g.guideId._id)}>Book This Guide</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-semibold mb-3">My Guide Requests</h2>

          {loadingBookings ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 text-muted">Loading bookings...</p>
            </div>
          ) : myBookings.length === 0 ? (
            <div className="text-center py-4">
              <div className="fs-1 mb-2">📝</div>
              <h3 className="h6 mb-1">No bookings yet</h3>
              <p className="text-muted">Your guide booking requests will appear here</p>
            </div>
          ) : (
            <div className="row g-3">
              {myBookings.map((b) => (
                <div key={b._id} className="col-12 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-semibold mb-0">{b.guideId?.name}</h6>
                          <p className="text-muted small mb-0">{b.destination}</p>
                        </div>
                        <span className={`badge text-bg-${b.status === "accepted" ? "success" : b.status === "rejected" ? "danger" : "warning"}`}>{b.status}</span>
                      </div>
                      {b.message && <p className="text-muted small mb-3">Message: {b.message}</p>}
                      {b.status === "pending" && (
                        <button className="btn btn-outline-danger btn-sm" onClick={() => cancelBooking(b._id)}>Cancel Request</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideBooking;

