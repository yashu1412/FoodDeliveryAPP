import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("owner"), createCategory);
router.get("/restaurant/:restaurantId", getCategories);
router.patch("/:categoryId", protect, authorizeRoles("owner"), updateCategory);
router.delete("/:categoryId", protect, authorizeRoles("owner"), deleteCategory);

export default router;
