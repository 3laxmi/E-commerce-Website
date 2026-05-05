import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const ForgotPassword = () => {

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { backendUrl, navigate } = useContext(ShopContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (response.data.success) {
        setSubmitted(true)
        toast.success('Reset link sent to your email')
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
        <p className='prata-regular text-3xl'>Forgot Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {submitted ? (
        <div className='w-full text-center text-sm text-gray-600'>
          <p>Reset link sent to <span className='font-medium text-gray-800'>{email}</span></p>
          <p className='mt-2'>Please check your inbox and follow the link.</p>
          <p onClick={() => navigate('/login')} className='mt-4 cursor-pointer text-black underline'>Back to Login</p>
        </div>
      ) : (
        <>
          <p className='w-full text-sm text-gray-500'>Enter your registered email address and we will send you a password reset link.</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Email'
            required
          />
          <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p onClick={() => navigate('/login')} className='cursor-pointer'>Back to Login</p>
          </div>
          <button className='bg-black text-white font-light px-8 py-2 mt-4'>Send Reset Link</button>
        </>
      )}
    </form>
  )
}

export default ForgotPassword
