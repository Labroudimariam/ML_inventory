import React from 'react'
import NavbarTop from './navbar/NavbarTop'
import Navbar from './navbar/Navbar'

const SubAdminDashboard = () => {
  return (
    <div className='subadmin-dashboard'>
      <NavbarTop />
      <Navbar />
      <h1>SubAdmin Dashboard</h1>
    </div>
  )
}

export default SubAdminDashboard