import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaPlus,
  FaFileAlt,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { Dropdown } from "react-bootstrap";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./reportList.css";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("all");
  const [basePath, setBasePath] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(4);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to view reports");
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

    if (!["admin", "subadmin"].includes(user?.role)) {
      setError("You don't have permission to view reports");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get("/reports");
        setReports(response.data);
        setFilteredReports(response.data);
        setSuccess("Reports loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!activeFilter) {
      setFilteredReports(reports);
      setCurrentPage(1);
      return;
    }

    let result = [...reports];

    if (filterValue === "all") {
      setFilteredReports(reports);
      setCurrentPage(1);
      return;
    }

    if (activeFilter === "status") {
      result = result.filter((report) => report.status === filterValue);
    } else if (activeFilter === "type") {
      result = result.filter((report) => report.type === filterValue);
    }

    setFilteredReports(result);
    setCurrentPage(1);
  }, [activeFilter, filterValue, reports]);

  // Get current reports
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setFilterValue("all");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const resetFilters = () => {
    setActiveFilter(null);
    setFilterValue("all");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`/report/${id}`);
        setReports(reports.filter((report) => report.id !== id));
        setSuccess("Report deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete report");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge-warning",
      processing: "badge-info",
      completed: "badge-success",
      failed: "badge-danger",
    };

    const statusIcons = {
      pending: <FaSpinner className="mr-1" />,
      processing: <FaSpinner className="mr-1 spin" />,
      completed: <FaCheckCircle className="mr-1" />,
      failed: <FaTimesCircle className="mr-1" />,
    };

    return (
      <span className={`badge ${statusClasses[status]}`}>
        {statusIcons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case "pdf":
        return <FaFilePdf className="text-danger" />;
      case "excel":
        return <FaFileExcel className="text-success" />;
      case "csv":
        return <FaFileCsv className="text-primary" />;
      default:
        return <FaFileAlt />;
    }
  };

  const renderFilterInput = () => {
    if (!activeFilter) return null;

    if (activeFilter === "status") {
      return (
        <select
          className="filter-select"
          value={filterValue}
          onChange={handleFilterValueChange}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      );
    }

    if (activeFilter === "type") {
      return (
        <select
          className="filter-select"
          value={filterValue}
          onChange={handleFilterValueChange}
        >
          <option value="all">All Types</option>
          <option value="Product">Product</option>
          <option value="Category">Category</option>
          <option value="Inventory">Inventory</option>
          <option value="Beneficiary">Beneficiary</option>
          <option value="Warehouse">Warehouse</option>
          <option value="Order">Order</option>
        </select>
      );
    }

    return null;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="report-list-container">
      {/* Success and Error Alerts */}
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="report-list-header">
        <h2>Reports Management</h2>
        <div className="header-controls">
          <div className="filter-container">
            <div className="filter-group">
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="filter-toggle">
                  {activeFilter ? `Filter by ${activeFilter}` : "Filter by"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="filter-menu">
                  <Dropdown.Item onClick={() => handleFilterSelect("status")}>
                    Status
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterSelect("type")}>
                    Type
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={resetFilters}>
                    Clear Filters
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {renderFilterInput()}
            </div>
          </div>
          <Link
            to={`${basePath}/reports/add`}
            className="btn btn-primary add-report-btn"
          >
            <FaPlus /> Generate Report
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Format</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>{report.type}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    {report.format ? (
                      <span className="format-icon">
                        {getFormatIcon(report.format)}
                        {report.format.toUpperCase()}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{report.user?.name || "System"}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/reports/edit/${report.id}`}
                        className="btn btn-sm btn-outline-primary"
                        disabled={report.status === "processing"}
                      >
                        <FaRegEdit />
                      </Link>
                      <Link
                        to={`${basePath}/reports/view/${report.id}`}
                        className="btn btn-sm btn-outline-info"
                      >
                        <GrView />
                      </Link>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={report.status === "processing"}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-reports-message">
                  No reports found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredReports.length > reportsPerPage && (
        <nav className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
            </li>

            {Array.from({
              length: Math.ceil(filteredReports.length / reportsPerPage),
            }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage ===
                Math.ceil(filteredReports.length / reportsPerPage)
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredReports.length / reportsPerPage)
                }
              >
                <FaChevronRight />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ReportList;
