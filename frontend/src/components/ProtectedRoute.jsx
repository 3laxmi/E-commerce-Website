import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useContext(ShopContext)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // Wait for role to be verified from backend
    if (token) {
      // If token exists, wait a moment for role to be set
      const timer = setTimeout(() => {
        setIsVerifying(false)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsVerifying(false)
    }
  }, [token])

  // Show nothing while verifying
  if (isVerifying && token) {
    return null
  }

  if (!token) return <Navigate to='/login' replace />
  if (requiredRole && role !== requiredRole) return <Navigate to='/' replace />

  return children
}

export default ProtectedRoute
