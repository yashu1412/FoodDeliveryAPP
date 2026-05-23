import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
} from "../controllers/restaurantController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/mine", protect, authorizeRoles("owner"), getMyRestaurants);
router.get("/:restaurantId", getRestaurantById);
router.post("/", protect, authorizeRoles("owner"), createRestaurant);
router.put("/:restaurantId", protect, authorizeRoles("owner"), updateRestaurant);

export default router;
