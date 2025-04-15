import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1><br />
      <Link to="/profile">Profile</Link><br />
      <Link to="/users/list">User List</Link><br />
      <Link to="/products/list">Product List</Link><br />
      <Link to="/beneficiaries/list">Beneficiary List</Link><br />
      <Link to="/categories/list">Category List</Link><br />
      <Link to="/warehouses/list">Warehouse List</Link><br />
      <Link to="/orders/list">Order List</Link><br />
      <Link to="/order-items/list">Order Item List</Link><br />
      <Link to="/inventory/list">Inventory List</Link><br />
      <Link to="/reports/list">Report List</Link><br />
      <Link to="/inboxes/list">Inbox List</Link><br />
    </div>
  )
}

export default AdminDashboard