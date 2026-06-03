// Login and Sign in logic

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User does not exist!!" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials, Please try again!!" })
        }
        const token = createToken(user._id)
        return res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User Already Exist!" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter Valid Email!" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter Strong Password!" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select('-password')
        if (!user) return res.json({ success: false, message: "User not found" })
        res.json({ success: true, data: user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error fetching profile" })
    }
}

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body
        await userModel.findByIdAndUpdate(req.body.userId, { name, phone, address })
        res.json({ success: true, message: "Profile updated!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error updating profile" })
    }
}

// Toggle Wishlist item
const toggleWishlist = async (req, res) => {
    try {
        const { foodId } = req.body
        const user = await userModel.findById(req.body.userId)
        if (!user) return res.json({ success: false, message: "User not found" })

        const index = user.wishlist.findIndex(id => id.toString() === foodId)
        if (index === -1) {
            user.wishlist.push(foodId)
        } else {
            user.wishlist.splice(index, 1)
        }
        await user.save()
        res.json({ success: true, wishlist: user.wishlist, message: index === -1 ? "Added to wishlist" : "Removed from wishlist" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error updating wishlist" })
    }
}

// Get User Wishlist
const getWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).populate('wishlist')
        if (!user) return res.json({ success: false, message: "User not found" })
        res.json({ success: true, data: user.wishlist })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error fetching wishlist" })
    }
}

export { loginUser, registerUser, getProfile, updateProfile, toggleWishlist, getWishlist }