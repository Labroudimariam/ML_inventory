import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaPlus, FaRegEdit, FaRegTrashAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./beneficiaryList.css";

const BeneficiaryList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [beneficiariesPerPage] = useState(4); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
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

    if (!["admin", "subadmin", "storekeeper"].includes(user?.role)) {
      setError("You don't have permission to view beneficiaries");
      setLoading(false);
      return;
    }

    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get("/beneficiaries");
        setBeneficiaries(response.data);
        setSuccess("Beneficiaries loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch beneficiaries");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBeneficiaries();
  }, []);

  // Get current beneficiaries
  const indexOfLastBeneficiary = currentPage * beneficiariesPerPage;
  const indexOfFirstBeneficiary = indexOfLastBeneficiary - beneficiariesPerPage;
  const currentBeneficiaries = beneficiaries.slice(indexOfFirstBeneficiary, indexOfLastBeneficiary);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this beneficiary?")) {
      try {
        await axios.delete(`/beneficiaries/${id}`);
        setBeneficiaries(beneficiaries.filter((beneficiary) => beneficiary.id !== id));
        setSuccess("Beneficiary deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete beneficiary");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="beneficiary-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="beneficiary-list-header">
        <h2>Beneficiaries</h2>
        <div className="header-controls">
          <Link to={`${basePath}/beneficiaries/add`} className="btn btn-primary add-beneficiary-btn">
            <FaPlus /> Add Beneficiary
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="beneficiary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City/State</th>
              <th>Country</th>
              <th>AI Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBeneficiaries.length > 0 ? (
              currentBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td>{beneficiary.name}</td>
                  <td>{beneficiary.email}</td>
                  <td>{beneficiary.phone}</td>
                  <td>
                    {beneficiary.city}, {beneficiary.state}
                  </td>
                  <td>{beneficiary.country}</td>
                  <td className="text-center">
                    {beneficiary.nombre_insemination_artificielle}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/beneficiaries/edit/${beneficiary.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaRegEdit />
                      </Link>
                      <Link
                        to={`${basePath}/beneficiaries/details/${beneficiary.id}`}
                        className="btn btn-sm btn-outline-info"
                      >
                        <GrView />
                      </Link>
                      <button
                        onClick={() => handleDelete(beneficiary.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No beneficiaries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {beneficiaries.length > beneficiariesPerPage && (
        <nav className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
            </li>
            
            {Array.from({ length: Math.ceil(beneficiaries.length / beneficiariesPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(beneficiaries.length / beneficiariesPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(beneficiaries.length / beneficiariesPerPage)}
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

export default BeneficiaryList;