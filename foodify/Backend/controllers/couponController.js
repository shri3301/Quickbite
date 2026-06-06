import couponModel from "../models/couponModel.js"

// Apply a coupon to a cart
const applyCoupon = async (req, res) => {
    try {
        const { code, cartAmount } = req.body
        const coupon = await couponModel.findOne({ code: code.toUpperCase(), isActive: true })

        if (!coupon) {
            return res.json({ success: false, message: "Invalid or expired coupon code" })
        }

        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return res.json({ success: false, message: "This coupon has expired" })
        }

        if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
            return res.json({ success: false, message: "Coupon usage limit reached" })
        }

        if (cartAmount < coupon.minOrderAmount) {
            return res.json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required`
            })
        }

        let discountAmount = 0
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartAmount * coupon.discountValue) / 100
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount)
            }
        } else {
            discountAmount = coupon.discountValue
        }

        discountAmount = Math.min(discountAmount, cartAmount)

        res.json({
            success: true,
            discountAmount: Math.round(discountAmount),
            message: `Coupon applied! You save ₹${Math.round(discountAmount)}`
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error applying coupon" })
    }
}

// Get all active coupons (for display)
const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({ isActive: true }).select('-usageCount -usageLimit')
        res.json({ success: true, data: coupons })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error fetching coupons" })
    }
}

// Admin: Create coupon
const createCoupon = async (req, res) => {
    try {
        const coupon = new couponModel(req.body)
        await coupon.save()
        res.json({ success: true, message: "Coupon created!", data: coupon })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error creating coupon" })
    }
}

// Admin: Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        await couponModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Coupon deleted!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error deleting coupon" })
    }
}

// Admin: List all coupons
const adminListCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 })
        res.json({ success: true, data: coupons })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error fetching coupons" })
    }
}

export { applyCoupon, listCoupons, createCoupon, deleteCoupon, adminListCoupons }
