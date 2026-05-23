import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getRestaurantMenu,
  updateMenuItem,
} from "../controllers/menuController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/restaurant/:restaurantId", getRestaurantMenu);
router.post("/restaurant/:restaurantId", protect, authorizeRoles("owner"), createMenuItem);
router.put("/:itemId", protect, authorizeRoles("owner"), updateMenuItem);
router.delete("/:itemId", protect, authorizeRoles("owner"), deleteMenuItem);

export default router;
