import express from 'express'
import { applyCoupon, listCoupons, createCoupon, deleteCoupon, adminListCoupons } from '../controllers/couponController.js'

const couponRouter = express.Router()

couponRouter.post('/apply', applyCoupon)
couponRouter.get('/list', listCoupons)
couponRouter.post('/create', createCoupon)
couponRouter.post('/delete', deleteCoupon)
couponRouter.get('/admin/list', adminListCoupons)

export default couponRouter
