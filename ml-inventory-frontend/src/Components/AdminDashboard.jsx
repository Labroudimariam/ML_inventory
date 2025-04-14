import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div>AdminDashboard
      <Link to="/products/list">Product List</Link>
      <Link to="/beneficiaries/list">Beneficiary List</Link>
      <Link to="/categories/list">Category List</Link>
      <Link to="/warehouses/list">Warehouse List</Link>
    </div>
  )
}

export default AdminDashboard