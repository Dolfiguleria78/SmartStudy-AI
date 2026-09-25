import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const GuideHome = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    languages: "",
    destinations: "",
    hourlyRate: "",
    availability: "weekdays",
    bio: "",
  });

  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/guides/profile/mine`, {
      headers,
    });
    setProfile(res.data.profile || null);

    if (res.data.profile) {
      setForm({
        languages: (res.data.profile.languages || []).join(", "),
        destinations: (res.data.profile.destinations || []).join(", "),
        hourlyRate: String(res.data.profile.hourlyRate ?? ""),
        availability: res.data.profile.availability || "weekdays",
        bio: res.data.profile.bio || "",
      });
    }
  };

  const fetchIncoming = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/guides/bookings/incoming`, {
      headers,
    });
    setIncoming(res.data.bookings || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        languages: form.languages,
        destinations: form.destinations,
        hourlyRate: form.hourlyRate,
        availability: form.availability,
        bio: form.bio,
      };

      const res = await axios.post(`${API_BASE_URL}/api/guides/profile`, payload, {
        headers,
      });

      setProfile(res.data.profile || null);
      alert("Profile saved successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  const decideBooking = async (bookingId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/guides/bookings/${bookingId}`, { status }, { headers });
      fetchIncoming();
    } catch (error) {
      console.error(error);
      alert("Could not update booking");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProfile(), fetchIncoming()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🧑‍🏫 Guide Portal</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow p-3 mb-3">
            <h4 className="mb-3">{profile ? "Update Profile" : "Create Guide Profile"}</h4>

            <form onSubmit={saveProfile}>
              <label className="form-label">Languages (comma separated)</label>
              <input
                className="form-control mb-3"
                name="languages"
                value={form.languages}
                onChange={handleChange}
                placeholder="e.g., English, Hindi"
              />

              <label className="form-label">Destinations Covered (comma separated)</label>
              <input
                className="form-control mb-3"
                name="destinations"
                value={form.destinations}
                onChange={handleChange}
                placeholder="e.g., Shimla, Manali, Goa"
              />

              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Hourly Rate (INR)</label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Availability</label>
                  <input
                    className="form-control mb-3"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label className="form-label">Bio</label>
              <textarea
                className="form-control mb-3"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell travellers about your style and expertise."
              />

              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow p-3">
            <h4 className="mb-3">Incoming Booking Requests</h4>

            {incoming.length === 0 ? (
              <p className="text-muted mb-0">No incoming requests yet.</p>
            ) : (
              <div>
                {incoming.map((b) => (
                  <div key={b._id} className="mb-3 p-2" style={{ border: "1px solid #eee", borderRadius: 8 }}>
                    <p className="mb-1">
                      <strong>Traveller:</strong> {b.travellerId?.name}
                    </p>
                    <p className="mb-1">
                      <strong>Destination:</strong> {b.destination}
                    </p>
                    <p className="mb-2">
                      <strong>Language:</strong> {b.language || "N/A"}
                    </p>

                    <p className="mb-2">
                      <strong>Status:</strong>{" "}
                      <span className={b.status === "accepted" ? "text-success fw-bold" : b.status === "rejected" ? "text-danger fw-bold" : "text-muted fw-bold"}>
                        {b.status}
                      </span>
                    </p>

                    {b.status === "pending" ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => decideBooking(b._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => decideBooking(b._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">You already decided on this request.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideHome;

