import Category from "../models/CategoryModel.js";
import Restaurant from "../models/RestaurantModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, sortOrder, restaurantId } = req.body;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only add categories to your own restaurant" });
    }

    const category = await Category.create({
      name,
      restaurantId: restaurant._id,
      sortOrder: sortOrder || 0,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await Category.find({ restaurantId, isActive: true })
      .sort({ sortOrder: 1 });
    
    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get categories" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, sortOrder, isActive } = req.body;
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const restaurant = await Restaurant.findById(category.restaurantId);
    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own categories" });
    }

    if (name !== undefined) category.name = name;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const restaurant = await Restaurant.findById(category.restaurantId);
    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own categories" });
    }

    category.isActive = false;
    await category.save();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category" });
  }
};
