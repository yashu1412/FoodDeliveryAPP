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
      description: "Delicious food from all around the world",
      cuisine: ["Indian", "Italian", "Japanese", "Mexican", "Continental", "Desserts"],
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
      { name: "Pizza", restaurantId: restaurant._id, sortOrder: 1 },
      { name: "Burger", restaurantId: restaurant._id, sortOrder: 2 },
      { name: "Noodles", restaurantId: restaurant._id, sortOrder: 3 },
      { name: "Sushi", restaurantId: restaurant._id, sortOrder: 4 },
      { name: "Chicken", restaurantId: restaurant._id, sortOrder: 5 },
      { name: "Tacos", restaurantId: restaurant._id, sortOrder: 6 },
      { name: "Salad", restaurantId: restaurant._id, sortOrder: 7 },
      { name: "Desserts", restaurantId: restaurant._id, sortOrder: 8 },
    ]);
    console.log("Categories created successfully!");

    const menuItems = await MenuItem.insertMany([
      {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        price: 299,
        category: "Pizza",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 20,
      },
      {
        name: "Pepperoni Pizza",
        description: "Spicy pepperoni with extra cheese",
        price: 399,
        category: "Pizza",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 25,
      },
      {
        name: "BBQ Chicken Pizza",
        description: "Grilled chicken with BBQ sauce and onions",
        price: 449,
        category: "Pizza",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 25,
      },
      {
        name: "Veggie Supreme Pizza",
        description: "Loaded with fresh vegetables and cheese",
        price: 349,
        category: "Pizza",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 22,
      },
      {
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheese, lettuce, and special sauce",
        price: 189,
        category: "Burger",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Veggie Burger",
        description: "Crispy veggie patty with fresh veggies and mayo",
        price: 159,
        category: "Burger",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 12,
      },
      {
        name: "Double Cheese Burger",
        description: "Double patty with double cheese and bacon",
        price: 249,
        category: "Burger",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 18,
      },
      {
        name: "Chicken Burger",
        description: "Crispy fried chicken with lettuce and mayo",
        price: 199,
        category: "Burger",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Hakka Noodles",
        description: "Stir-fried noodles with vegetables and soy sauce",
        price: 179,
        category: "Noodles",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Chicken Noodles",
        description: "Wok-tossed noodles with chicken and vegetables",
        price: 229,
        category: "Noodles",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 18,
      },
      {
        name: "Schezwan Noodles",
        description: "Spicy schezwan noodles with vegetables",
        price: 199,
        category: "Noodles",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Mixed Noodles",
        description: "Noodles with mixed vegetables and egg",
        price: 209,
        category: "Noodles",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 17,
      },
      {
        name: "California Roll",
        description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
        price: 349,
        category: "Sushi",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 20,
      },
      {
        name: "Salmon Nigiri",
        description: "Fresh salmon on top of seasoned rice",
        price: 399,
        category: "Sushi",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Tuna Sashimi",
        description: "Fresh slices of raw tuna",
        price: 449,
        category: "Sushi",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 10,
      },
      {
        name: "Dragon Roll",
        description: "Eel, avocado, and cucumber with eel sauce",
        price: 429,
        category: "Sushi",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 25,
      },
      {
        name: "Grilled Chicken",
        description: "Juicy grilled chicken with herbs and spices",
        price: 299,
        category: "Chicken",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 25,
      },
      {
        name: "Chicken Curry",
        description: "Traditional Indian chicken curry with aromatic spices",
        price: 279,
        category: "Chicken",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 30,
      },
      {
        name: "Chicken Wings",
        description: "Crispy chicken wings with BBQ sauce",
        price: 249,
        category: "Chicken",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 20,
      },
      {
        name: "Butter Chicken",
        description: "Creamy and rich butter chicken",
        price: 329,
        category: "Chicken",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1603894584088-576a32c1e282?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 35,
      },
      {
        name: "Chicken Tacos",
        description: "Spicy chicken with fresh salsa and guacamole",
        price: 229,
        category: "Tacos",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Veggie Tacos",
        description: "Grilled vegetables with black beans and cheese",
        price: 189,
        category: "Tacos",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 12,
      },
      {
        name: "Fish Tacos",
        description: "Crispy fish with cabbage slaw and chipotle sauce",
        price: 259,
        category: "Tacos",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 18,
      },
      {
        name: "Beef Tacos",
        description: "Seasoned beef with cheese and salsa",
        price: 239,
        category: "Tacos",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan and croutons",
        price: 159,
        category: "Salad",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
      },
      {
        name: "Greek Salad",
        description: "Fresh vegetables with feta cheese and olives",
        price: 179,
        category: "Salad",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
      },
      {
        name: "Chicken Salad",
        description: "Grilled chicken with mixed greens and vinaigrette",
        price: 229,
        category: "Salad",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
      },
      {
        name: "Quinoa Salad",
        description: "Nutritious quinoa with vegetables and lemon dressing",
        price: 199,
        category: "Salad",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 12,
      },
      {
        name: "Chocolate Cake",
        description: "Rich and moist chocolate cake with ganache",
        price: 149,
        category: "Desserts",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
      },
      {
        name: "Cheesecake",
        description: "Creamy New York style cheesecake",
        price: 169,
        category: "Desserts",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1533134242443-d4fd2113e411?w=600&q=80",
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
      {
        name: "Ice Cream Sundae",
        description: "Three scoops of ice cream with toppings",
        price: 189,
        category: "Desserts",
        restaurant: restaurant._id,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTime: 5,
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