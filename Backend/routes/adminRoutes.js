import express from "express";
import { getAdminStats, getAllUsers, getAllOrders } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

export default router;
