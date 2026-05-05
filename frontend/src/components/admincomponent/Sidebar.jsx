import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-full sm:w-[18%] min-h-screen border-r-2 border-gray-200 bg-white'>
      <div className='flex flex-col gap-2 pt-6 pl-4 sm:pl-[20%] text-[15px]'>

        <NavLink 
          className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${
            isActive ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-600' : 'hover:bg-gray-50'
          }`} 
          to='/admin/add'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='Add' />
          <p className='hidden md:block font-medium'>Add Items</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${
            isActive ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-600' : 'hover:bg-gray-50'
          }`} 
          to='/admin/list'
        >
          <img className='w-5 h-5' src={assets.order_icon} alt='List' />
          <p className='hidden md:block font-medium'>List Items</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${
            isActive ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-600' : 'hover:bg-gray-50'
          }`} 
          to='/admin/orders'
        >
          <img className='w-5 h-5' src={assets.order_icon} alt='Orders' />
          <p className='hidden md:block font-medium'>Orders</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${
            isActive ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-600' : 'hover:bg-gray-50'
          }`} 
          to='/admin/users'
        >
          <img className='w-5 h-5' src={assets.profile_icon} alt='Users' />
          <p className='hidden md:block font-medium'>Users</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${
            isActive ? 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-600' : 'hover:bg-gray-50'
          }`} 
          to='/admin/chat'
        >
          <img className='w-5 h-5' src={assets.profile_icon} alt='Chat' />
          <p className='hidden md:block font-medium'>Chat</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
