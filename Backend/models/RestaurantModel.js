import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    cuisine: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    contactPhone: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageDeliveryTime: {
      type: Number,
      default: 30,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

RestaurantSchema.index({ owner: 1 });
RestaurantSchema.index({ name: "text", description: "text" });

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
