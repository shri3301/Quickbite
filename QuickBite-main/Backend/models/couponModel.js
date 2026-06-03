import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: null }, // cap for percentage discounts
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usageCount: { type: Number, default: 0 }
}, { timestamps: true })

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema)

export default couponModel
