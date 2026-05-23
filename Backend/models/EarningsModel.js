import mongoose from "mongoose";

const EarningsSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "credited", "withdrawn"], default: "pending" },
}, { timestamps: true });

const Earnings = mongoose.model("Earnings", EarningsSchema);
export default Earnings;
