import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { toast } from 'react-toastify'

const OrderTracking = () => {
  const { orderId } = useParams()
  const { backendUrl, token, currency } = useContext(ShopContext)
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const getOrderDetails = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/track',
        { orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        setOrder(response.data.order)
      } else {
        toast.error(response.data.message)
        navigate('/orders')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load order details')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        getOrderDetails()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token && orderId) {
      getOrderDetails()
    }
  }, [token, orderId])

  const getStatusIndex = (status) => {
    const statuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']
    return statuses.indexOf(status)
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Pending'
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl mb-8'>
          <Title text1={'ORDER'} text2={'TRACKING'} />
        </div>
        <div className='text-center py-12'>
          <p className='text-gray-500'>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl mb-8'>
          <Title text1={'ORDER'} text2={'TRACKING'} />
        </div>
        <div className='text-center py-12'>
          <p className='text-gray-500'>Order not found</p>
        </div>
      </div>
    )
  }

  const currentStatusIndex = getStatusIndex(order.status)
  const statuses = [
    { name: 'Order Placed' },
    { name: 'Packing' },
    { name: 'Shipped' },
    { name: 'Out for delivery' },
    { name: 'Delivered' }
  ]

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'ORDER'} text2={'TRACKING'} />
      </div>

      {/* Order Header */}
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <p className='text-xs text-gray-500 font-medium uppercase'>Order ID</p>
            <p className='font-mono text-sm text-gray-800 mt-1'>{order._id}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 font-medium uppercase'>Order Date</p>
            <p className='text-sm text-gray-800 mt-1'>{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 font-medium uppercase'>Total Amount</p>
            <p className='text-lg font-bold text-gray-800 mt-1'>{currency}{order.amount}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 font-medium uppercase'>Payment Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
              order.payment
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {order.payment ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8'>
        <h3 className='text-lg font-bold text-gray-800 mb-8'>Delivery Timeline</h3>
        
        <div className='relative'>
          {/* Timeline Line */}
          <div className='absolute left-6 top-0 bottom-0 w-1 bg-gray-200'></div>

          {/* Timeline Items */}
          <div className='space-y-8'>
            {statuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex
              const timestamp = order.tracking?.[status.name.toLowerCase().replace(/\s+/g, '_')] || null

              return (
                <div key={index} className='relative pl-20'>
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 w-4 h-4 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'bg-gray-300 border-gray-300'
                  }`}>
                  </div>

                  {/* Content */}
                  <div className={`pt-1 ${isCurrent ? 'border-l-4 border-blue-500 pl-4' : ''}`}>
                    <p className={`font-semibold text-base ${
                      isCompleted ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {status.name}
                    </p>
                    <p className={`text-sm mt-1 ${
                      isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {timestamp ? formatDate(timestamp) : 'Pending'}
                    </p>
                    {isCurrent && (
                      <p className='text-xs text-blue-600 font-semibold mt-2'>Current Status</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8'>
        <h3 className='text-lg font-bold text-gray-800 mb-4'>Delivery Address</h3>
        <div className='text-gray-700'>
          <p className='font-semibold'>{order.address.firstName} {order.address.lastName}</p>
          <p className='mt-2'>{order.address.street}</p>
          <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
          <p>{order.address.country}</p>
          <p className='mt-2 font-semibold'>Phone: {order.address.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8'>
        <h3 className='text-lg font-bold text-gray-800 mb-4'>Order Items</h3>
        <div className='space-y-4'>
          {order.items.map((item, index) => (
            <div key={index} className='flex items-center justify-between bg-gray-50 p-4 rounded-lg'>
              <div className='flex items-center gap-4'>
                <img src={item.image[0]} alt={item.name} className='w-16 h-16 object-cover rounded' />
                <div>
                  <p className='font-semibold text-gray-800'>{item.name}</p>
                  <p className='text-sm text-gray-600'>Size: {item.size} | Qty: {item.quantity}</p>
                </div>
              </div>
              <p className='font-bold text-gray-800'>{currency}{item.price}</p>
            </div>
          ))}
        </div>
        <div className='border-t border-gray-200 mt-4 pt-4'>
          <div className='flex justify-between items-center'>
            <p className='text-gray-600'>Subtotal:</p>
            <p className='text-gray-800'>{currency}{(order.amount - 10).toFixed(2)}</p>
          </div>
          <div className='flex justify-between items-center mt-2'>
            <p className='text-gray-600'>Delivery Charge:</p>
            <p className='text-gray-800'>{currency}10</p>
          </div>
          <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200'>
            <p className='font-bold text-gray-800'>Total:</p>
            <p className='font-bold text-lg text-gray-800'>{currency}{order.amount}</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
        <h3 className='text-lg font-bold text-gray-800 mb-4'>Payment Information</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600'>Payment Method</p>
            <p className='font-semibold text-gray-800 mt-1'>{order.paymentMethod}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Payment Status</p>
            <p className={`font-semibold mt-1 ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
              {order.payment ? 'Paid' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Back Button and Cancel Button */}
      <div className='mt-8 flex gap-4'>
        <button
          onClick={() => navigate('/orders')}
          className='bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors'
        >
          Back to Orders
        </button>
        {(order.status === 'Order Placed' || order.status === 'Packing') && (
          <button
            onClick={handleCancelOrder}
            className='bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors'
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderTracking
