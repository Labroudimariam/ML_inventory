import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const InboxList = () => {
  const [inboxes, setInboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError("You need to login first");
          return;
        }
        
        const response = await axios.get("/inboxes");
        console.log("API Response:", response.data); // Add this line
        setInboxes(response.data);
      } catch (error) {
        console.error("Error fetching inboxes:", error.response || error.message);
        setError("Failed to fetch inbox messages.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInboxes();
  }, []);

  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`/inboxes/${id}`);
        setInboxes(inboxes.filter((inbox) => inbox.id !== id));
      } catch (error) {
        setError("Failed to delete message.");
      }
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/inboxes/${id}/mark-as-read`);
      setInboxes(inboxes.map(inbox => 
        inbox.id === id ? {...inbox, read_at: new Date().toISOString()} : inbox
      ));
    } catch (error) {
      setError("Failed to mark as read.");
    }
  };

  return (
    <div className="inbox-list">
      <h2>Inbox Messages</h2>
      <Navbar />
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inboxes.map((inbox) => (
              <tr key={inbox.id} className={inbox.read_at ? '' : 'unread'}>
                <td>{inbox.sender_email}</td>
                <td>{inbox.subject}</td>
                <td>{inbox.message.length > 50 ? `${inbox.message.substring(0, 50)}...` : inbox.message}</td>
                <td>{inbox.read_at ? 'Read' : 'Unread'}</td>
                <td>{new Date(inbox.created_at).toLocaleString()}</td>
                <td>
                  <Link to={`/inbox/view/${inbox.id}`}>View</Link> |{" "}
                  {!inbox.read_at && (
                    <button onClick={() => markAsRead(inbox.id)}>Mark as Read</button>
                  )} |{" "}
                  <button onClick={() => handleDelete(inbox.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        <Link to="/inbox/add">Send New Message</Link>
    </div>
  );
};

export default InboxList;