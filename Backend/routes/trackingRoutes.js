import express from "express";
import { getOrderTracking, updateOrderTracking } from "../controllers/trackingController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/:orderId", getOrderTracking);
router.put("/:orderId/location", authorizeRoles("owner", "deliveryBoy"), updateOrderTracking);

export default router;
