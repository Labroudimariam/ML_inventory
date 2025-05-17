import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaDownload,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaInfoCircle,
} from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import ErrorAlert from "../alerts/ErrorAlert";
import "./viewReport.css";

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [basePath, setBasePath] = useState("");
  const [activeTab, setActiveTab] = useState("filters");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to view this report");
      setLoading(false);
      return;
    }

    // Set base path based on user role
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

    const fetchReport = async () => {
      try {
        const response = await axios.get(`/reports/${id}`);
        setReport(response.data);
      } catch (error) {
        console.error(
          "Error fetching report:",
          error.response || error.message
        );
        setError(error.response?.data?.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = () => {
    switch (report?.status) {
      case "pending":
        return <FaExclamationTriangle className="icon-warning" />;
      case "processing":
        return <FaSpinner className="icon-info spin" />;
      case "completed":
        return <FaCheckCircle className="icon-success" />;
      case "failed":
        return <FaTimesCircle className="icon-danger" />;
      default:
        return null;
    }
  };

  const getFormatIcon = () => {
    switch (report?.format) {
      case "pdf":
        return <FaFilePdf className="icon-pdf" />;
      case "excel":
        return <FaFileExcel className="icon-excel" />;
      case "csv":
        return <FaFileCsv className="icon-csv" />;
      default:
        return <FaFileAlt className="icon-default" />;
    }
  };

  if (loading && !report) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorAlert
        message={error}
        onClose={() => navigate(`${basePath}/reports/list`)}
      />
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="view-report-container">
      <div className="report-header">
                  <h1 className="report-title">{report.name}</h1>

        <div className="report-buttons-container">
          <button
            onClick={() => navigate(`${basePath}/reports/list`)}
            className="btn btn-back"
          >
            Back to Reports
          </button>
          {report.file_path && report.status === "completed" && (
            <a
              href={report.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-download"
            >
              <FaDownload /> Download Report
            </a>
          )}
        </div>
      </div>

      <div className="report-metadata-grid">
        <div className="metadata-card">
          <div className="metadata-icon">{getStatusIcon()}</div>
          <div>
            <div className="metadata-label">Status</div>
            <div className={`metadata-value status-${report.status}`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </div>
          </div>
        </div>

        <div className="metadata-card">
          <div>
            <div className="metadata-label">Type</div>
            <div className="metadata-value">{report.type}</div>
          </div>
        </div>

        <div className="metadata-card">
          <div>
            <div className="metadata-label">Date Range</div>
            <div className="metadata-value">
              {formatDate(report.start_date)} - {formatDate(report.end_date)}
            </div>
          </div>
        </div>

        <div className="metadata-card">
          <div>
            <div className="metadata-label">Created By</div>
            <div className="metadata-value">
              {report.user ? report.user.name : "System"}
            </div>
          </div>
        </div>

        <div className="metadata-card">
          <div>
            <div className="metadata-label">Created At</div>
            <div className="metadata-value">
              {formatDateTime(report.created_at)}
            </div>
          </div>
        </div>

        {report.format && (
          <div className="metadata-card">
            <div className="metadata-icon">{getFormatIcon()}</div>
            <div>
              <div className="metadata-label">Format</div>
              <div className="metadata-value">
                {report.format.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>

      {report.description && (
        <div className="description-section">
          <h3 className="section-title">Description</h3>
          <div className="description-content">{report.description}</div>
        </div>
      )}

      <div className="data-section">
        <div className="section-tabs">
          <button
            className={`tab-btn ${activeTab === "filters" ? "active" : ""}`}
            onClick={() => setActiveTab("filters")}
          >
            Filters Applied
          </button>
          <button
            className={`tab-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            Report Data
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "filters" ? (
            <div className="json-viewer">
              {report.filters && Object.keys(report.filters).length > 0 ? (
                <pre>{JSON.stringify(report.filters, null, 2)}</pre>
              ) : (
                <div className="no-data-message">
                  No filters were applied to this report
                </div>
              )}
            </div>
          ) : (
            <div className="json-viewer">
              {report.data ? (
                <pre>{JSON.stringify(report.data, null, 2)}</pre>
              ) : (
                <div className="no-data-message">
                  No data available for this report
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
