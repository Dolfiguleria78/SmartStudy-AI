import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./AITripPlanner.css";

const AITripPlanner = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    destination: "",
    travelDate: "",
    returnDate: "",
    budget: "",
    interests: "",
    languageNeed: "",
    companionPreferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createDemoPlan = () => {
    const budget = Number(form.budget || 50000);
    const days = form.travelDate && form.returnDate
      ? Math.max(1, Math.round((new Date(form.returnDate) - new Date(form.travelDate)) / (1000 * 60 * 60 * 24)))
      : 4;
    const dest = form.destination || "destination";

    return {
      summary: `Sample ${days} day itinerary for ${dest}.`,
      totalEstimatedCost: Math.floor(budget * 0.85),
      costBreakdown: [
        { category: "Accommodation", amount: Math.floor(budget * 0.35) },
        { category: "Food", amount: Math.floor(budget * 0.20) },
        { category: "Transport", amount: Math.floor(budget * 0.18) },
        { category: "Activities", amount: Math.floor(budget * 0.12) },
        { category: "Reserve", amount: Math.floor(budget * 0.10) },
      ],
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1} in ${dest}`,
        estimatedCost: Math.max(1000, Math.floor(budget * 0.2)),
        activities: [
          "Explore local attractions",
          "Try local cuisine",
          "Relax and enjoy the evening",
        ],
      })),
      checklist: ["Passport/ID", "Check luggage", "Book transport", "Carry emergency fund"],
      hotelSuggestions: [
        {
          name: `Budget Stay in ${dest}`,
          location: "Central Market Area",
          ratePerNight: 1200,
          bookingPlatform: "Hostelworld",
          link: "https://www.hostelworld.com",
        },
        {
          name: `Cozy Guest House`,
          location: "Scenic Hill Side Road",
          ratePerNight: 1800,
          bookingPlatform: "Booking.com",
          link: "https://www.booking.com",
        },
      ],
      restaurantSuggestions: [
        {
          name: "Local Heritage Dhaba",
          location: "Mall Road",
          specialty: "Traditional Thali",
          priceRange: "Budget",
        },
        {
          name: "Mountain Cafe",
          location: "Near River Side",
          specialty: "Pancakes and Coffee",
          priceRange: "Mid-range",
        },
      ],
      transportSuggestions: [
        {
          type: "Bus",
          provider: "State RTC Volvo",
          boardingPoint: "ISBT Hub",
          dropPoint: `${dest} Bus Stand`,
          rate: 950,
          bookingPlatform: "RedBus",
          ticketLink: "https://www.redbus.in",
        },
      ],
      adventureActivities: [
        {
          activity: "Trekking & Hiking",
          location: "Valley Base Trail",
          price: 1500,
          details: "Scenic view of local landscape",
        },
      ],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.travelDate && form.returnDate && form.returnDate < form.travelDate) {
      setError("Return date cannot be before travel date.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const res = await api.post("/planner/generate", {
        destination: form.destination,
        travelDate: form.travelDate || undefined,
        returnDate: form.returnDate || undefined,
        budget: form.budget || undefined,
        interests: form.interests,
        languageNeed: form.languageNeed,
        companionPreferences: form.companionPreferences,
      });

      setPlan(res.data.plan || createDemoPlan());
      if (res.data.plan) {
        setError(""); // Clear any previous error
      }
    } catch (err) {
      console.warn("Backend planner failed, using local demo plan", err);
      setPlan(createDemoPlan());
      setError("⚠️ AI service temporarily unavailable. Showing sample itinerary. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const goToGuideBooking = () => {
    const dest = encodeURIComponent(form.destination || "");
    const lang = encodeURIComponent(form.languageNeed || "");
    navigate(`/guide-booking?destination=${dest}&language=${lang}`);
  };

  return (
    <div className="ai-planner-page">
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold">🤖 AI Trip Planner</h1>
          <p className="text-muted">Enter your travel preferences and get a personalized AI-generated itinerary</p>
          <small className="text-info">💡 Fill in your destination, budget, interests, and dates for a custom plan</small>
        </div>

        <div className="card ai-planner-card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., Manali"
                    required
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label">Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={form.travelDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Budget (INR)</label>
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., 40000"
                    min="0"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Interests</label>
                  <input
                    type="text"
                    name="interests"
                    value={form.interests}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., trekking, food, culture"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Language Need</label>
                  <input
                    type="text"
                    name="languageNeed"
                    value={form.languageNeed}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., Hindi/English"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Companion Preferences</label>
                  <input
                    type="text"
                    name="companionPreferences"
                    value={form.companionPreferences}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., small group, family"
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-success w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Itinerary"}
                  </button>
                </div>
              </div>
            </form>

            {error && <div className="alert alert-warning mt-3">{error}</div>}
          </div>
        </div>

        {plan && (
          <div className="card ai-planner-summary mb-4 shadow-sm border-0 rounded-3">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h3 className="fw-bold mb-0 text-dark">📋 Generated Itinerary</h3>
                {plan.totalEstimatedCost && (
                  <span className="badge bg-success fs-5 py-2 px-3">Est. Budget: ₹{plan.totalEstimatedCost}</span>
                )}
              </div>

              {/* Summary */}
              <div className="mb-4">
                <h5 className="fw-bold text-secondary">Trip Overview</h5>
                <p className="text-muted leading-relaxed">{plan.summary}</p>
              </div>

              {/* Day-wise Plan */}
              {Array.isArray(plan.days) && plan.days.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">📅 Day-by-Day Itinerary</h5>
                  <div className="row g-3">
                    {plan.days.map((d) => (
                      <div key={d.day} className="col-12">
                        <div className="p-3 bg-light rounded-3 border-start border-primary border-4 shadow-xs">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0 text-primary">Day {d.day}: {d.title}</h6>
                            {d.estimatedCost && <span className="badge bg-secondary">Est: ₹{d.estimatedCost}</span>}
                          </div>
                          {Array.isArray(d.activities) && d.activities.length > 0 && (
                            <ul className="mb-0 pl-3">
                              {d.activities.map((a, i) => (
                                <li key={i} className="text-muted small mb-1">{a}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transport Suggestions */}
              {Array.isArray(plan.transportSuggestions) && plan.transportSuggestions.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-primary mb-3 border-bottom pb-2">🚌 Live Transport & Ticket Bookings</h5>
                  <div className="row g-3">
                    {plan.transportSuggestions.map((t, idx) => (
                      <div key={idx} className="col-12 col-md-6">
                        <div className="card h-100 border border-light-subtle shadow-sm rounded-3">
                          <div className="card-body">
                            <span className="badge bg-primary mb-2">{t.type || "Bus"}</span>
                            <h6 className="card-title fw-bold mb-1 text-dark">{t.provider}</h6>
                            <p className="card-text text-muted small mb-2">
                              <strong>Route:</strong> {t.boardingPoint || "N/A"} ➔ {t.dropPoint || "N/A"}
                            </p>
                            <p className="card-text text-muted small mb-3">
                              <strong>Fare:</strong> ₹{t.rate} | <strong>Via:</strong> {t.bookingPlatform}
                            </p>
                            {t.ticketLink && t.ticketLink.startsWith("http") && (
                              <a
                                href={t.ticketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary w-100 fw-bold rounded-2"
                              >
                                Book on {t.bookingPlatform || "Platform"} ➔
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel Suggestions */}
              {Array.isArray(plan.hotelSuggestions) && plan.hotelSuggestions.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-success mb-3 border-bottom pb-2">🏨 Budget Stays & Hostel Suggestions</h5>
                  <div className="row g-3">
                    {plan.hotelSuggestions.map((h, idx) => (
                      <div key={idx} className="col-12 col-md-6">
                        <div className="card h-100 border border-light-subtle shadow-sm rounded-3">
                          <div className="card-body">
                            <h6 className="card-title fw-bold mb-1 text-dark">{h.name}</h6>
                            <p className="card-text text-muted small mb-2">
                              <strong>📍 Location:</strong> {h.location}
                            </p>
                            <p className="card-text text-muted small mb-3">
                              <strong>Est. Price:</strong> ₹{h.ratePerNight}/night
                            </p>
                            {h.link && h.link.startsWith("http") && (
                              <a
                                href={h.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-success w-100 fw-bold rounded-2"
                              >
                                View Deal on {h.bookingPlatform || "Booking"} ➔
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurant Suggestions */}
              {Array.isArray(plan.restaurantSuggestions) && plan.restaurantSuggestions.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-danger mb-3 border-bottom pb-2">🍽️ Cheap Local Restaurants Suggestions</h5>
                  <div className="row g-3">
                    {plan.restaurantSuggestions.map((r, idx) => (
                      <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 border border-light-subtle shadow-sm rounded-3">
                          <div className="card-body">
                            <h6 className="card-title fw-bold mb-1 text-dark">{r.name}</h6>
                            <p className="card-text text-muted small mb-2">
                              <strong>📍 Location:</strong> {r.location}
                            </p>
                            <p className="card-text text-muted small mb-0">
                              <strong>Specialty:</strong> {r.specialty}
                            </p>
                            <span className="badge bg-light text-dark mt-2 border">{r.priceRange || "Budget"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adventure Activities */}
              {Array.isArray(plan.adventureActivities) && plan.adventureActivities.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-info mb-3 border-bottom pb-2">🧗 Adventure Activities & Rates</h5>
                  <div className="row g-3">
                    {plan.adventureActivities.map((a, idx) => (
                      <div key={idx} className="col-12 col-md-6">
                        <div className="card h-100 border border-light-subtle shadow-sm rounded-3">
                          <div className="card-body">
                            <h6 className="card-title fw-bold mb-1 text-dark">{a.activity}</h6>
                            <p className="card-text text-muted small mb-1">
                              <strong>📍 Location:</strong> {a.location}
                            </p>
                            <p className="card-text text-muted small mb-2">
                              <strong>Price:</strong> ₹{a.price}
                            </p>
                            <p className="card-text text-muted small mb-0 text-secondary">
                              {a.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {Array.isArray(plan.checklist) && plan.checklist.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-secondary mb-3 border-bottom pb-2">📋 Packing & Preparation Checklist</h5>
                  <div className="row g-2">
                    {plan.checklist.map((item, idx) => (
                      <div key={idx} className="col-12 col-md-6 d-flex align-items-center">
                        <span className="me-2 text-primary">✔</span>
                        <span className="text-muted small">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guide booking redirect button */}
              <button className="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-6 shadow-sm mt-3" onClick={goToGuideBooking}>
                Need a Local Guide? Book Verified Guides Now ➔
              </button>
            </div>
          </div>
        )}}
      </div>
    </div>
  );
};

export default AITripPlanner;

