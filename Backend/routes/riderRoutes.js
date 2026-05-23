import express from "express";
import { toggleAvailability, getAvailableRiders, getRiderEarnings } from "../controllers/riderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.patch("/availability", protect, authorizeRoles("deliveryBoy"), toggleAvailability);
router.get("/available", protect, authorizeRoles("owner"), getAvailableRiders);
router.get("/earnings", protect, authorizeRoles("deliveryBoy"), getRiderEarnings);

export default router;
