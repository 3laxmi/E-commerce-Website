import express from 'express'
import { addToWishlist, removeToWishlist, getUserWishlist } from '../controllers/wishlistController.js'
import authUser from '../middleware/auth.js'


const wishlistRouter  = express.Router()


wishlistRouter.post('/add', authUser, addToWishlist )
wishlistRouter.post('/remove', authUser, removeToWishlist)
wishlistRouter.post('/get', authUser, getUserWishlist)

export default wishlistRouter