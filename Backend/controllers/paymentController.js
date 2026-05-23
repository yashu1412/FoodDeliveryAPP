import crypto from "crypto";
import Cart from "../models/CartModel.js";
import Order from "../models/OrderModel.js";
import Restaurant from "../models/RestaurantModel.js";
import { calculateCartTotals } from "../utils/helpers.js";
import { getRazorpayInstance } from "../utils/razorpay.js";

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

  return {
    cart,
    restaurant,
    pricing: calculateCartTotals(cart.items, restaurant.deliveryFee || 0),
  };
};

export const createRazorpayOrder = async (req, res) => {
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

    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(pricing.grandTotal * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

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
      status: "pending",
      estimatedDeliveryTime: new Date(Date.now() + (restaurant.averageDeliveryTime || 30) * 60 * 1000),
      payment: {
        method: "razorpay",
        status: "pending",
        amount: pricing.grandTotal,
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
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

    return res.status(201).json({
      message: "Razorpay order created successfully",
      order,
      razorpayOrder,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create Razorpay order" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification details are required" });
    }

    const order = await Order.findById(orderId);

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      order.payment.status = "failed";
      await order.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    order.payment.status = "paid";
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.status = "confirmed";
    await order.save();

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], restaurant: null } }
    );

    return res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};
