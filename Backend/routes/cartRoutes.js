import express from "express";
import {
  addToCart,
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getMyCart);
router.post("/", addToCart);
router.post("/items", addToCart);
router.put("/", updateCartItem);
router.delete("/clear", clearCart);
router.delete("/:menuItemId", removeCartItem);
router.delete("/items/:menuItemId", removeCartItem);

export default router;
