import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaPaperPlane, 
  FaTimes, 
  FaUser, 
  FaUsers, 
  FaEnvelope,
  FaEdit,
  FaReply,
} from "react-icons/fa";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import LoadingSpinner from "../loading/Loading";
import "./addInbox.css";

const AddInbox = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    user_type: "user",
    sender_email: "",
    subject: "",
    message: "",
    reply_to_id: null
  });
  const [users, setUsers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState("");
  const [isReply, setIsReply] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to send messages");
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

    // Check if this is a reply
    if (location.state?.replyTo) {
      const replyTo = location.state.replyTo;
      setIsReply(true);
      setFormData(prev => ({
        ...prev,
        user_id: replyTo.sender_email.includes('@') ? '' : replyTo.user_id,
        user_type: replyTo.sender_email.includes('@') ? 'beneficiary' : 'user',
        sender_email: user.email,
        subject: `Re: ${replyTo.subject || 'No Subject'}`,
        reply_to_id: replyTo.id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sender_email: user.email
      }));
    }

    setCurrentUser(user);
  }, [location.state]);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const [usersRes, beneficiariesRes] = await Promise.all([
          axios.get("/users"),
          axios.get("/beneficiaries")
        ]);

        // Filter users based on current user's role
        let filteredUsers = usersRes.data.filter(user => user.id !== currentUser.id);

        if (currentUser.role === "admin") {
          filteredUsers = filteredUsers.filter(
            user => ["subadmin", "storekeeper"].includes(user.role)
          );
        } else if (currentUser.role === "subadmin") {
          filteredUsers = filteredUsers.filter(
            user => ["admin", "storekeeper"].includes(user.role)
          );
        } else if (currentUser.role === "storekeeper") {
          filteredUsers = filteredUsers.filter(
            user => ["admin", "subadmin"].includes(user.role)
          );
        }

        setUsers(filteredUsers);
        setBeneficiaries(beneficiariesRes.data);
      } catch (err) {
        setError("Failed to fetch recipients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, [currentUser]);

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
        [formData.user_type === "beneficiary" ? "beneficiary_id" : "user_id"]: formData.user_id,
        sender_email: formData.sender_email || currentUser?.email
      };

      if (formData.reply_to_id) {
        payload.reply_to_id = formData.reply_to_id;
      }

      await axios.post("/inboxes", payload);
      setSuccess("Message sent successfully!");
      setTimeout(() => navigate(`${basePath}/inboxes/list`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.sender_email) {
    return <LoadingSpinner />;
  }

  return (
    <div className="add-inbox-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="add-inbox-header">
        <h2>
          {isReply ? <FaReply /> : <FaEnvelope />} 
          {isReply ? " Reply to Message" : " Compose New Message"}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="add-inbox-form-row">
          <div className="add-inbox-form-group">
            <label>
              <FaUsers /> Recipient Type*
            </label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              required
              disabled={isReply}
              className="add-inbox-form-control"
            >
              <option value="user">System User</option>
              <option value="beneficiary">Beneficiary</option>
            </select>
          </div>

          <div className="add-inbox-form-group">
            <label>
              <FaUser /> Recipient*
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              disabled={isReply && formData.user_id}
              className="add-inbox-form-control"
            >
              <option value="">Select {formData.user_type === "beneficiary" ? "Beneficiary" : "User"}</option>
              {formData.user_type === "beneficiary" ? (
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
        </div>

        <div className="add-inbox-form-row">
          <div className="add-inbox-form-group">
            <label>
              <FaEnvelope /> Your Email*
            </label>
            <input
              type="email"
              name="sender_email"
              value={formData.sender_email}
              onChange={handleChange}
              required
              readOnly={!!currentUser?.email}
              className="add-inbox-form-control"
            />
          </div>

          <div className="add-inbox-form-group">
            <label>
              <FaEdit /> Subject*
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="add-inbox-form-control"
            />
          </div>
        </div>

        <div className="add-inbox-form-group">
          <label>Message*</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Write your message here..."
            className="add-inbox-form-control add-inbox-textarea"
          />
        </div>

        <div className="add-inbox-form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"} <FaPaperPlane />
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/inboxes/list`)}
            className="btn btn-secondary"
          >
            Cancel <FaTimes />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInbox;