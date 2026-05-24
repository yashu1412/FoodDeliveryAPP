import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  toggleRestaurantOpen,
} from "../controllers/restaurantController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/my", protect, authorizeRoles("owner"), getMyRestaurants);
router.get("/mine", protect, authorizeRoles("owner"), getMyRestaurants);
router.get("/:restaurantId", getRestaurantById);
router.post("/", protect, authorizeRoles("owner"), createRestaurant);
router.put("/:restaurantId", protect, authorizeRoles("owner"), updateRestaurant);
router.patch("/my/toggle-open", protect, authorizeRoles("owner"), toggleRestaurantOpen);

export default router;
