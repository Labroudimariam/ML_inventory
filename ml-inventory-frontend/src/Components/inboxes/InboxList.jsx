import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaRegTrashAlt,
  FaReply,
  FaStar,
  FaRegStar,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { GrView } from "react-icons/gr";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./inboxList.css";

const InboxList = () => {
  const [inboxes, setInboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [basePath, setBasePath] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inboxesPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to view your inbox");
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

    const fetchInboxes = async () => {
      try {
        const response = await axios.get("/inboxes");
        setInboxes(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchInboxes();
  }, []);

  const filteredInboxes = inboxes.filter((inbox) => {
    // Status filter
    switch (filterStatus) {
      case "read":
        return inbox.read_at;
      case "unread":
        return !inbox.read_at;
      case "important":
        return inbox.is_important;
      default:
        return true; // 'all' option
    }
  });

  // Pagination logic
  const indexOfLastInbox = currentPage * inboxesPerPage;
  const indexOfFirstInbox = indexOfLastInbox - inboxesPerPage;
  const currentInboxes = filteredInboxes.slice(
    indexOfFirstInbox,
    indexOfLastInbox
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`/inboxes/${id}`);
        setInboxes(inboxes.filter((inbox) => inbox.id !== id));
        setSuccess("Message deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete message");
      }
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/inboxes/${id}/mark-as-read`);
      setInboxes(
        inboxes.map((inbox) =>
          inbox.id === id
            ? { ...inbox, read_at: new Date().toISOString() }
            : inbox
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to mark as read");
    }
  };

  const toggleImportant = async (id, currentStatus) => {
    try {
      await axios.put(`/inboxes/${id}/toggle-important`, {
        is_important: !currentStatus,
      });
      setInboxes(
        inboxes.map((inbox) =>
          inbox.id === id ? { ...inbox, is_important: !currentStatus } : inbox
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update importance");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="inbox-container">
      {/* Success and Error Alerts */}
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="inbox-header">
        <h2>Inbox</h2>
        <div className="inbox-controls">
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Messages</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
              <option value="important">Important</option>
            </select>
          </div>
          <Link to={`${basePath}/inbox/add`} className="btn btn-primary">
            <FaPlus /> New Message
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="inbox-table">
          <thead>
            <tr>
              <th>Importance</th>
              <th>Sender</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInboxes.length > 0 ? (
              currentInboxes.map((inbox) => (
                <tr
                  key={inbox.id}
                  className={`${inbox.read_at ? "read" : "unread"} ${
                    inbox.is_important ? "important" : ""
                  }`}
                >
                  <td>
                    <button
                      onClick={() =>
                        toggleImportant(inbox.id, inbox.is_important)
                      }
                      className="btn-important"
                    >
                      {inbox.is_important ? (
                        <FaStar className="starred" />
                      ) : (
                        <FaRegStar />
                      )}
                    </button>
                  </td>
                  <td>{inbox.sender_email}</td>
                  <td>
                      {inbox.subject || "(No Subject)"}
                  </td>
                  <td>{new Date(inbox.created_at).toLocaleString()}</td>
                  <td>
                    {inbox.read_at ? (
                      <span className="status-badge read">
                        <FaEnvelopeOpen /> Read
                      </span>
                    ) : (
                      <span className="status-badge unread">
                        <FaEnvelope /> Unread
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/inbox/view/${inbox.id}`}
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => !inbox.read_at && markAsRead(inbox.id)}
                      >
                        <GrView />
                      </Link>
                      <Link
                        to={`${basePath}/inbox/add`}
                        state={{ replyTo: inbox }}
                        className="btn btn-sm btn-outline-info"
                      >
                        <FaReply />
                      </Link>
                      <button
                        onClick={() => handleDelete(inbox.id)}
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
                <td colSpan="6" className="no-messages">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredInboxes.length > inboxesPerPage && (
        <nav className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
            </li>

            {Array.from({
              length: Math.ceil(filteredInboxes.length / inboxesPerPage),
            }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage ===
                Math.ceil(filteredInboxes.length / inboxesPerPage)
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredInboxes.length / inboxesPerPage)
                }
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

export default InboxList;
