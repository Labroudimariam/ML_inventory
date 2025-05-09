import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import NavbarTop from '../navbar/NavbarTop';
import Navbar from '../navbar/Navbar';

const AddReport = () => {
  const [form, setForm] = useState({
    name: '',
    type: 'Inventory',
    start_date: '',
    end_date: '',
    filters: '',
    data: '',
    user_id: ''
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const filtersInputRef = useRef(null);
  const dataInputRef = useRef(null);

  useEffect(() => {
    axios.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileImport = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setForm(prev => ({ ...prev, [field]: JSON.stringify(json, null, 2) }));
      } catch (err) {
        alert("Invalid JSON file");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        filters: form.filters ? JSON.stringify(JSON.parse(form.filters)) : null,
        data: form.data ? JSON.stringify(JSON.parse(form.data)) : null,
      };

      const res = await axios.post('/reports', payload);
      setMessage('Report added successfully!');
      setTimeout(() => navigate("/reports/list"), 1500);
    } catch (error) {
      console.error(error);
      setMessage('Error adding report.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <NavbarTop />
      <Navbar />
      <h2 className="text-xl font-bold mb-4">Add Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Report Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select name="type" value={form.type} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="Product">Product</option>
          <option value="Category">Category</option>
          <option value="Inventory">Inventory</option>
          <option value="Beneficiary">Beneficiary</option>
          <option value="Order">Order</option>
        </select>

        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block mb-1 font-semibold">Filters (JSON)</label>
          <textarea
            name="filters"
            placeholder='Filters (JSON format)'
            value={form.filters}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="button"
            className="text-sm text-blue-600 underline"
            onClick={() => filtersInputRef.current.click()}
          >
            Import Filters JSON
          </button>
          <input
            type="file"
            accept=".json"
            ref={filtersInputRef}
            onChange={(e) => handleFileImport(e, 'filters')}
            className="hidden"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Data (JSON)</label>
          <textarea
            name="data"
            placeholder='Data (JSON format)'
            value={form.data}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="button"
            className="text-sm text-blue-600 underline"
            onClick={() => dataInputRef.current.click()}
          >
            Import Data JSON
          </button>
          <input
            type="file"
            accept=".json"
            ref={dataInputRef}
            onChange={(e) => handleFileImport(e, 'data')}
            className="hidden"
          />
        </div>

        <select name="user_id" value={form.user_id} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Report</button>
      </form>

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default AddReport;
