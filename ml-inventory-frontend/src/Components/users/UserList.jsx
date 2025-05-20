import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaRegEdit, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { Dropdown } from 'react-bootstrap';
import "./userList.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user?.role !== "admin") {
      setError("You don't have permission to view users");
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
        setSuccess("Users loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!activeFilter) {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }

    let result = [...users];
    
    if (filterValue === "all") {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }
    
    if (activeFilter === "role") {
      result = result.filter(user => user.role === filterValue);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [activeFilter, filterValue, users]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setFilterValue("all");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const resetFilters = () => {
    setActiveFilter(null);
    setFilterValue("all");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        setSuccess("User deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      "admin": "badge-primary",
      "subadmin": "badge-info",
      "storekeeper": "badge-warning",
      "driver": "badge-secondary"
    };
    return <span className={`badge ${roleClasses[role]}`}>{role}</span>;
  };

  const renderFilterInput = () => {
    if (!activeFilter) return null;

    if (activeFilter === "role") {
      return (
        <select
          className="filter-select"
          value={filterValue}
          onChange={handleFilterValueChange}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="subadmin">Subadmin</option>
          <option value="storekeeper">Storekeeper</option>
          <option value="user">User</option>
        </select>
      );
    }

    return null;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="user-list-header">
        <h2>Users</h2>
        <div className="header-controls">
          <div className="filter-container">
            <div className="filter-group">
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="filter-toggle">
                  {activeFilter ? `Filter by ${activeFilter}` : "Filter by"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="filter-menu">
                  <Dropdown.Item onClick={() => handleFilterSelect("role")}>Role</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={resetFilters}>Clear Filters</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {renderFilterInput()}
            </div>
          </div>
          <Link to={`${basePath}/users/add`} className="btn btn-primary add-user-btn">
            <FaPlus /> Add User
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.profile_picture_url || "/unknown_user.jpeg"}
                    alt="Profile"
                    className="user-thumbnail"
                    onError={(e) => {
                      e.target.src = "/unknown_user.jpeg";
                    }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`${basePath}/users/edit/${user.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <FaRegEdit />
                    </Link>
                    <Link
                      to={`${basePath}/users/details/${user.id}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      <GrView />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="no-users-message">
            No users found matching your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
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
            
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
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

export default UserList;