import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Title from "./Title";

const UserProfile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState(null)

  const getProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setUserData(response.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) getProfile()
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      {userData ? (
        <div className='flex flex-col gap-4 mt-8 text-gray-700'>
          <div className='flex flex-col md:flex-row gap-4 border-t border-b py-5 text-sm'>
            <div className='flex flex-col gap-4 w-full md:w-1/2'>
              <div className='flex items-center gap-4'>
                <p className='min-w-28 font-medium text-gray-500'>Name</p>
                <p className='text-gray-800 font-medium'>{userData.name}</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='min-w-28 font-medium text-gray-500'>Email</p>
                <p className='text-gray-800 font-medium'>{userData.email}</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='min-w-28 font-medium text-gray-500'>Phone</p>
                <p className='text-gray-800 font-medium'>{userData.phoneno || 'Not added yet'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className='bg-black text-white px-8 py-2 text-sm w-fit hover:bg-gray-800 transition-colors'
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p className='mt-8 text-gray-500 text-sm'>Loading...</p>
      )}
    </div>
  )
}

export default UserProfile
