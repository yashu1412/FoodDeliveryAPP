import Cart from "../models/CartModel.js";
import MenuItem from "../models/MenuItemModel.js";
import Restaurant from "../models/RestaurantModel.js";
import { calculateCartTotals } from "../utils/helpers.js";

const buildCartResponse = async (cart) => {
  if (!cart) {
    return {
      items: [],
      pricing: calculateCartTotals([], 0),
      restaurant: null,
    };
  }

  let deliveryFee = 0;
  let restaurant = null;

  if (cart.restaurant) {
    restaurant = await Restaurant.findById(cart.restaurant).select("name image deliveryFee minOrderAmount averageDeliveryTime");
    deliveryFee = restaurant?.deliveryFee || 0;
  }

  return {
    cart,
    restaurant,
    pricing: calculateCartTotals(cart.items, deliveryFee),
  };
};

export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const data = await buildCartResponse(cart);

    return res.status(200).json({
      message: "Cart fetched successfully",
      ...data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: "Menu item id is required" });
    }

    const item = await MenuItem.findById(menuItemId);

    if (!item || !item.isAvailable) {
      return res.status(404).json({ message: "Menu item is not available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        restaurant: item.restaurant,
      });
    }

    if (cart.restaurant && cart.restaurant.toString() !== item.restaurant.toString()) {
      return res.status(400).json({ message: "You can add items from only one restaurant at a time" });
    }

    cart.restaurant = item.restaurant;

    const existingItem = cart.items.find(
      (cartItem) => cartItem.menuItem.toString() === item._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        menuItem: item._id,
        restaurant: item.restaurant,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    const data = await buildCartResponse(cart);

    return res.status(200).json({
      message: "Item added to cart successfully",
      ...data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity == null || Number(quantity) < 1) {
      return res.status(400).json({ message: "Menu item id and valid quantity are required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((cartItem) => cartItem.menuItem.toString() === menuItemId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = Number(quantity);
    await cart.save();
    const data = await buildCartResponse(cart);

    return res.status(200).json({
      message: "Cart item updated successfully",
      ...data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart item" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.menuItem.toString() !== menuItemId);

    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await cart.save();
    const data = await buildCartResponse(cart);

    return res.status(200).json({
      message: "Cart item removed successfully",
      ...data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove cart item" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], restaurant: null } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Cart cleared successfully",
      items: [],
      pricing: calculateCartTotals([], 0),
      restaurant: null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};
