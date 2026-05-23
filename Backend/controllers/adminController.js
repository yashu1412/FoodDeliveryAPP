import User from "../models/UserModel.js";
import Order from "../models/OrderModel.js";
import Restaurant from "../models/RestaurantModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, deliveredOrders, activeRestaurants] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$pricing.grandTotal" } } },
      ]),
      Restaurant.countDocuments({ isOpen: true, isApproved: true }),
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: deliveredOrders[0]?.totalRevenue || 0,
      activeRestaurants,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get admin stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
};
