import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        rating: { type: Number, default: 4.0, min: 1, max: 5 },
        deliveryTime: { type: Number, default: 30 }, // in minutes
        isVeg: { type: Boolean, default: true },
        offer: { type: String, default: "" } // e.g. "20% OFF"
    }
)

// Use explicit collection name 'food' to match Atlas collection (non-pluralized)
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema, "food")

export default foodModel;