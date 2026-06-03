// To define user model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String , required: true},
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartData :{type:Object , default:{}},
    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'food'}],
    phone: {type: String, default: ""},
    address: {type: String, default: ""},
    profileImage: {type: String, default: ""}
},{minimize: false})

const userModel = mongoose.models.user || mongoose.model("user", userSchema, "user")

export default userModel;