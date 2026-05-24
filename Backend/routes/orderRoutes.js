import express from "express";
import {
  assignDeliveryPartner,
  createCashOnDeliveryOrder,
  getDeliveryOrders,
  getMyOrders,
  getOrderById,
  getOwnerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/cod", createCashOnDeliveryOrder);
router.get("/my-orders", getMyOrders);
router.get("/:orderId", getOrderById);
router.get("/owner", authorizeRoles("owner"), getOwnerOrders);
router.get("/delivery", authorizeRoles("deliveryBoy"), getDeliveryOrders);
router.put("/:orderId/status", authorizeRoles("owner", "deliveryBoy"), updateOrderStatus);
router.put("/:orderId/assign-delivery", authorizeRoles("owner"), assignDeliveryPartner);

export default router;
