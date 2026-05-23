import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./database/dbconnection.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("order:join", (orderId) => {
    socket.join(`order:${orderId}`);
  });

  socket.on("order:leave", (orderId) => {
    socket.leave(`order:${orderId}`);
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

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
