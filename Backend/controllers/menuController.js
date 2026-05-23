import MenuItem from "../models/MenuItemModel.js";
import Restaurant from "../models/RestaurantModel.js";

const getOwnedRestaurant = async (restaurantId, ownerId) => {
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return null;
  }

  if (restaurant.owner.toString() !== ownerId.toString()) {
    const error = new Error("You can manage items only for your own restaurant");
    error.statusCode = 403;
    throw error;
  }

  return restaurant;
};

export const createMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, image, category, price, discountPrice, isVeg, isAvailable, preparationTime } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Item name and price are required" });
    }

    await getOwnedRestaurant(restaurantId, req.user._id);

    const item = await MenuItem.create({
      restaurant: restaurantId,
      name,
      description,
      image,
      category,
      price,
      discountPrice,
      isVeg,
      isAvailable,
      preparationTime,
    });

    return res.status(201).json({
      message: "Menu item created successfully",
      item,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Failed to create menu item" });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await getOwnedRestaurant(item.restaurant, req.user._id);
    Object.assign(item, req.body);
    await item.save();

    return res.status(200).json({
      message: "Menu item updated successfully",
      item,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Failed to update menu item" });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await getOwnedRestaurant(item.restaurant, req.user._id);
    await item.deleteOne();

    return res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Failed to delete menu item" });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { search, category } = req.query;

    const query = { restaurant: restaurantId };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    const items = await MenuItem.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Menu items fetched successfully",
      items,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch menu items" });
  }
};
