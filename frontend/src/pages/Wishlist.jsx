import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Wishlist = () => {
    const { wishlistItems, products, removetoWishlsit, navigate, currency } = useContext(ShopContext)

    // Convert both to strings for proper comparison
    const wishlistItemsStr = wishlistItems.map(id => typeof id === 'string' ? id : id.toString())
    const wishlistProducts = products.filter(p => {
        const productIdStr = typeof p._id === 'string' ? p._id : p._id.toString()
        return wishlistItemsStr.includes(productIdStr)
    })

    return (        <div className='page-container'>
            <div className='section-title'>
                <Title text1={'MY'} text2={'WISHLIST'} />
            </div>

            {wishlistProducts.length === 0 ? (
                <div className='text-center py-16'>
                    <p className='text-gray-500 text-sm mb-6'>No items in your wishlist</p>
                    <button
                        onClick={() => navigate('/collection')}
                        className='btn-primary btn-sm'
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className='product-grid'>
                        {wishlistProducts.map((item) => (
                            <div key={item._id} className='relative'>
                                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                                <button
                                    onClick={() => removetoWishlsit(item._id)}
                                    className='btn-danger btn-sm w-full mt-2'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Wishlist
