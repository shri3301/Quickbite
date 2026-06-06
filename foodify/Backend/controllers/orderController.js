import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Placing user order via Razorpay
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173"

    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const { userId, items, amount, address, discountCode, discountAmount } = req.body

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            discountCode: discountCode || "",
            discountAmount: discountAmount || 0,
            paymentGateway: "razorpay"
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100), // in paise
            currency: "INR",
            receipt: newOrder._id.toString(),
        })

        await orderModel.findByIdAndUpdate(newOrder._id, {
            razorpayOrderId: razorpayOrder.id
        })

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Order placement failed" })
    }
}

// Verify Razorpay payment signature
const verifyOrder = async (req, res) => {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body
    try {
        const body = razorpayOrderId + "|" + razorpayPaymentId
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex")

        const isAuthentic = expectedSignature === razorpaySignature

        if (isAuthentic) {
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true,
                razorpayPaymentId,
                razorpaySignature
            })
            res.json({ success: true, message: "Payment verified" })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Payment verification failed" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error verifying payment" })
    }
}

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// All orders for Admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Updated!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Admin analytics - order stats
const getAnalytics = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments({})
        const paidOrders = await orderModel.countDocuments({ payment: true })
        const revenueAgg = await orderModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
        const totalRevenue = revenueAgg[0]?.total || 0

        // Orders per status
        const statusBreakdown = await orderModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ])

        // Recent 7 days daily order count
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const dailyOrders = await orderModel.aggregate([
            { $match: { date: { $gte: sevenDaysAgo } } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                count: { $sum: 1 },
                revenue: { $sum: "$amount" }
            }},
            { $sort: { _id: 1 } }
        ])

        res.json({
            success: true,
            data: { totalOrders, paidOrders, totalRevenue, statusBreakdown, dailyOrders }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error fetching analytics" })
    }
}

export { placeOrder, verifyOrder, userOrders, updateStatus, listOrders, getAnalytics }