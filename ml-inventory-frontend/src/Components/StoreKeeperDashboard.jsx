import React from 'react'
import { Link } from 'react-router-dom'

const StoreKeeperDashboard = () => {
  return (
    <div>
      <h1>StoreKeeperDashboard</h1>
      <Link to="/inboxes/list">Inbox List</Link><br />
    </div>
  )
}

export default StoreKeeperDashboard