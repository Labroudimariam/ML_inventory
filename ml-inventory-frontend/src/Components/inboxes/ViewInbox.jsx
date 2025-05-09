import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, useNavigate } from "react-router-dom";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const ViewInbox = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inbox, setInbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const response = await axios.get(`/inboxes/${id}`);
        setInbox(response.data);
        
        // Mark as read if not already read
        if (!response.data.read_at) {
          await axios.put(`/inboxes/${id}/mark-as-read`);
        }
      } catch (err) {
        setError("Failed to fetch message details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInbox();
  }, [id]);

  if (loading) {
    return <div>Loading message...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-inbox">
           <NavbarTop />
            <Navbar />
      <h2>Message Details</h2>
      
      <div className="inbox-details">
        <div className="detail-row">
          <strong>From:</strong> {inbox.sender_email}
        </div>
        <div className="detail-row">
          <strong>Subject:</strong> {inbox.subject || "(No Subject)"}
        </div>
        <div className="detail-row">
          <strong>Date:</strong> {new Date(inbox.created_at).toLocaleString()}
        </div>
        <div className="detail-row">
          <strong>Status:</strong> {inbox.read_at ? 'Read' : 'Unread'}
        </div>
        <div className="message-content">
          <strong>Message:</strong>
          <p>{inbox.message}</p>
        </div>
      </div>

      <button onClick={() => navigate("/inboxes/list")}>Back to Inbox</button>
    </div>
  );
};

export default ViewInbox;