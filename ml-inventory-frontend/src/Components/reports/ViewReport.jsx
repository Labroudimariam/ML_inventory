import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams } from "react-router-dom";

const ViewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/reports/${id}`);
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error.response || error.message);
        setError("Failed to fetch report.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReport();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading report...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-report">
      <h2>{report.name}</h2>
      <div className="report-meta">
        <p><strong>Type:</strong> {report.type}</p>
        <p><strong>Date Range:</strong> {formatDate(report.start_date)} to {formatDate(report.end_date)}</p>
        <p><strong>Created By:</strong> {report.user?.name || 'N/A'}</p>
        <p><strong>Created At:</strong> {new Date(report.created_at).toLocaleString()}</p>
      </div>

      <div className="report-filters">
        <h3>Filters</h3>
        <pre>{JSON.stringify(report.filters, null, 2)}</pre>
      </div>

      <div className="report-data">
        <h3>Report Data</h3>
        {report.data ? (
          <pre>{JSON.stringify(report.data, null, 2)}</pre>
        ) : (
          <p>No data available for this report.</p>
        )}
      </div>
    </div>
  );
};

export default ViewReport;