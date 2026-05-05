import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { ShopContext } from '../../context/ShopContext'
import axios from 'axios'

const Navbar = () => {
  const { setToken, setRole, token, backendUrl, navigate } = useContext(ShopContext)

  const handleLogout = () => {
    setToken('')
    setRole('')
    localStorage.removeItem('token')
    navigate('/admin')
  }

  return (
    <div className='flex items-center py-3 px-4 sm:px-[4%] justify-between bg-white border-b border-gray-200 shadow-sm'>
      <img className='w-[max(10%, 80px)]' src={assets.logo} alt='Logo' />
      
      <div className='flex items-center gap-4'>
        {/* Profile Icon - Navigate to Edit Profile (Only when logged in) */}
        {token && (
          <img 
            onClick={() => navigate('/admin/edit-profile')}
            className='w-5 cursor-pointer hover:opacity-70 transition-opacity' 
            src={assets.profile_icon} 
            alt='Profile' 
            title='Edit Profile'
          />
        )}

        {/* Logout Button - Show only when logged in */}
        {token && (
          <button 
            onClick={handleLogout}
            className='bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors'
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
