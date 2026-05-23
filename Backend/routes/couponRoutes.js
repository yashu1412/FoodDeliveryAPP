import express from "express";
import { createCoupon, applyCoupon, getCoupons } from "../controllers/couponController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "owner"), createCoupon);
router.post("/apply", protect, applyCoupon);
router.get("/", getCoupons);

export default router;
