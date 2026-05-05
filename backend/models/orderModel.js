import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    tracking: {
        order_placed: { type: Number, default: null },
        packing: { type: Number, default: null },
        shipped: { type: Number, default: null },
        out_for_delivery: { type: Number, default: null },
        delivered: { type: Number, default: null }
    }

})


const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;
