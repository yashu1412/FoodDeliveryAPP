import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./database/dbconnection.js";
import errorHandler from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

app.set("io", io);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(generalLimiter);

io.on("connection", (socket) => {
  socket.on("order:join", (orderId) => {
    socket.join(`order:${orderId}`);
  });

  socket.on("order:leave", (orderId) => {
    socket.leave(`order:${orderId}`);
  });

  socket.on("join:rider", ({ riderId }) => {
    socket.join(`user:${riderId}`);
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Food Delivery backend is running",
    features: [
      "JWT authentication",
      "Google One Tap auth",
      "Gmail SMTP OTP reset",
      "Restaurants and menu APIs",
      "Cart and checkout",
      "Razorpay payment flow",
      "Socket.io live tracking",
      "Categories & dishes management",
      "Reviews & ratings",
      "Rider availability & earnings",
      "Coupons & discounts",
      "Admin dashboard",
    ],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
