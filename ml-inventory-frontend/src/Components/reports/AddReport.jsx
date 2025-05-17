import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { 
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaFilter,
  FaPlus,
  FaMinus
} from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./reportForm.css";

const AddReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "Product",
    start_date: "",
    end_date: "",
    format: "pdf",
    description: "",
    filters: {},
    status: "pending",
    user_id: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      return;
    }

    // Set base path based on user role
    switch(user.role.toLowerCase()) {
      case 'admin': 
        setBasePath('/admin-dashboard');
        break;
      case 'subadmin': 
        setBasePath('/subadmin-dashboard');
        break;
      case 'storekeeper': 
        setBasePath('/storekeeper-dashboard');
        break;
      default:
        setBasePath('');
    }

    // Set user_id in form data
    setFormData(prev => ({ ...prev, user_id: user.id }));
  }, []);

  const reportTypes = [
    "Product", "Category", "Inventory", 
    "Beneficiary", "Warehouse", "Order"
  ];

  const formats = [
    { value: "pdf", label: "PDF", icon: <FaFilePdf /> },
    { value: "excel", label: "Excel", icon: <FaFileExcel /> },
    { value: "csv", label: "CSV", icon: <FaFileCsv /> }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFilter = () => {
    if (filterKey && filterValue) {
      setFormData(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          [filterKey]: filterValue
        }
      }));
      setFilterKey("");
      setFilterValue("");
    }
  };

  const handleRemoveFilter = (key) => {
    const newFilters = { ...formData.filters };
    delete newFilters[key];
    setFormData(prev => ({ ...prev, filters: newFilters }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate dates
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/reports", {
        ...formData,
        filters: formData.filters
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Report created successfully!");
      setTimeout(() => {
        navigate(`${basePath}/reports/list`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Generate New Report</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Report Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter report name"
            />
          </div>

          <div className="form-group">
            <label>Report Type*</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {reportTypes.map(type => (
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
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date*</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Output Format*</label>
          <div className="format-options">
            {formats.map(format => (
              <div key={format.value} className="format-option">
                <input
                  type="radio"
                  id={`format-${format.value}`}
                  name="format"
                  value={format.value}
                  checked={formData.format === format.value}
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
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map(option => (
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
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter report description (optional)"
          />
        </div>

        <div className="form-actions">

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              "Generate Report"
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

export default AddReport;