import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({
    name: "",
    type: "Sales",
    start_date: "",
    end_date: "",
    filters: "{}",
    user_id: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportRes, usersRes] = await Promise.all([
          axios.get(`/reports/${id}`),
          axios.get("/users"),
        ]);

        setReport({
          ...reportRes.data,
          filters: JSON.stringify(reportRes.data.filters, null, 2),
        });
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (new Date(report.start_date) > new Date(report.end_date)) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/reports/${id}`, {
        ...report,
        filters: JSON.parse(report.filters), // Ensure filters is a valid JSON object
      });
      setSuccess("Report updated successfully!");
      setTimeout(() => navigate("/reports/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !report.id) {
    return <div>Loading report data...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Report</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Report Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={report.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Report Type*</label>
                <select
                  className="form-select"
                  name="type"
                  value={report.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Product">Product</option>
                  <option value="Category">Category</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Beneficiary">Beneficiary</option>
                  <option value="Order">Order</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Start Date*</label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={report.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date*</label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={report.end_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Filters (JSON)</label>
                <textarea
                  className="form-control"
                  name="filters"
                  rows="5"
                  value={report.filters}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Created By*</label>
                <select
                  className="form-select"
                  name="user_id"
                  value={report.user_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Report"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/reports/list")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReport;
