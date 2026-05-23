import Coupon from "../models/CouponModel.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiresAt, usageLimit } = req.body;
    
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount,
      expiresAt,
      usageLimit: usageLimit || 1,
    });

    res.status(201).json({ coupon });
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon" });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (coupon.usedBy.includes(req.user._id.toString())) {
      return res.status(400).json({ message: "Coupon already used" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Min order ₹${coupon.minOrderAmount}` });
    }

    let discount = coupon.discountType === "flat"
      ? coupon.discountValue
      : (orderAmount * coupon.discountValue) / 100;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    res.json({ discount, finalAmount: orderAmount - discount });
  } catch (error) {
    res.status(500).json({ message: "Failed to apply coupon" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ message: "Failed to get coupons" });
  }
};
