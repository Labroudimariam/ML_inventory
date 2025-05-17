import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./reportForm.css";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({
    name: "",
    type: "Product",
    start_date: "",
    end_date: "",
    format: "pdf",
    description: "",
    filters: {},
    status: "pending",
    user_id: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");

  const reportTypes = [
    "Product",
    "Category",
    "Inventory",
    "Beneficiary",
    "Warehouse",
    "Order",
  ];

  const formats = [
    { value: "pdf", label: "PDF", icon: <FaFilePdf /> },
    { value: "excel", label: "Excel", icon: <FaFileExcel /> },
    { value: "csv", label: "CSV", icon: <FaFileCsv /> },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      return;
    }

    // Set base path by role
    switch (user.role.toLowerCase()) {
      case "admin":
        setBasePath("/admin-dashboard");
        break;
      case "subadmin":
        setBasePath("/subadmin-dashboard");
        break;
      case "storekeeper":
        setBasePath("/storekeeper-dashboard");
        break;
      default:
        setBasePath("");
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportRes, usersRes] = await Promise.all([
          axios.get(`/reports/${id}`),
          axios.get("/users"),
        ]);

        setReport({
          ...reportRes.data,
          filters: reportRes.data.filters || {},
        });
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
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
      await axios.put(`/reports/${id}`, report);
      setSuccess("Report updated successfully!");
      setTimeout(() => {
        navigate(`${basePath}/reports/list`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !report.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="report-form-container">
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2> Edit Report</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Report Name*</label>
            <input
              type="text"
              name="name"
              value={report.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Report Type*</label>
            <select
              name="type"
              value={report.type}
              onChange={handleChange}
              required
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date*</label>
            <input
              type="date"
              name="start_date"
              value={report.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date*</label>
            <input
              type="date"
              name="end_date"
              value={report.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Output Format*</label>
          <div className="format-options">
            {formats.map((format) => (
              <div key={format.value} className="format-option">
                <input
                  type="radio"
                  id={`format-${format.value}`}
                  name="format"
                  value={format.value}
                  checked={report.format === format.value}
                  onChange={handleChange}
                  required
                />
                <label htmlFor={`format-${format.value}`}>
                  {format.icon}
                  <span>{format.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={report.status} onChange={handleChange}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={report.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>User*</label>
          <select
            name="user_id"
            value={report.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              <>Update Report</>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/reports/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReport;
