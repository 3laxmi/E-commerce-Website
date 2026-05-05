// import { currency } from "../../admin/src/App.jsx";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'


// global variable
const currency = 'inr'
const deliveryCharge = 10


// gatway initialize 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing orders using COD Method

const placeOrder = async (req, res) => {

    try {
        const { userId, items, amount, address } = req.body;

        const totalAmount = amount
        const itemCount = items.length
        const amountPerItem = Math.round((totalAmount / itemCount) * 100) / 100

        const orders = []
        for (let i = 0; i < items.length; i++) {
            const orderData = {
                userId,
                items: [items[i]],
                amount: i === items.length - 1 ? totalAmount - (amountPerItem * (itemCount - 1)) : amountPerItem,
                address,
                paymentMethod: "COD",
                payment: false,
                date: Date.now(),
                tracking: {
                    order_placed: Date.now(),
                    packing: null,
                    shipped: null,
                    out_for_delivery: null,
                    delivered: null
                }
            }
            const newOrder = new orderModel(orderData)
            await newOrder.save()
            orders.push(newOrder)
        }

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Orders Placed", orders })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// placing orders using stripe method
const placeOrderStripe = async (req, res) => {
    try{
        const  {userId, items,  amount, address} = req.body;
        const {origin} = req.headers;

        const totalAmount = amount
        const itemCount = items.length
        const amountPerItem = Math.round((totalAmount / itemCount) * 100) / 100

        const orders = []
        for (let i = 0; i < items.length; i++) {
            const orderData = {
                userId,
                items: [items[i]],
                amount: i === items.length - 1 ? totalAmount - (amountPerItem * (itemCount - 1)) : amountPerItem,
                address,
                paymentMethod: "Stripe",
                payment: false,
                date: Date.now(),
                tracking: {
                    order_placed: Date.now(),
                    packing: null,
                    shipped: null,
                    out_for_delivery: null,
                    delivered: null
                }
            }
            const newOrder = new orderModel(orderData)
            await newOrder.save()
            orders.push(newOrder)
        }

        const line_items = items.map((item)=>(

            {
                price_data:{
                    currency:currency,
                    product_data:{
                        name:item.name

                    },
                    unit_amount: item.price * 100
                },
                quantity:item.quantity

            }))
        line_items.push({

            
            price_data:{
                currency:currency,
                product_data:{
                    name:'Delivery Charges'

                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1


        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderIds=${orders.map(o => o._id).join(',')}` ,
            cancel_url:  `${origin}/verify?success=false&orderIds=${orders.map(o => o._id).join(',')}`,
            line_items,
            mode: 'payment',

        })

        res.json({success:true, session_url:session.url});



     } catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })


     }


}

// verify  stripe
const verifyStripe = async (req, res)=>{
    const {orderIds, success, userId} = req.body

    try{

        if(success === "true"){
            const orderIdArray = orderIds.split(',')
            for (const orderId of orderIdArray) {
                await orderModel.findByIdAndUpdate(orderId, {payment:true});
            }
            await userModel.findByIdAndUpdate(userId, {cartData:{}})
            res.json({success:true});
        } else{
            const orderIdArray = orderIds.split(',')
            for (const orderId of orderIdArray) {
                await orderModel.findByIdAndDelete(orderId)
            }
            res.json({success:false})
        }

    }catch(error){

        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// placing order using Rozerpay method

const placeOrderRozerpay = async (req, res) => {

}


// All Orders data for admin panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// User Order data for frontend
const userOrders = async (req, res) => {

    try {
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// Get single order tracking details
const getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.body
        const token = req.headers.token

        if (!token) {
            return res.json({ success: false, message: 'No token provided' })
        }

        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.json({ success: false, message: 'Order not found' })
        }

        // Verify order belongs to user
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (order.userId !== decoded.id) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update order status for admin panel
const updateStatus = async (req, res) => {
    try{
 
        const {orderId, status} = req.body

        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.json({ success: false, message: 'Order not found' })
        }

        // Update tracking timestamp based on status
        const trackingKey = status.toLowerCase().replace(/\s+/g, '_')
        
        if (order.tracking && order.tracking[trackingKey] === null) {
            order.tracking[trackingKey] = Date.now()
        }

        order.status = status
        await order.save()

        res.json({success:true, message:'Status Updated'})

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// Cancel order by user
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body
        const token = req.headers.token

        if (!token) {
            return res.json({ success: false, message: 'No token provided' })
        }

        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.json({ success: false, message: 'Order not found' })
        }

        // Verify order belongs to user
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (order.userId !== decoded.id) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        // Can only cancel if order is in initial stages
        const cancellableStatuses = ['Order Placed', 'Packing']
        if (!cancellableStatuses.includes(order.status)) {
            return res.json({ success: false, message: `Cannot cancel order in ${order.status} status` })
        }

        order.status = 'Cancelled'
        await order.save()

        res.json({ success: true, message: 'Order cancelled successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export {verifyStripe,  placeOrder, placeOrderStripe, placeOrderRozerpay, allOrders, userOrders, updateStatus, getOrderTracking, cancelOrder }
