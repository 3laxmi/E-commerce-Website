import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../../context/ShopContext'

const Users = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [isToggling, setIsToggling] = useState(false)
  const { backendUrl, token, currency } = useContext(ShopContext)

  const fetchAllUsers = async () => {
    if (!token) return null

    try {
      const response = await axios.post(
        backendUrl + '/api/user/list',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        // Filter to show only regular users (not admins)
        const regularUsers = response.data.users.filter(user => user.role === 'user')
        setUsers(regularUsers)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const fetchUserOrders = async (userId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        { userId },
        { headers: { token } }
      )

      if (response.data.success) {
        setUserOrders(response.data.orders)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    fetchUserOrders(user._id)
  }

  const toggleUserStatus = async (userId) => {
    try {
      setIsToggling(true)
      console.log('Toggling user status for userId:', userId)
      
      const response = await axios.post(
        backendUrl + '/api/user/toggle-status',
        { userId },
        { headers: { token } }
      )

      console.log('Toggle response:', response.data)

      if (response.data.success) {
        toast.success(response.data.message)
        
        // Update selected user immediately
        const updatedUser = {
          ...selectedUser,
          isActive: !selectedUser.isActive
        }
        setSelectedUser(updatedUser)
        
        // Refresh all users list
        await fetchAllUsers()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log('Toggle error:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsToggling(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [token])

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>Users Management</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Users List */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow-md border border-gray-200'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800'>All Users ({users.length})</h2>
            </div>
            <div className='overflow-y-auto max-h-96'>
              {users.length === 0 ? (
                <p className='p-6 text-gray-500 text-center'>No users found</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedUser?._id === user._id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-800'>{user.name}</p>
                        <p className='text-sm text-gray-500'>{user.email}</p>
                        <p className='text-xs text-gray-400 mt-1'>{user.phoneno || 'No phone'}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Details and Orders */}
        <div className='lg:col-span-2'>
          {selectedUser ? (
            <div className='space-y-6'>
              {/* User Info Card */}
              <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>User Details</h2>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Name</p>
                    <p className='text-lg text-gray-800 font-semibold'>{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Email</p>
                    <p className='text-lg text-gray-800 font-semibold break-all'>{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Phone</p>
                    <p className='text-lg text-gray-800 font-semibold'>{selectedUser.phoneno || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Role</p>
                    <p className='text-lg text-gray-800 font-semibold capitalize'>{selectedUser.role}</p>
                  </div>
                </div>

                {/* Status Toggle - Only for regular users */}
                {selectedUser.role === 'user' && (
                  <div className='border-t border-gray-200 pt-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-semibold text-gray-700'>Account Status</p>
                        <p className='text-xs text-gray-500 mt-1'>Toggle to activate or deactivate user account</p>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span className={`text-sm font-semibold ${
                          selectedUser.isActive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleUserStatus(selectedUser._id)}
                          disabled={isToggling}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            selectedUser.isActive
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-500 hover:bg-red-600'
                          } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              selectedUser.isActive ? 'translate-x-1' : 'translate-x-7'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Orders */}
              <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Orders ({userOrders.length})</h2>
                
                {userOrders.length === 0 ? (
                  <p className='text-gray-500 text-center py-8'>No orders found for this user</p>
                ) : (
                  <div className='space-y-4'>
                    {userOrders.map((order, index) => (
                      <div key={index} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3'>
                          <div>
                            <p className='text-sm text-gray-500'>Order ID</p>
                            <p className='font-mono text-sm text-gray-800'>{order._id}</p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Packing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.payment
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className='mb-3 pb-3 border-b border-gray-100'>
                          <p className='text-sm font-medium text-gray-700 mb-2'>Items:</p>
                          <div className='space-y-1'>
                            {order.items.map((item, idx) => (
                              <p key={idx} className='text-sm text-gray-600'>
                                • {item.name} x {item.quantity} ({item.size}) - {currency}{item.price}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 pb-3 border-b border-gray-100'>
                          <div>
                            <p className='text-xs text-gray-500'>Amount</p>
                            <p className='font-semibold text-gray-800'>{currency}{order.amount}</p>
                          </div>
                          <div>
                            <p className='text-xs text-gray-500'>Method</p>
                            <p className='font-semibold text-gray-800'>{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className='text-xs text-gray-500'>Date</p>
                            <p className='font-semibold text-gray-800'>{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className='text-xs text-gray-500'>Items</p>
                            <p className='font-semibold text-gray-800'>{order.items.length}</p>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                          <p className='text-sm font-medium text-gray-700 mb-2'>Delivery Address:</p>
                          <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded'>
                            <p className='font-medium'>{order.address.firstName} {order.address.lastName}</p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                            <p>{order.address.country}</p>
                            <p className='mt-1'>Phone: {order.address.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center'>
              <p className='text-gray-500 text-lg'>Select a user to view details and orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users
