import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import Collection from '../pages/Collection';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] =  useState(0);

    const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setRole, getUserwishlistCount, role, setWishlistItems} = useContext(ShopContext);

    const logout = () =>{
      navigate('/login')
      localStorage.removeItem('token')
      setToken('')
      setRole('')
      setCartItems({})
      setWishlistItems([])
    }

  return (
    <div className='flex items-start justify-between py-5 font-medium'>
      <Link to='/'><img src= {assets.logo} className='w-36' alt='' /> </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to ='/' className= 'flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
 
         <NavLink to ='/collection' className= 'flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

           <NavLink to ='/about' className= 'flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to ='/contact' className= 'flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>


      </ul>
      <div className='flex items-center gap-6'>
        <img  onClick={()=>setShowSearch(true)}  src= { assets.search_icon} className='icon-btn' alt=''/> 
        
        {/* Profile Icon - Navigate to Profile (Only when logged in) */}
        {token && role === 'user' && (
          <img 
            onClick={()=> navigate('/profile')} 
            className='icon-btn' 
            src={assets.profile_icon} 
            alt='Profile' 
          />
        )}

        {/* Order Icon (Only when logged in) */}
        {token && role === 'user' && (
          <img 
            onClick={()=> navigate('/orders')} 
            className='icon-btn' 
            src={assets.order_icon} 
            alt='Orders' 
            title='My Orders'
          />
        )}

        <Link to='/wishlist' className='relative'>
        <img src={assets.heart_icon} className='w-5 min-w-5' alt='' />
        <p className='badge right-[-5px] bottom-[-5px]'>{getUserwishlistCount()}</p>
        </Link>
        
        <Link to='/cart' className='relative'>
        <img src= {assets.cart_icon} className='w-5 min-w-5' alt='' />
        <p className='badge right-[5px] bottom-[-5px]'>{getCartCount(0)}</p>
        </Link>

        {/* Login Button - Show when not logged in */}
        {!token && (
          <button
            onClick={() => navigate('/login')}
            className='btn-primary btn-sm'
          >
            Login
          </button>
        )}

        {/* Logout Button - Show only when logged in */}
        {token && (
          <button
            onClick={logout}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-medium transition-colors'
          >
            Logout
          </button>
        )}

        <img  onClick={()=>setVisible(true) }src= { assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt=''/>
      </div>
      {/* sidebar manu for small screens*/}
      <div className={`mobile-menu ${ visible? 'w-full': 'w-0'}`}> 
        <div className='flex flex-col text-gray-600 '>
            <div  onClick = {() => setVisible(false)} className=' flex items-center gap-4 p-3 cursor-pointer'>
                <img  className = ' h-4 rotate-180'  src= {assets.dropdown_icon} alt='' />
                <p>Back</p>
            </div>
            <NavLink  onClick={()=>setVisible(0)} className =' py-2 pl-6 border' to = '/'> HOME</NavLink>
            <NavLink  onClick={()=>setVisible(0)} className =' py-2 pl-6 border' to = '/collection'> COLLECTION</NavLink>
            <NavLink onClick={()=>setVisible(0)}  className =' py-2 pl-6 border' to = '/about'> ABOUT</NavLink>
            <NavLink  onClick={()=>setVisible(0)} className =' py-2 pl-6 border' to = '/contact'> CONTACT</NavLink>

            {/* Login/Logout in Mobile Menu */}
            {!token && (
              <button
                onClick={() => {
                  navigate('/login')
                  setVisible(0)
                }}
                className='py-2 pl-6 border text-left text-blue-600 font-medium hover:bg-blue-50'
              >
                LOGIN
              </button>
            )}

            {token && (
              <button
                onClick={() => {
                  logout()
                  setVisible(0)
                }}
                className='py-2 pl-6 border text-left text-red-600 font-medium hover:bg-red-50'
              >
                LOGOUT
              </button>
            )}
        </div>

      </div>
    </div>
  )
}

export default Navbar
