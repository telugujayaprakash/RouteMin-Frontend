import { useDispatch, useSelector } from 'react-redux'
import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './LandingPages/LandingPage'
import Signup from './Pages/Auth/Signup'
import Sidebar from './Components/Sidebar'
import DashboardLayout from './Pages/DashboardLayout'
import Dashboard from './Pages/Dashboard'
import FactoryManagement from './Pages/FactoryManagement'
import WarehouseManagement from './Pages/WarehouseManagement'
import NewOptimization from './Pages/NewOptimization'
import ProtectedRoute from './Pages/ProtectedRoute'
import Reports from './Pages/Reports'
import AuditLogs from './Pages/AuditLogs'
import Result from './Pages/Result'
import OptimisationHistory from './Pages/OptimisationHistory'
import PricingSection from './Pages/PricingSection'
import ProfilePage from './Pages/ProfilePage'
import Login from './Pages/Auth/Login'

function App () {
  const user = useSelector(state => state.Auth?.user)

  return (
    <Routes>
      {/* Home */}
      <Route
        path='/'
        element={user ? <Navigate to='/dashboard' replace /> : <LandingPage />}
      />
      <Route
        path='/login'
        element={user ? <Navigate to='/dashboard' replace /> : <Login />}
      />

      <Route
        path='/signup'
        element={user ? <Navigate to='/dashboard' replace /> : <Signup />}
      />
      {/* Protected Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/factory-management' element={<FactoryManagement />} />
          <Route
            path='/warehouse-management'
            element={<WarehouseManagement />}
          />
          <Route path='/new-optimization' element={<NewOptimization />} />
          <Route
            path='/optimization-history'
            element={<OptimisationHistory />}
          />
          <Route path='/reports' element={<Reports />} />
          <Route path='/auditlogs' element={<AuditLogs />} />
          <Route path='/result/:id' element={<Result />} />
          <Route path='/pricing' element={<PricingSection />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Wrong URL */}
      <Route path='*' element={<Navigate to='/404-page-not-found' replace />} />
    </Routes>
  )
}

export default App
