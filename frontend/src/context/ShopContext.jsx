import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [profileRefresh, setProfileRefresh] = useState(0);
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
                if (response.data.success) {
                    // Only update frontend after backend confirms
                    await getUserCart(token)
                    toast.success('Added to cart')
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        } else {
            // For non-logged in users, update locally
            let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                }
                else {
                    cartData[itemId][size] = 1;
                }
            }
            else {
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }
            setCartItems(cartData);
        }
    }
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    const quantity = cartItems[items][item];
                    if (quantity && quantity > 0) {
                        totalCount += quantity;
                    }
                } catch (error) {
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
                if (response.data.success) {
                    // Only update frontend after backend confirms
                    await getUserCart(token)
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        } else {
            // For non-logged in users, update locally
            let cartData = structuredClone(cartItems);
            cartData[itemId][size] = quantity;
            setCartItems(cartData)
        }
    }


    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];

                    }
                } catch (error) {
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async (page = 1) => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list?page=' + page + '&limit=12')
            
            if (response.data.success) {
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const verifyTokenFromBackend = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/user/verify-token', {}, { headers: { token } })
            
            if (response.data.success) {
                setRole(response.data.role)
                setUserId(response.data.userId)
                return response.data.role
            } else {
                // Token is invalid, clear it
                console.log('Token verification failed:', response.data.message)
                localStorage.removeItem('token')
                setToken('')
                setRole('')
                setUserId('')
                return null
            }
        } catch (error) {
            // Only clear token if it's a 401 (Unauthorized) error
            // Don't clear on network errors or other issues
            console.log('Token verification error:', error.message)
            
            if (error.response?.status === 401) {
                // Token is invalid or expired
                console.log('Token invalid (401), clearing session')
                localStorage.removeItem('token')
                setToken('')
                setRole('')
                setUserId('')
                return null
            } else {
                // Network error or other issue - keep token, user stays logged in
                console.log('Network/server error, keeping token')
                return null
            }
        }
    }

    // Fetch products on initial load only
    useEffect(() => {
        getProductsData()
    }, [])

    // Verify token on app load
    useEffect(() => {
        if (token) {
            verifyTokenFromBackend(token)
            getUserCart(token)
            getUserwishlist(token)
        }
    }, [token])



    const addtoWishlsit = async (itemId) => {
        try {
            const itemIdStr = typeof itemId === 'string' ? itemId : itemId.toString()
            
            const exists = wishlistItems.some(item => {
                const itemStr = typeof item === 'string' ? item : item.toString()
                return itemStr === itemIdStr
            })
            
            if (exists) {
                toast.error('Item already in wishlist')
                return
            }

            const response = await axios.post(backendUrl + '/api/wishlist/add', { itemId }, { headers: { token } })
            
            if (response.data.success) {
                await getUserwishlist(token)
                toast.success('Added to wishlist')
            } else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }


    const removetoWishlsit = async (itemId) => {
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/remove', { itemId }, {headers:{token}})
            
            if (response.data.success) {
                // Fetch fresh wishlist from backend to ensure sync
                await getUserwishlist(token)
                toast.success('Removed from wishlist')
            } else {
                toast.error(response.data.message)
            }
        }

        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const getUserwishlistCount = () => wishlistItems.length

    const getUserwishlist = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/get', {}, { headers: { token } })
            
            if (response.data.success) {
                const wishlistArray = response.data.wishlistData || []
                const stringWishlist = wishlistArray.map(id => typeof id === 'string' ? id : id.toString())
                const uniqueWishlist = [...new Set(stringWishlist)]
                setWishlistItems(uniqueWishlist)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getUserwishlistCount, wishlistItems, addtoWishlsit, removetoWishlsit, setWishlistItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, role, setRole, userId, setUserId, profileRefresh, setProfileRefresh,
        getProductsData, totalPages, currentPage, setCurrentPage
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;
