import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../../context/ShopContext'
import { useContext } from 'react'

const Orders = () => {

  const [orders, setOrders] = useState([])
  const { backendUrl, currency, token } = useContext(ShopContext)

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })

      if (response.data.success) {
        console.log("Fetched orders:", response.data.orders);
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, {
        headers: {
          token: token
        },
      })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success('Order status updated')
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Out for delivery':
        return 'bg-purple-100 text-purple-800'
      case 'Packing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className='w-full'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Orders Management</h1>
        <p className='text-gray-500 mt-2'>Total Orders: {orders.length}</p>
      </div>

      {orders.length === 0 ? (
        <div className='bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center'>
          <p className='text-gray-500 text-lg'>No orders found</p>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'>
          {/* Desktop Table View */}
          <div className='hidden md:block overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Order ID</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Customer</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Date</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Amount</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Items</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Payment</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {orders.map((order, index) => (
                  <tr key={index} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <p className='font-mono text-xs text-gray-600'>{order._id.slice(0, 8)}...</p>
                    </td>
                    <td className='px-6 py-4'>
                      <div>
                        <p className='text-sm font-semibold text-gray-800'>{order.address.firstName} {order.address.lastName}</p>
                        <p className='text-xs text-gray-500'>{order.address.phone}</p>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm text-gray-800'>{new Date(order.date).toLocaleDateString()}</p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm font-bold text-gray-800'>{currency}{order.amount}</p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm text-gray-800'>{order.items.length}</p>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.payment
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {order.payment ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        value={order.status}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(order.status)} border-current cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='md:hidden space-y-4 p-4'>
            {orders.map((order, index) => (
              <div key={index} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <p className='text-xs text-gray-500 font-medium'>Order ID</p>
                    <p className='font-mono text-xs text-gray-800'>{order._id.slice(0, 12)}...</p>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-3 mb-3 text-sm'>
                  <div>
                    <p className='text-xs text-gray-500 font-medium'>Customer</p>
                    <p className='text-gray-800 font-semibold'>{order.address.firstName} {order.address.lastName}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 font-medium'>Amount</p>
                    <p className='text-gray-800 font-bold'>{currency}{order.amount}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 font-medium'>Date</p>
                    <p className='text-gray-800'>{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 font-medium'>Items</p>
                    <p className='text-gray-800'>{order.items.length}</p>
                  </div>
                </div>

                <div className='mb-3'>
                  <p className='text-xs text-gray-500 font-medium mb-1'>Items</p>
                  <div className='space-y-1'>
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className='text-xs text-gray-700'>{item.name} x{item.quantity}</p>
                    ))}
                    {order.items.length > 2 && <p className='text-xs text-gray-500'>+{order.items.length - 2} more</p>}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      order.payment
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className='px-2 py-1 rounded text-xs font-semibold border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
