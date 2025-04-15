import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const AddInbox = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    user_type: "", // 'user' or 'beneficiary'
    sender_email: "",
    subject: "",
    message: ""
  });
  const [users, setUsers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data using your actual API endpoint
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/user"); // Changed from /auth/me to /user
        setCurrentUser(response.data);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!currentUser) return;

      try {
        // First fetch all users (your API doesn't support role filtering)
        const usersResponse = await axios.get("/users");
        
        // Then filter based on current user's role
        let filteredUsers = usersResponse.data.filter(user => user.id !== currentUser.id);
        
        if (currentUser.role === "admin") {
          filteredUsers = filteredUsers.filter(user => 
            user.role === "subadmin" || user.role === "storekeeper"
          );
        } else if (currentUser.role === "subadmin") {
          filteredUsers = filteredUsers.filter(user => 
            user.role === "admin" || user.role === "storekeeper"
          );
        } else if (currentUser.role === "storekeeper") {
          filteredUsers = filteredUsers.filter(user => 
            user.role === "admin" || user.role === "subadmin"
          );
        }

        // Fetch beneficiaries
        const beneficiariesResponse = await axios.get("/beneficiaries");
        
        setUsers(filteredUsers);
        setBeneficiaries(beneficiariesResponse.data);
      } catch (err) {
        setError("Failed to fetch recipients. Please try again.");
        console.error("Fetch error:", err);
      }
    };
    
    fetchRecipients();
  }, [currentUser]);

  // ... rest of your component remains the same ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        [formData.user_type === 'beneficiary' ? 'beneficiary_id' : 'user_id']: formData.user_id,
        sender_email: formData.sender_email || currentUser?.email
      };

      const res = await axios.post("/inboxes", payload);
      setSuccess("Message sent successfully!");
      setTimeout(() => navigate("/inboxes/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-inbox">
      <h2>Send Message</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient Type</label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Recipient Type</option>
            <option value="user">System User</option>
            <option value="beneficiary">Beneficiary</option>
          </select>
        </div>

        <div className="form-group">
          <label>Recipient</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            disabled={!formData.user_type}
          >
            <option value="">Select {formData.user_type === 'beneficiary' ? 'Beneficiary' : 'User'}</option>
            {formData.user_type === 'beneficiary' ? (
              beneficiaries.map(beneficiary => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} ({beneficiary.contact_info || beneficiary.id})
                </option>
              ))
            ) : (
              users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Your Email</label>
          <input
            type="email"
            name="sender_email"
            value={formData.sender_email || (currentUser?.email || "")}
            onChange={handleChange}
            required
            readOnly={!!currentUser?.email}
          />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default AddInbox;