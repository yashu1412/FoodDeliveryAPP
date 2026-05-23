import User from "../models/UserModel.js";
import Order from "../models/OrderModel.js";
import Earnings from "../models/EarningsModel.js";

export const toggleAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    await User.findByIdAndUpdate(req.user._id, { isAvailable });
    res.json({ message: `You are now ${isAvailable ? "online" : "offline"}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update availability" });
  }
};

export const getAvailableRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: "deliveryBoy", isAvailable: true })
      .select("fullName mobile avatar");
    res.json({ riders });
  } catch (error) {
    res.status(500).json({ message: "Failed to get available riders" });
  }
};

export const getRiderEarnings = async (req, res) => {
  try {
    const earnings = await Earnings.find({ riderId: req.user._id })
      .populate("orderId", "items pricing.createdAt")
      .sort({ createdAt: -1 });
    
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);
    const pending = earnings.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);
    
    res.json({ total, pending, history: earnings });
  } catch (error) {
    res.status(500).json({ message: "Failed to get earnings" });
  }
};
