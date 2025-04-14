import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { Link } from "react-router-dom";

const BeneficiaryList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin' && user?.role !== 'subadmin' && user?.role !== 'storekeeper') {
      setError("You don't have permission to view beneficiaries");
      return;
    }

    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get("/beneficiaries");
        setBeneficiaries(response.data);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error.response || error.message);
        setError("Failed to fetch beneficiaries.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBeneficiaries();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this beneficiary?")) {
      try {
        await axios.delete(`/beneficiaries/${id}`);
        setBeneficiaries(beneficiaries.filter((beneficiary) => beneficiary.id !== id));
      } catch (error) {
        setError("Failed to delete beneficiary.");
      }
    }
  };

  return (
    <div className="beneficiary-list">
      <h2>Beneficiaries</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id}>
                <td>{beneficiary.name}</td>
                <td>{beneficiary.email}</td>
                <td>{beneficiary.phone}</td>
                <td>{beneficiary.gender}</td>
                <td>{beneficiary.city}</td>
                <td>{beneficiary.country}</td>
                <td>
                  <Link to={`/beneficiary/edit/${beneficiary.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(beneficiary.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/beneficiary/add" className="btn">Add New Beneficiary</Link>
    </div>
  );
};

export default BeneficiaryList;