import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Restaurant from "../models/RestaurantModel.js";
import MenuItem from "../models/MenuItemModel.js";
import Category from "../models/CategoryModel.js";
import Coupon from "../models/CouponModel.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});

    const users = [
      {
        fullName: "Admin User",
        email: "admin@yashpalsingh.com",
        password: await bcrypt.hash("admin123", 10),
        mobile: "9876543210",
        role: "admin",
        isEmailVerified: true,
      },
      {
        fullName: "Yashpalsingh Pawara",
        email: "yashpalsinghpawara@gmail.com",
        password: await bcrypt.hash("owner123", 10),
        mobile: "9359028987",
        role: "owner",
        isEmailVerified: true,
      },
      {
        fullName: "Raj Delivery",
        email: "delivery@yashpalsingh.com",
        password: await bcrypt.hash("rider123", 10),
        mobile: "9876543211",
        role: "deliveryBoy",
        isAvailable: true,
        isEmailVerified: true,
      },
      {
        fullName: "Test Customer",
        email: "customer@yashpalsingh.com",
        password: await bcrypt.hash("customer123", 10),
        mobile: "9876543212",
        role: "user",
        isEmailVerified: true,
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log("Users created successfully!");

    const restaurant = await Restaurant.create({
      name: "SwiftEats Bistro",
      owner: createdUsers[1]._id,
      description: "Delicious Indian and Continental food",
      cuisine: ["Indian", "Continental", "Desserts"],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      isOpen: true,
      isApproved: true,
      deliveryFee: 30,
      minOrderAmount: 150,
      averageDeliveryTime: 30,
      rating: 4.5,
      address: {
        line1: "123 Main Street, Near Railway Station",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        country: "India",
      },
      location: {
        latitude: 18.5204,
        longitude: 73.8567,
      },
      contactPhone: "9359028987",
    });
    console.log("Restaurant created successfully!");

    const categories = await Category.insertMany([
      { name: "Starters", restaurantId: restaurant._id, sortOrder: 1 },
      { name: "Main Course", restaurantId: restaurant._id, sortOrder: 2 },
      { name: "Desserts", restaurantId: restaurant._id, sortOrder: 3 },
    ]);
    console.log("Categories created successfully!");

    const menuItems = await MenuItem.insertMany([
      {
        name: "Paneer Tikka",
        description: "Grilled paneer cubes with Indian spices",
        price: 220,
        category: "Starters",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with chicken and spices",
        price: 380,
        category: "Main Course",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 30,
      },
      {
        name: "Butter Naan",
        description: "Soft Indian bread with butter",
        price: 45,
        category: "Main Course",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
      },
      {
        name: "Gulab Jamun",
        description: "Deep-fried milk solids in sugar syrup",
        price: 120,
        category: "Desserts",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
      },
    ]);
    console.log("Menu items created successfully!");

    const coupons = await Coupon.insertMany([
      {
        code: "WELCOME10",
        discountType: "percent",
        discountValue: 10,
        minOrderAmount: 200,
        maxDiscount: 50,
        usageLimit: 1,
      },
      {
        code: "FLAT50",
        discountType: "flat",
        discountValue: 50,
        minOrderAmount: 250,
        usageLimit: 2,
      },
    ]);
    console.log("Coupons created successfully!");

    console.log("\n✅ Sample data added successfully!");
    console.log("\n📧 Login Credentials:");
    console.log("-----------------------------------");
    console.log("Admin:");
    console.log(`  Email: ${users[0].email}`);
    console.log(`  Password: admin123`);
    console.log("\nRestaurant Owner:");
    console.log(`  Email: ${users[1].email}`);
    console.log(`  Password: owner123`);
    console.log("\nDelivery Boy:");
    console.log(`  Email: ${users[2].email}`);
    console.log(`  Password: rider123`);
    console.log("\nCustomer:");
    console.log(`  Email: ${users[3].email}`);
    console.log(`  Password: customer123`);
    console.log("-----------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
