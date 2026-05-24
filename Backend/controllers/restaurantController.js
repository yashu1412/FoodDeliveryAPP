import Restaurant from "../models/RestaurantModel.js";
import MenuItem from "../models/MenuItemModel.js";
import Category from "../models/CategoryModel.js";

export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisine,
      image,
      address,
      location,
      contactPhone,
      deliveryFee,
      minOrderAmount,
      averageDeliveryTime,
    } = req.body;

    if (!name || !address?.line1 || !address?.city || !address?.state || !address?.pincode || !contactPhone) {
      return res.status(400).json({ message: "Restaurant name, contact and address are required" });
    }

    if (location?.latitude == null || location?.longitude == null) {
      return res.status(400).json({ message: "Restaurant map location is required" });
    }

    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      description,
      cuisine: Array.isArray(cuisine) ? cuisine : [],
      image,
      address,
      location,
      contactPhone,
      deliveryFee: deliveryFee ?? 0,
      minOrderAmount: minOrderAmount ?? 0,
      averageDeliveryTime: averageDeliveryTime ?? 30,
    });

    return res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create restaurant" });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can update only your own restaurant" });
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();

    return res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update restaurant" });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "fullName email mobile");

    return res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    const restaurant = restaurants[0] || null;

    return res.status(200).json({
      message: "Owner restaurants fetched successfully",
      restaurants,
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch your restaurants" });
  }
};

export const toggleRestaurantOpen = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    const restaurant = restaurants[0];
    
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    return res.status(200).json({
      message: "Restaurant status updated",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update restaurant status" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId).populate("owner", "fullName email mobile");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const [menuItems, categories] = await Promise.all([
      MenuItem.find({ restaurant: restaurant._id }),
      Category.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 }),
    ]);

    return res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant: {
        ...restaurant.toObject(),
        menu: menuItems,
        categories: categories,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};
