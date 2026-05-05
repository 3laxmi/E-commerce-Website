import React, { useEffect } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token , currency, navigate} = useContext(ShopContext);

  const [orderData, setorderData] = useState([])

  const loadOrderData = async () => {
    try{
      if(!token){
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {},{headers:{token}})
      if(response.data.success){
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
        
    } catch(error){
      console.log(error)
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/cancel', { orderId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        loadOrderData()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>
      
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      <div>
        {
          orderData.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No orders found</p>
            </div>
          ) : (
            orderData.map((item, index)=>(
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img  className='w-16 sm:w-20' src={item.image[0]} alt=''/>
                  <div>
                    <p className='sm:text-base font-medium'>
                      {item.name}
                    </p>
                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                      <p>{currency}{item.price}</p>
                      <p>Quantity:{item.quantity}</p>
                      <p>Size:{item.size}</p>
                    </div>
                    <p className='mt-1'>Date:<span className='text-gray-400'> {new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment:<span className='text-gray-400'> {item.paymentMethod}</span></p>
                  </div>
                </div>
                <div className='md:w-1/2 flex justify-between items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  <div className='flex gap-2'>
                    <button 
                      onClick={() => navigate(`/track-order/${item.orderId}`)}
                      className='border border-gray-800 px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-800 hover:text-white transition-colors'
                    >
                      Track Order
                    </button>
                    {(item.status === 'Order Placed' || item.status === 'Packing') && (
                      <button 
                        onClick={() => handleCancelOrder(item.orderId)}
                        className='border border-red-500 text-red-500 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-500 hover:text-white transition-colors'
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>

    </div>
  )
}

export default Orders
