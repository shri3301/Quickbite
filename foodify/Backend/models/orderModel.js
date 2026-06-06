import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
{
    userId: {type: String ,required: true},
    items : {type: Array , required: true},
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status:{type: String , default: "Food is Getting Ready!"},
    date: {type: Date, default: Date.now},
    payment:{type: Boolean, default : false},
    paymentGateway: {type: String, default: "razorpay"},
    razorpayOrderId: {type: String, default: ""},
    razorpayPaymentId: {type: String, default: ""},
    razorpaySignature: {type: String, default: ""},
    discountCode: {type: String, default: ""},
    discountAmount: {type: Number, default: 0}
}
)

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel