import express from "express";
import {
  getCurrentUser,
  googleLogin,
  login,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  signup,
} from "../controllers/authcontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", requestPasswordResetOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.get("/me", protect, getCurrentUser);

export default router;
