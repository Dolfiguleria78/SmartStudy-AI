import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LoanRequests = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/loans/requests`, { headers });
    setLeads(res.data.leads || []);
  };

  const updateDecision = async (leadId, status) => {
    await axios.put(
      `${API_BASE_URL}/api/loans/lead/${leadId}`,
      { status },
      { headers }
    );
    fetchRequests();
  };

  useEffect(() => {
    setLoading(true);
    fetchRequests().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Loan Requests</h2>

      {loading ? (
        <p className="text-muted text-center">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="text-muted text-center">No active loan requests.</p>
      ) : (
        <div className="row">
          {leads.map(({ lead, myDecision }) => {
            const decisionStatus = myDecision?.status || null;
            const canDecide = !decisionStatus || decisionStatus === "pending";

            return (
              <div className="col-md-6 mb-3" key={lead._id}>
                <div className="card shadow p-3 h-100">
                  <p className="mb-1">
                    <strong>Destination:</strong> {lead.destination}
                  </p>
                  <p className="mb-1">
                    <strong>Requested:</strong> ₹{lead.requestedAmount}
                  </p>
                  <p className="mb-1">
                    <strong>Urgency:</strong> {lead.urgency}
                  </p>
                  <p className="mb-2 text-muted" style={{ whiteSpace: "pre-wrap" }}>
                    {lead.details ? lead.details : "No extra details provided."}
                  </p>

                  <p className="mb-3">
                    <strong>Your Decision:</strong>{" "}
                    <span className="text-muted">{decisionStatus || "Not decided"}</span>
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      disabled={!canDecide || decisionStatus === "accepted"}
                      onClick={() => updateDecision(lead._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={!canDecide || decisionStatus === "rejected"}
                      onClick={() => updateDecision(lead._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoanRequests;

