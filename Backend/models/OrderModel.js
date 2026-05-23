import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const TrackingPointSchema = new mongoose.Schema(
  {
    latitude: Number,
    longitude: Number,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: ["system", "deliveryBoy", "restaurant"],
      default: "system",
    },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "razorpay",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    pricing: {
      itemsTotal: { type: Number, required: true, min: 0 },
      deliveryFee: { type: Number, required: true, min: 0 },
      taxAmount: { type: Number, required: true, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "picked", "on_the_way", "delivered", "cancelled"],
      default: "pending",
    },
    estimatedDeliveryTime: {
      type: Date,
      default: null,
    },
    payment: {
      type: PaymentSchema,
      required: true,
    },
    tracking: {
      currentLocation: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        updatedAt: { type: Date, default: null },
      },
      destination: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
      history: {
        type: [TrackingPointSchema],
        default: [],
      },
    },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ restaurant: 1, createdAt: -1 });
OrderSchema.index({ deliveryPartner: 1, status: 1 });

const Order = mongoose.model("Order", OrderSchema);

export default Order;
