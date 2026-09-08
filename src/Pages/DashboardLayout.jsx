import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Sidebar'

function Dashboard () {
  return (
    <div className='min-h-screen bg-slate-50/70 bg-grid-pattern font-sans antialiased text-slate-900'>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Right Side Main Area */}
      <main
        className='
          min-h-screen
          transition-all duration-300

          ml-0
          md:ml-20
          lg:ml-72
        '
      >
        <Outlet />
      </main>
    </div>
  )
}


export default Dashboard

