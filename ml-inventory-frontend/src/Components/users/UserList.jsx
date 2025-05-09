import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import "./userList.css";
import NavbarTop from "../navbar/NavbarTop";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin") {
      setError("You don't have permission to view users");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
        console.log("Fetched users:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error.response || error.message);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        setError("Failed to delete user.");
      }
    }
  };

  return (
    <div className="user-list">
      <NavbarTop />
      <Navbar />
      <h2>Users</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Username</th>
              <th>City</th>
              <th>Country</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    width={50}
                    height={50}
                    src={user.profile_picture_url || "/unknown_user.jpeg"}
                    alt="Profile"
                    className="profile-img"
                    onError={(e) => {
                      console.error("Failed to load image:", e.target.src);
                      e.target.src = "/unknown_user.jpeg";
                    }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.username}</td>
                <td>{user.city}</td>
                <td>{user.country}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/user/edit/${user.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/user/add" className="btn">
        Add New User
      </Link>
    </div>
  );
};

export default UserList;
