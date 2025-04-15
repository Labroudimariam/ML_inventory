import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { Link } from "react-router-dom";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin' && user?.role !== 'subadmin') {
      setError("You don't have permission to view reports");
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get("/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error.response || error.message);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`/reports/${id}`);
        setReports(reports.filter((report) => report.id !== id));
      } catch (error) {
        setError("Failed to delete report.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="report-list">
      <h2>Reports</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date Range</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.type}</td>
                <td>
                  {formatDate(report.start_date)} to {formatDate(report.end_date)}
                </td>
                <td>{report.user?.name || 'N/A'}</td>
                <td>{new Date(report.created_at).toLocaleString()}</td>
                <td>
                  <Link to={`/report/view/${report.id}`}>View</Link> |{" "}
                  <Link to={`/report/edit/${report.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(report.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/report/add" className="btn">Create New Report</Link>
    </div>
  );
};

export default ReportList;