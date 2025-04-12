import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div>AdminDashboard
      <Link to="/product/list">Product List</Link>
    </div>
  )
}

export default AdminDashboard