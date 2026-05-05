import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductItem = ({ id, image, name, price }) => {

    const { currency, addtoWishlsit, removetoWishlsit, wishlistItems } = useContext(ShopContext)

    const isWishlisted = wishlistItems.some(item => {
        const itemStr = typeof item === 'string' ? item : item.toString()
        const idStr = typeof id === 'string' ? id : id.toString()
        return itemStr === idStr
    })

    const handleWishlist = (e) => {
        e.preventDefault()
        if (isWishlisted) {
            removetoWishlsit(id)
        } else {
            addtoWishlsit(id)
        }
    }

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden relative'>
                <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt='' />
                 <div
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10"
    >
        <img
            src={isWishlisted ? assets.filled_icon : assets.heart_icon}
            className="w-6 cursor-pointer hover:scale-110 transition"
            alt="wishlist"
        />
    </div>
                {/* <div
                    onClick={handleWishlist}
                    
                    // className={`absolute top-2 right-2 cursor-pointer p-1 rounded-full ${isWishlisted ? 'bg-red-500' : 'bg-transparent'}`}
                >
                   <img
                       src={isWishlisted? assets. filled_icon : assets.heart_icon}
                       className="w-6"
                       alt="wishlist"
                     />
                   
                </div> */}
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem
