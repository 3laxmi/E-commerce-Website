import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'

const ResetPassword = () => {

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { backendUrl, navigate } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/reset-password', { token, password })
      if (response.data.success) {
        toast.success('Password reset successfully')
        navigate('/login')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Reset Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='New Password'
        required
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Confirm New Password'
        required
      />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p onClick={() => navigate('/login')} className='cursor-pointer'>Back to Login</p>
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>Reset Password</button>
    </form>
  )
}

export default ResetPassword
