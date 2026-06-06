import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { loginUser, registerUser, getProfile, updateProfile, toggleWishlist, getWishlist } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', authMiddleware, getProfile)
userRouter.put('/profile/update', authMiddleware, updateProfile)
userRouter.post('/wishlist/toggle', authMiddleware, toggleWishlist)
userRouter.get('/wishlist', authMiddleware, getWishlist)

export default userRouter