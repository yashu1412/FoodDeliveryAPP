import express from "express";
import { submitReview, getRestaurantReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitReview);
router.get("/restaurant/:restaurantId", getRestaurantReviews);

export default router;
