import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
const DefaultLayout = () => {
  return (
    // <div>
    <div> 
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-4">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
