import Restaurant from "../models/RestaurantModel.js";

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
    const { search, city, cuisine } = req.query;
    const query = { isApproved: true };

    if (city) {
      query["address.city"] = new RegExp(city, "i");
    }

    if (cuisine) {
      query.cuisine = { $in: [new RegExp(cuisine, "i")] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const restaurants = await Restaurant.find(query).populate("owner", "fullName email mobile");

    return res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });

    return res.status(200).json({
      message: "Owner restaurants fetched successfully",
      restaurants,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch your restaurants" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId).populate("owner", "fullName email mobile");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};
