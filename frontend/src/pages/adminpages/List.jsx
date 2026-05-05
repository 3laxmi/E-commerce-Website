import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ShopContext } from '../../context/ShopContext'
import { useContext } from 'react'

const List = () => {

  const [list, setList] = useState([])
  const {backendUrl, currency, token, navigate} = useContext(ShopContext)


  const fetchList = async () => {
    try {


      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        setList(response.data.products);

      }

      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
  }


  const removeProduct = async (id) => {

    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();

      }
      else {
        toast.error(response.data.message)

      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }

  }

  const editProduct = (product) => {
    // Store product data in sessionStorage for editing
    sessionStorage.setItem('editProduct', JSON.stringify(product))
    navigate('/admin/add')
  }

  useEffect(() => {

    fetchList()


  }, [])


  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* --------------------list table title--------------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-end py-1 px-2 border bg-gray-100  text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Edit</b>
          <b className='text-center'>Delete</b>
        </div>

        {/*  ------------------------Product List ---------------- */}

        {

          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr]  items-center gap-2 py-1 px-2 border text-sm ' key={index}>
              <img className='w-12' src={item.image[0]} alt='' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => editProduct(item)} className='text-right md:text-center cursor-pointer text-lg hover:text-blue-600'>✎</p>
              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg hover:text-red-600'>✕</p>

            </div>
          ))
        }

      </div>

    </>
  )
}

export default List
