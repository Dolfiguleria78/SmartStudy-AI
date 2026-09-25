import React, { useEffect, useState } from "react";
import api from "../lib/api";

const BudgetIssue = () => {
  const [form, setForm] = useState({
    destination: "",
    requestedAmount: "",
    urgency: "medium",
    details: "",
  });

  const [matches, setMatches] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMatches = async () => {
    const res = await api.get("/loans/matches");
    setMatches(res.data.data || []);
  };

  const fetchLeads = async () => {
    const res = await api.get("/loans/leads");
    setLeads(res.data.data || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post(
        "/loans/leads",
        {
          destination: form.destination,
          requestedAmount: form.requestedAmount,
          urgency: form.urgency,
          details: form.details,
        }
      );

      await fetchLeads();
      await fetchMatches();
      setMessage("Budget issue submitted. Banks and NBFC partners can now review it.");
      setForm({ destination: "", requestedAmount: "", urgency: "medium", details: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting budget issue");
    } finally {
      setLoading(false);
    }
  };

  const closeLead = async (leadId) => {
    try {
      await api.put(`/loans/leads/${leadId}/close`);
      await fetchLeads();
      await fetchMatches();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not close lead");
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="h2 fw-bold">💰 Budget Issues - Get Travel Loans</h1>
        <p className="text-muted">Facing budget constraints? Apply for travel loans and connect with trusted banks and NBFC partners.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-4">Request Loan Assistance</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    className="form-control"
                    placeholder="e.g., Shimla"
                    value={form.destination}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Requested Loan Amount (₹)</label>
                  <input
                    type="number"
                    name="requestedAmount"
                    className="form-control"
                    placeholder="e.g., 50000"
                    value={form.requestedAmount}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Urgency Level</label>
                  <select
                    name="urgency"
                    className="form-select"
                    value={form.urgency}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Additional Details</label>
                  <textarea
                    name="details"
                    className="form-control"
                    placeholder="Tell us more about your trip and budget requirements..."
                    value={form.details}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit & Find Banks"}
                </button>
              </form>

              {message && (
                <div className="alert alert-info mt-3">{message}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-4">My Budget Requests</h2>

              {leads.length === 0 ? (
                <p className="text-muted text-center py-4">No requests yet.</p>
              ) : (
                <div className="list-group">
                  {leads.map((lead) => (
                    <div key={lead._id} className="list-group-item mb-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <strong>{lead.destination}</strong>
                        <span className={`badge text-bg-${lead.status === "open" ? "success" : "secondary"}`}>{lead.status}</span>
                      </div>
                      <p className="mb-1">Amount: ₹{lead.requestedAmount}</p>
                      <p className="mb-2">Urgency: {lead.urgency}</p>
                      {lead.status !== "closed" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => closeLead(lead._id)}
                        >
                          Close Request
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-semibold mb-4">Matched Banks & Offers</h2>
          {matches.length === 0 ? (
            <p className="text-muted text-center py-4">No matches yet. Submit your lead and wait for bank responses.</p>
          ) : (
            <div className="row gy-3">
              {matches.map((m) => (
                <div key={m._id} className="col-12 col-md-6">
                  <div className="card h-100 border-secondary">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-semibold mb-0">{m.bankId?.name || "Bank"}</h6>
                        <span className={`badge text-bg-${m.status === "accepted" ? "success" : m.status === "rejected" ? "danger" : "warning"}`}>{m.status}</span>
                      </div>
                      <p className="mb-1">Destination: {m.leadId?.destination}</p>
                      <p className="mb-2">Requested: ₹{m.leadId?.requestedAmount}</p>
                      {m.status === "accepted" && m.offerTerms ? (
                        <p className="text-success">Offer: {m.offerTerms}</p>
                      ) : (
                        <p className="text-muted small">{m.status === "pending" ? "Waiting for bank response" : "Application in process"}</p>
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

export default BudgetIssue;

