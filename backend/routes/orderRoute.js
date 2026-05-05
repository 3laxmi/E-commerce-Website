import express from 'express'
import  {placeOrder, placeOrderStripe, placeOrderRozerpay, allOrders, userOrders, updateStatus, verifyStripe, getOrderTracking, cancelOrder} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()


// admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)


// payment features
orderRouter.post('/place', authUser,placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRozerpay)

// user feature
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/track', authUser, getOrderTracking)
orderRouter.post('/cancel', authUser, cancelOrder)

// verify payment
orderRouter.post('/verifystripe', authUser, verifyStripe)


export default orderRouter
