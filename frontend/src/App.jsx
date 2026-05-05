import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/ProtectedRoute'
import { PublicLayout, ProtectedLayout, AdminLayout } from './layouts'
import { publicRoutes, protectedUserRoutes, adminRoutes } from './config/routeConfig'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<PublicLayout><Component /></PublicLayout>} />
        ))}

        {/* Protected User Routes */}
        {protectedUserRoutes.map(({ path, component: Component, withChat }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute requiredRole='user'>
                <ProtectedLayout withChat={withChat}><Component /></ProtectedLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute requiredRole='admin'>
              <AdminLayout>
                <Routes>
                  {adminRoutes.map(({ path, component: Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                  ))}
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
