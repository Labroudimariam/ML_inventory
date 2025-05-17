import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaReply, 
  FaTrash, 
  FaStar, 
  FaRegStar,
  FaEnvelope,
  FaEnvelopeOpen,
  FaCalendarAlt,
  FaUser,
  FaPaperclip
} from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import ErrorAlert from "../alerts/ErrorAlert";
import "./viewInbox.css";

const ViewInbox = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inbox, setInbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to view this message");
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

    const fetchInbox = async () => {
      try {
        const response = await axios.get(`/inboxes/${id}`);
        setInbox(response.data);
        
        // Mark as read if not already read
        if (!response.data.read_at) {
          await axios.put(`/inboxes/${id}/mark-as-read`);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch message");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInbox();
  }, [id]);

  const toggleImportant = async () => {
    if (!inbox) return;
    try {
      await axios.put(`/inboxes/${inbox.id}/toggle-important`, {
        is_important: !inbox.is_important
      });
      setInbox({...inbox, is_important: !inbox.is_important});
    } catch (err) {
      setError("Failed to update importance status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`/inboxes/${id}`);
        navigate(`${basePath}/inboxes/list`);
      } catch (err) {
        setError("Failed to delete message");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} onClose={() => navigate(`${basePath}/inboxes/list`)} />;
  }

  if (!inbox) {
    return null;
  }

  return (
    <div className="view-inbox-container">
      <div className="inbox-header">
        <button 
          onClick={() => navigate(`${basePath}/inboxes/list`)}
          className="btn btn-back"
        >
          <FaArrowLeft /> Back to Inbox
        </button>
        
        <div className="inbox-actions">
          <button
            onClick={() => navigate(`${basePath}/inbox/add`, { state: { replyTo: inbox } })}
            className="btn btn-reply"
          >
            <FaReply /> Reply
          </button>
          <button
            onClick={toggleImportant}
            className="btn btn-important"
          >
            {inbox.is_important ? <FaStar /> : <FaRegStar />}
            {inbox.is_important ? " Important" : " Mark Important"}
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-delete"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="inbox-meta">
        <div className="meta-item">
          <span className="meta-label">
            <FaUser /> From:
          </span>
          <span className="meta-value">{inbox.sender_email}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">
            {inbox.read_at ? <FaEnvelopeOpen /> : <FaEnvelope />} Status:
          </span>
          <span className={`meta-value status-${inbox.read_at ? 'read' : 'unread'}`}>
            {inbox.read_at ? 'Read' : 'Unread'}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">
            <FaCalendarAlt /> Date:
          </span>
          <span className="meta-value">
            {new Date(inbox.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="inbox-subject">
        <h3>{inbox.subject || '(No Subject)'}</h3>
      </div>

      <div className="inbox-content">
        <div className="message-body">
          {inbox.message.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {inbox.attachments && inbox.attachments.length > 0 && (
        <div className="inbox-attachments">
          <h4>
            <FaPaperclip /> Attachments
          </h4>
          <div className="attachment-list">
            {inbox.attachments.map((attachment, index) => (
              <a 
                key={index} 
                href={attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="attachment-item"
              >
                {attachment.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInbox;