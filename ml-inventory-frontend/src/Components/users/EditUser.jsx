import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    cin: "",
    gender: "",
    date_of_birth: "",
    address: "",
    permanent_address: "",
    city: "",
    country: "",
    postal_code: "",
    role: "storekeeper",
    is_driver: false,
    driver_license_number: "",
    vehicle_type: "",
    vehicle_registration: "",
    profile_picture: null,
  });
  const [initialUser, setInitialUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/users/${id}`);

        setUser(response.data);
        setInitialUser({ ...response.data });

        if (response.data.profile_picture) {
          setImagePreview(
            `http://localhost:8000/storage/${response.data.profile_picture}`
          );
        }
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        profile_picture: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("username", user.username);
    formData.append("phone", user.phone);
    formData.append("cin", user.cin);
    formData.append("gender", user.gender || "");
    formData.append("date_of_birth", user.date_of_birth);
    formData.append("address", user.address);
    formData.append("permanent_address", user.permanent_address || "");
    formData.append("city", user.city);
    formData.append("country", user.country);
    formData.append("postal_code", user.postal_code || "");
    formData.append("role", user.role);
    formData.append("is_driver", user.is_driver);
    formData.append("driver_license_number", user.driver_license_number || "");
    formData.append("vehicle_type", user.vehicle_type || "");
    formData.append("vehicle_registration", user.vehicle_registration || "");

    if (user.profile_picture && typeof user.profile_picture !== "string") {
      formData.append("profile_picture", user.profile_picture);
    }

    try {
      const response = await axios.post(`/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSuccess("User updated successfully!");
        setTimeout(() => navigate("/users/list"), 1500);
      } else {
        setError(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update user");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialUser) {
    return <div className="text-center my-5">Loading user data...</div>;
  }

  return (
    <div className="container mt-4">
      <NavbarTop />
      <Navbar />
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit User</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setSuccess("");
                  navigate("/users/list");
                }}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Username*</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone*</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">CIN*</label>
                <input
                  type="text"
                  className="form-control"
                  name="cin"
                  value={user.cin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth*</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_birth"
                  value={user.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address*</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Permanent Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="permanent_address"
                  value={user.permanent_address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">City*</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={user.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Country*</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={user.country}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="postal_code"
                  value={user.postal_code}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role*</label>
                <select
                  className="form-select"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="subadmin">Sub Admin</option>
                  <option value="storekeeper">Storekeeper</option>
                  <option value="driver">Driver</option>
                </select>
              </div>

              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_driver"
                    checked={user.is_driver}
                    onChange={handleChange}
                    id="isDriverCheck"
                  />
                  <label className="form-check-label" htmlFor="isDriverCheck">
                    Is Driver
                  </label>
                </div>
              </div>

              {user.is_driver && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Driver License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="driver_license_number"
                      value={user.driver_license_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Vehicle Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vehicle_type"
                      value={user.vehicle_type}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Vehicle Registration</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vehicle_registration"
                      value={user.vehicle_registration}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="col-12">
                <label className="form-label">Profile Picture</label>
                {imagePreview && (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="img-thumbnail"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  name="profile_picture"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/users/list")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
