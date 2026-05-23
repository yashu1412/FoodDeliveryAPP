import Cart from "../models/CartModel.js";
import Order from "../models/OrderModel.js";
import Restaurant from "../models/RestaurantModel.js";
import { calculateCartTotals } from "../utils/helpers.js";

const validateDeliveryAddress = (deliveryAddress) =>
  deliveryAddress?.fullName &&
  deliveryAddress?.phone &&
  deliveryAddress?.line1 &&
  deliveryAddress?.city &&
  deliveryAddress?.state &&
  deliveryAddress?.pincode;

const getCheckoutData = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0 || !cart.restaurant) {
    return null;
  }

  const restaurant = await Restaurant.findById(cart.restaurant);

  if (!restaurant) {
    return null;
  }

  const pricing = calculateCartTotals(cart.items, restaurant.deliveryFee || 0);

  return { cart, restaurant, pricing };
};

export const createCashOnDeliveryOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!validateDeliveryAddress(deliveryAddress)) {
      return res.status(400).json({ message: "Complete delivery address is required" });
    }

    const checkoutData = await getCheckoutData(req.user._id);

    if (!checkoutData) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { cart, restaurant, pricing } = checkoutData;

    if (pricing.grandTotal < (restaurant.minOrderAmount || 0)) {
      return res.status(400).json({ message: "Minimum order amount not reached" });
    }

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurant._id,
      items: cart.items.map((item) => ({
        menuItem: item.menuItem,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      deliveryAddress,
      pricing,
      status: "confirmed",
      estimatedDeliveryTime: new Date(Date.now() + (restaurant.averageDeliveryTime || 30) * 60 * 1000),
      payment: {
        method: "cod",
        status: "pending",
        amount: pricing.grandTotal,
      },
      tracking: {
        currentLocation: {
          latitude: restaurant.location.latitude,
          longitude: restaurant.location.longitude,
          updatedAt: new Date(),
        },
        destination: {
          latitude: deliveryAddress.latitude ?? null,
          longitude: deliveryAddress.longitude ?? null,
        },
        history: [
          {
            latitude: restaurant.location.latitude,
            longitude: restaurant.location.longitude,
            updatedAt: new Date(),
            source: "restaurant",
          },
        ],
      },
    });

    cart.items = [];
    cart.restaurant = null;
    await cart.save();

    return res.status(201).json({
      message: "Cash on delivery order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to place order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name image")
      .populate("deliveryPartner", "fullName mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Order history fetched successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOwnerOrders = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id }).select("_id");
    const restaurantIds = restaurants.map((restaurant) => restaurant._id);

    const orders = await Order.find({ restaurant: { $in: restaurantIds } })
      .populate("user", "fullName mobile")
      .populate("restaurant", "name")
      .populate("deliveryPartner", "fullName mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Owner orders fetched successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch owner orders" });
  }
};

export const getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id })
      .populate("user", "fullName mobile")
      .populate("restaurant", "name address location contactPhone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Delivery orders fetched successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch delivery orders" });
  }
};

export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "Delivery partner id is required" });
    }

    const order = await Order.findById(orderId).populate("restaurant");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can assign delivery only for your own orders" });
    }

    order.deliveryPartner = deliveryPartnerId;
    await order.save();

    return res.status(200).json({
      message: "Delivery partner assigned successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign delivery partner" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate("restaurant");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.restaurant.owner.toString() === req.user._id.toString();
    const isDeliveryBoy = order.deliveryPartner?.toString() === req.user._id.toString();

    if (!isOwner && !isDeliveryBoy) {
      return res.status(403).json({ message: "You cannot update this order status" });
    }

    order.status = status;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`order:${order._id}`).emit("order:statusUpdated", {
        orderId: order._id,
        status: order.status,
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status" });
  }
};
