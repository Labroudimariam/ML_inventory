import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./beneficiaryDetails.css";

const BeneficiaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
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

    const fetchBeneficiary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/beneficiaries/${id}`);
        setBeneficiary(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch beneficiary details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!beneficiary) {
    return (
      <ErrorAlert
        message="Beneficiary not found"
        onClose={() => navigate(`${basePath}/beneficiaries/list`)}
      />
    );
  }

  return (
    <div className="beneficiary-details-container">
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="beneficiary-details-header">
        <h2>Beneficiary Details: {beneficiary.name}</h2>
      </div>

      <div className="beneficiary-details-content">
        <div className="details-section">
          <h3>Personal Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{beneficiary.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{beneficiary.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{beneficiary.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">AI Count:</span>
              <span className="detail-value">
                {beneficiary.nombre_insemination_artificielle}
              </span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Address Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{beneficiary.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City:</span>
              <span className="detail-value">{beneficiary.city}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">State:</span>
              <span className="detail-value">{beneficiary.state}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Country:</span>
              <span className="detail-value">{beneficiary.country}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Postal Code:</span>
              <span className="detail-value">
                {beneficiary.postal_code || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {beneficiary.additional_info && (
          <div className="details-section">
            <h3>Additional Information</h3>
            <div className="additional-info-content">
              {beneficiary.additional_info}
            </div>
          </div>
        )}

        <div className="details-actions">
          <Link
            to={`${basePath}/beneficiaries/edit/${beneficiary.id}`}
            className="btn btn-primary"
          >
            Edit Beneficiary
          </Link>
          <button
            onClick={() => navigate(`${basePath}/beneficiaries/list`)}
            className="btn btn-secondary"
          >
            Back to Beneficiaries
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetails;
