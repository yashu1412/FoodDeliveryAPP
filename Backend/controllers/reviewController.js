import Review from "../models/ReviewModel.js";
import Order from "../models/OrderModel.js";
import Restaurant from "../models/RestaurantModel.js";

export const submitReview = async (req, res) => {
  try {
    const { orderId, rating, comment, dishId } = req.body;
    const order = await Order.findById(orderId);

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Can only review delivered orders" });
    }

    const existingReview = await Review.findOne({ orderId, userId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: "Review already submitted for this order" });
    }

    const review = await Review.create({
      userId: req.user._id,
      orderId,
      restaurantId: order.restaurant,
      dishId: dishId || null,
      rating,
      comment: comment || "",
    });

    const avgRating = await Review.aggregate([
      { $match: { restaurantId: order.restaurant } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    if (avgRating.length > 0) {
      await Restaurant.findByIdAndUpdate(order.restaurant, {
        rating: avgRating[0].avgRating,
      });
    }

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};

export const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurantId })
      .populate("userId", "fullName avatar")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to get reviews" });
  }
};
