import Order from "../models/OrderModel.js";
import { isValidObjectId } from "../utils/helpers.js";

const canAccessOrderTracking = (order, userId) =>
  order.user.toString() === userId.toString() ||
  order.deliveryPartner?.toString() === userId.toString() ||
  order.restaurant.owner?.toString() === userId.toString();

export const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate({
        path: "restaurant",
        select: "name owner location",
      })
      .populate("deliveryPartner", "fullName mobile");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!canAccessOrderTracking(order, req.user._id)) {
      return res.status(403).json({ message: "You cannot access this tracking data" });
    }

    return res.status(200).json({
      message: "Order tracking fetched successfully",
      tracking: order.tracking,
      orderStatus: order.status,
      deliveryPartner: order.deliveryPartner,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch order tracking" });
  }
};

export const updateOrderTracking = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { latitude, longitude } = req.body;
    const order = await Order.findById(req.params.orderId).populate("restaurant", "owner");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isDeliveryBoy = order.deliveryPartner?.toString() === req.user._id.toString();
    const isOwner = order.restaurant.owner?.toString() === req.user._id.toString();

    if (!isDeliveryBoy && !isOwner) {
      return res.status(403).json({ message: "You cannot update this order tracking" });
    }

    const point = {
      latitude,
      longitude,
      updatedAt: new Date(),
      source: isDeliveryBoy ? "deliveryBoy" : "restaurant",
    };

    order.tracking.currentLocation = {
      latitude,
      longitude,
      updatedAt: point.updatedAt,
    };
    order.tracking.history.push(point);
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`order:${order._id}`).emit("order:locationUpdated", {
        orderId: order._id,
        status: order.status,
        tracking: order.tracking,
      });
    }

    return res.status(200).json({
      message: "Order tracking updated successfully",
      tracking: order.tracking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order tracking" });
  }
};
