# 🍔 Food Delivery App — Advanced Monolithic System Design & Improvement Guide

> Complete backend feature guide covering all 3 user types: **Customer**, **Restaurant Owner**, and **Delivery Boy**

---

## 📐 System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                            │
│  [Customer Portal]    [Owner Portal]    [Delivery Portal]        │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│              API GATEWAY — Express.js Monolith                   │
│   JWT Auth Middleware · Rate Limiting · Request Validation       │
│   Role-Based Routing · Centralized Error Handler                 │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────────┘
       │          │          │          │          │
  [Auth]    [Orders]   [Restaurant] [Payments] [Tracking]
  Service   Service     Service     Service    Service
       │          │          │          │          │
┌──────▼──────────▼──────────▼──────────▼──────────▼──────────────┐
│                        DATA LAYER                                │
│   MongoDB (primary)  ·  Redis (cache + sessions)  ·  Socket.io  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication System (All Users)

### Current Features
- Signup / Login with email & password
- Google One Tap Login (OAuth)
- Password reset via email OTP
- JWT token authentication
- Email verification for new accounts

### Improvements to Add

#### 1. Refresh Token System
```js
// Generate both tokens on login
const accessToken  = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

// Store refresh token in Redis
await redis.set(`refresh:${id}`, refreshToken, 'EX', 604800); // 7 days

// POST /api/auth/refresh — get a new access token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const stored = await redis.get(`refresh:${decoded.id}`);
  if (stored !== refreshToken) return res.status(401).json({ message: 'Invalid token' });
  const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken: newAccessToken });
});
```

#### 2. Rate Limiting on Auth Routes
```js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts
  message: { message: 'Too many attempts. Try again in 15 minutes.' }
});

router.post('/login', authLimiter, loginController);
router.post('/otp/verify', authLimiter, verifyOTPController);
```

#### 3. Centralized Role Middleware
```js
// middleware/authorize.js
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Usage in routes
router.post('/restaurant/dish', authenticate, authorize('owner'), addDish);
router.patch('/orders/:id/status', authenticate, authorize('delivery', 'owner'), updateStatus);
```

---

## 👤 User Type: Regular Customer

### Current Features
- Browse restaurants & menus
- Add/remove cart items
- Razorpay payment + Cash on Delivery
- Place orders & view history
- Real-time order tracking

### Improvements to Add

#### 1. Redis-Persisted Cart
Move cart from frontend state into Redis so it survives page refreshes and works across devices.

```js
// POST /api/cart/add
const addToCart = async (req, res) => {
  const { dishId, quantity, restaurantId } = req.body;
  const cartKey = `cart:${req.user.id}`;

  // Prevent mixing items from different restaurants
  const existing = await redis.hgetall(cartKey);
  if (existing.restaurantId && existing.restaurantId !== restaurantId) {
    return res.status(400).json({ message: 'Cart has items from another restaurant. Clear cart first.' });
  }

  await redis.hset(cartKey, {
    restaurantId,
    [`item:${dishId}`]: JSON.stringify({ dishId, quantity })
  });
  await redis.expire(cartKey, 86400); // 24 hour TTL

  res.json({ message: 'Item added to cart' });
};

// GET /api/cart
const getCart = async (req, res) => {
  const cart = await redis.hgetall(`cart:${req.user.id}`);
  res.json({ cart });
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  await redis.del(`cart:${req.user.id}`);
  res.json({ message: 'Cart cleared' });
};
```

#### 2. Live Order Tracker (Socket.io)
```js
// Client side — connect to order room and receive live updates
const socket = io(SERVER_URL);

socket.emit('join:order', { orderId, token });

socket.on('status:update', ({ status }) => {
  updateStatusBadge(status); // pending → confirmed → preparing → picked → on_the_way → delivered
});

socket.on('location:update', ({ lat, lng }) => {
  moveMapPin(lat, lng); // animate rider pin on Google Map
});
```

#### 3. Re-Order Feature
```js
// POST /api/orders/:orderId/reorder
const reorder = async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order || order.userId.toString() !== req.user.id) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Pre-fill Redis cart with items from previous order
  const cartKey = `cart:${req.user.id}`;
  await redis.del(cartKey);
  await redis.hset(cartKey, 'restaurantId', order.restaurantId.toString());

  for (const item of order.items) {
    await redis.hset(cartKey, `item:${item.dishId}`, JSON.stringify(item));
  }
  await redis.expire(cartKey, 86400);

  res.json({ message: 'Cart pre-filled with previous order items' });
};
```

#### 4. Reviews & Ratings
```js
// POST /api/reviews
// Schema: Review { userId, orderId, restaurantId, dishId?, rating (1-5), comment, createdAt }

const submitReview = async (req, res) => {
  const { orderId, rating, comment, dishId } = req.body;
  const order = await Order.findById(orderId);

  if (order.status !== 'delivered') {
    return res.status(400).json({ message: 'Can only review delivered orders' });
  }

  const review = await Review.create({
    userId: req.user.id,
    orderId,
    restaurantId: order.restaurantId,
    dishId: dishId || null,
    rating,
    comment
  });

  // Update restaurant average rating
  const avg = await Review.aggregate([
    { $match: { restaurantId: order.restaurantId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);
  await Restaurant.findByIdAndUpdate(order.restaurantId, { rating: avg[0].avgRating });

  res.status(201).json({ review });
};
```

---

## 🏪 User Type: Restaurant Owner

### Current Features
- Create & manage restaurant profile
- Set open/closed status
- Manage delivery fee & minimum order amount
- View incoming orders
- Update order status (pending → confirmed → preparing)

### Improvements to Add

#### 1. Full Menu Hierarchy (Category → Dish)

**Updated RestaurantModel.js**
```js
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g. "Starters", "Mains", "Drinks"
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const DishSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  description:  { type: String, default: '' },
  price:        { type: Number, required: true },
  image:        { type: String, default: '' },          // Cloudinary URL
  categoryId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  isVeg:        { type: Boolean, default: true },
  isAvailable:  { type: Boolean, default: true },       // toggle on/off
  isDeleted:    { type: Boolean, default: false },      // soft delete
  prepTime:     { type: Number, default: 20 }           // minutes
}, { timestamps: true });
```

#### 2. Dish Management API Routes
```js
// POST   /api/restaurant/menu/category    — create category
// GET    /api/restaurant/menu             — get full menu (categories + dishes)
// POST   /api/restaurant/menu/dish        — add dish (with image upload)
// PATCH  /api/restaurant/menu/dish/:id    — update any dish field
// PATCH  /api/restaurant/menu/dish/:id/toggle  — toggle available/unavailable
// DELETE /api/restaurant/menu/dish/:id    — soft delete dish

// PATCH /api/restaurant/menu/dish/:id
const updateDish = async (req, res) => {
  const { name, price, description, isVeg, isAvailable, prepTime } = req.body;
  const updateData = {};

  if (name        !== undefined) updateData.name        = name;
  if (price       !== undefined) updateData.price       = price;
  if (description !== undefined) updateData.description = description;
  if (isVeg       !== undefined) updateData.isVeg       = isVeg;
  if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
  if (prepTime    !== undefined) updateData.prepTime    = prepTime;

  // Handle image upload (if new image sent)
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    updateData.image = result.secure_url;
  }

  const dish = await Dish.findOneAndUpdate(
    { _id: req.params.id, restaurantId: req.user.restaurantId },
    updateData,
    { new: true }
  );

  // Invalidate Redis menu cache
  await redis.del(`menu:${req.user.restaurantId}`);

  res.json({ dish });
};
```

#### 3. Image Upload with Multer + Cloudinary
```js
// middleware/upload.js
const multer    = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'food-delivery/dishes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'fill' }] // auto-resize
  }
});

module.exports = multer({ storage });

// Usage in routes
const upload = require('../middleware/upload');
router.post('/menu/dish', authenticate, authorize('owner'), upload.single('image'), addDish);
```

#### 4. Assign Delivery Boy to Order
```js
// PATCH /api/orders/:orderId/assign
const assignDeliveryBoy = async (req, res) => {
  const { deliveryBoyId } = req.body;

  const deliveryBoy = await User.findOne({ _id: deliveryBoyId, role: 'delivery', isAvailable: true });
  if (!deliveryBoy) return res.status(400).json({ message: 'Delivery boy not available' });

  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { deliveryBoyId, status: 'preparing' },
    { new: true }
  );

  // Notify delivery boy via Socket.io
  io.to(`user:${deliveryBoyId}`).emit('new:order', { order });

  // Mark delivery boy as unavailable
  await User.findByIdAndUpdate(deliveryBoyId, { isAvailable: false });

  res.json({ order });
};
```

#### 5. Owner Sales Analytics
```js
// GET /api/restaurant/analytics?period=week|month|year
const getAnalytics = async (req, res) => {
  const { period = 'week' } = req.query;
  const dateMap = { week: 7, month: 30, year: 365 };
  const since = new Date(Date.now() - dateMap[period] * 24 * 60 * 60 * 1000);

  const stats = await Order.aggregate([
    {
      $match: {
        restaurantId: mongoose.Types.ObjectId(req.user.restaurantId),
        status: 'delivered',
        createdAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({ stats });
};
```

---

## 🚚 User Type: Delivery Boy

### Current Features
- Accept / decline orders
- Update order status (preparing → picked → on_the_way → delivered)
- Real-time location tracking via Socket.io

### Improvements to Add

#### 1. Socket.io Live Location Tracking
```js
// server.js — Socket.io setup
io.on('connection', (socket) => {

  // Rider joins their personal room
  socket.on('join:rider', ({ riderId }) => {
    socket.join(`user:${riderId}`);
  });

  // Rider joins order room when they accept
  socket.on('join:order', ({ orderId }) => {
    socket.join(`order:${orderId}`);
  });

  // Rider emits live location — customer & owner both receive it
  socket.on('location:update', async ({ orderId, lat, lng }) => {
    // Broadcast to everyone in the order room
    io.to(`order:${orderId}`).emit('location:update', { lat, lng, timestamp: Date.now() });

    // Persist last known location to DB
    await Order.findByIdAndUpdate(orderId, {
      $push: {
        trackingHistory: { lat, lng, timestamp: new Date() }
      },
      'currentLocation.lat': lat,
      'currentLocation.lng': lng
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

#### 2. Get Delivery Address with Google Maps Route
```js
// GET /api/orders/:orderId/delivery-details
const getDeliveryDetails = async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('restaurantId', 'name address location')
    .populate('userId', 'name phone');

  const restaurant = {
    name:    order.restaurantId.name,
    address: order.restaurantId.address,
    lat:     order.restaurantId.location.lat,
    lng:     order.restaurantId.location.lng
  };

  const customer = {
    name:    order.userId.name,
    phone:   order.userId.phone,
    address: order.deliveryAddress.address,
    lat:     order.deliveryAddress.lat,
    lng:     order.deliveryAddress.lng
  };

  // Build Google Maps navigation URL for rider
  const mapsUrl = `https://www.google.com/maps/dir/${restaurant.lat},${restaurant.lng}/${customer.lat},${customer.lng}`;

  res.json({ restaurant, customer, mapsUrl });
};
```

#### 3. Rider Earnings & Wallet

**Earnings Model**
```js
const EarningsSchema = new mongoose.Schema({
  riderId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount:     { type: Number, required: true },
  status:     { type: String, enum: ['pending', 'credited', 'withdrawn'], default: 'pending' },
}, { timestamps: true });
```

**Earnings Routes**
```js
// GET /api/rider/earnings — total + history
const getRiderEarnings = async (req, res) => {
  const earnings = await Earnings.find({ riderId: req.user.id }).sort({ createdAt: -1 });
  const total = earnings.reduce((sum, e) => sum + e.amount, 0);
  const pending = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  res.json({ total, pending, history: earnings });
};

// Credit earnings when order is delivered
const creditEarnings = async (orderId, riderId) => {
  const order = await Order.findById(orderId);
  const deliveryFee = order.deliveryFee || 30; // platform delivery fee share to rider
  await Earnings.create({ riderId, orderId, amount: deliveryFee, status: 'credited' });
  await User.findByIdAndUpdate(riderId, { isAvailable: true }); // mark rider as free again
};
```

#### 4. Rider Availability Toggle
```js
// PATCH /api/rider/availability
const toggleAvailability = async (req, res) => {
  const { isAvailable } = req.body;
  await User.findByIdAndUpdate(req.user.id, { isAvailable });
  res.json({ message: `You are now ${isAvailable ? 'online' : 'offline'}` });
};

// GET /api/riders/available — for owner to see available riders
const getAvailableRiders = async (req, res) => {
  const riders = await User.find({ role: 'delivery', isAvailable: true })
    .select('name phone profileImage');
  res.json({ riders });
};
```

---

## 🔄 Complete Order Status Flow

```
Customer places order
        │
        ▼
   ┌─────────┐
   │ pending │  ◄── Order created, payment captured
   └────┬────┘
        │  Owner confirms
        ▼
  ┌───────────┐
  │ confirmed │  ◄── Owner accepted the order
  └─────┬─────┘
        │  Owner starts preparing
        ▼
  ┌───────────┐
  │ preparing │  ◄── Kitchen is cooking, rider assigned
  └─────┬─────┘
        │  Rider picks up
        ▼
  ┌────────┐
  │ picked │  ◄── Rider collected from restaurant
  └────┬───┘
        │  Rider en route
        ▼
  ┌────────────┐
  │ on_the_way │  ◄── Live GPS tracking active
  └──────┬─────┘
         │  Rider delivers
         ▼
   ┌───────────┐
   │ delivered │  ◄── Order complete, earnings credited
   └───────────┘
```

**Status Update Routes**
```js
// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { role } = req.user;

  const allowedTransitions = {
    owner:    { pending: 'confirmed', confirmed: 'preparing' },
    delivery: { preparing: 'picked', picked: 'on_the_way', on_the_way: 'delivered' }
  };

  const order = await Order.findById(req.params.id);
  const allowed = allowedTransitions[role];

  if (!allowed || allowed[order.status] !== status) {
    return res.status(400).json({ message: `Invalid status transition: ${order.status} → ${status}` });
  }

  order.status = status;
  await order.save();

  // Notify customer via Socket.io
  io.to(`order:${order._id}`).emit('status:update', { status });

  // Credit rider on delivery
  if (status === 'delivered') {
    await creditEarnings(order._id, order.deliveryBoyId);
  }

  res.json({ order });
};
```

---

## 💳 Payment System

### Razorpay Integration
```js
// POST /api/payments/create-order
const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body; // in rupees
  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100,   // convert to paise
    currency: 'INR',
    receipt: `order_${Date.now()}`,
  });
  res.json({ orderId: razorpayOrder.id, amount: razorpayOrder.amount });
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  // Mark payment as verified and place order
  await placeOrder(req.user.id, razorpay_payment_id);
  res.json({ message: 'Payment successful' });
};
```

### Refund Flow (New)
```js
// POST /api/payments/refund
const initiateRefund = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ message: 'Refund only allowed for pending/confirmed orders' });
  }

  if (order.paymentMethod === 'razorpay') {
    await razorpay.payments.refund(order.paymentId, { amount: order.totalAmount * 100 });
  }

  order.status = 'cancelled';
  order.refundStatus = 'initiated';
  await order.save();

  res.json({ message: 'Refund initiated successfully' });
};
```

---

## 📍 Real-Time Tracking System

### Socket.io Room Architecture
```
order:{orderId}
    ├── Customer socket    (listens: status:update, location:update)
    ├── Owner socket       (listens: status:update)
    └── Rider socket       (emits: location:update every 5s)

user:{userId}
    └── Rider socket       (listens: new:order — incoming delivery request)
```

### Frontend Tracking (Google Maps)
```js
// Customer tracking screen
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: restaurantLat, lng: restaurantLng },
  zoom: 14
});

const riderMarker = new google.maps.Marker({ map, icon: '🛵' });
const destMarker  = new google.maps.Marker({ map, icon: '📍' });

socket.on('location:update', ({ lat, lng }) => {
  riderMarker.setPosition({ lat, lng });
  map.panTo({ lat, lng });
});
```

### OrderModel Tracking Fields (Add to Schema)
```js
// Add to your existing OrderModel
trackingHistory: [{
  lat:       Number,
  lng:       Number,
  timestamp: { type: Date, default: Date.now }
}],
currentLocation: {
  lat: Number,
  lng: Number
},
deliveryAddress: {
  address: String,
  lat:     Number,
  lng:     Number
}
```

---

## ⚡ Performance Improvements

### 1. Redis Menu Caching
```js
// GET /api/restaurants/:id/menu
const getMenu = async (req, res) => {
  const cacheKey = `menu:${req.params.id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  // Fetch from DB
  const menu = await Category.find({ restaurantId: req.params.id, isActive: true })
    .lean();

  for (const category of menu) {
    category.dishes = await Dish.find({
      categoryId:   category._id,
      isAvailable:  true,
      isDeleted:    false
    }).lean();
  }

  // Cache for 5 minutes
  await redis.set(cacheKey, JSON.stringify(menu), 'EX', 300);
  res.json(menu);
};
```

### 2. Centralized Error Handler
```js
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

// app.js — add AFTER all routes
app.use(errorHandler);

// Usage in controllers — throw instead of res.status(...)
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Example
if (!restaurant) throw createError('Restaurant not found', 404);
```

### 3. Input Validation with express-validator
```js
const { body, validationResult } = require('express-validator');

const validateDish = [
  body('name').notEmpty().withMessage('Dish name is required'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }),
  body('categoryId').isMongoId().withMessage('Invalid category ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/menu/dish', authenticate, authorize('owner'), validateDish, addDish);
```

---

## 🆕 New Features to Add

### 1. Coupons & Discount System
```js
// CouponModel
const CouponSchema = new mongoose.Schema({
  code:           { type: String, required: true, unique: true },
  discountType:   { type: String, enum: ['flat', 'percent'], required: true },
  discountValue:  { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount:    { type: Number },                        // cap on percent discounts
  expiresAt:      { type: Date },
  usageLimit:     { type: Number, default: 1 },            // per user
  usedBy:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive:       { type: Boolean, default: true }
});

// POST /api/coupons/apply
const applyCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon)                                     return res.status(404).json({ message: 'Coupon not found' });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
  if (coupon.usedBy.includes(req.user.id))          return res.status(400).json({ message: 'Coupon already used' });
  if (orderAmount < coupon.minOrderAmount)          return res.status(400).json({ message: `Min order ₹${coupon.minOrderAmount}` });

  let discount = coupon.discountType === 'flat'
    ? coupon.discountValue
    : (orderAmount * coupon.discountValue) / 100;

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  res.json({ discount, finalAmount: orderAmount - discount });
};
```

### 2. Admin Dashboard
```js
// Admin-only routes (role: 'admin')

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  const [totalUsers, totalOrders, totalRevenue, activeRestaurants] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Restaurant.countDocuments({ isOpen: true })
  ]);

  res.json({
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    activeRestaurants
  });
};
```

---

## 📦 Required Packages

```bash
# Install all new dependencies
npm install \
  express-rate-limit \
  express-validator \
  redis \
  ioredis \
  cloudinary \
  multer \
  multer-storage-cloudinary \
  winston \
  morgan
```

### Environment Variables to Add
```env
# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_secret

# JWT
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret

# App
NODE_ENV=development
PORT=5000
```

---

## 🗂 Suggested Folder Structure

```
Backend/
├── config/
│   ├── db.js           # MongoDB connection
│   ├── redis.js        # Redis client
│   └── cloudinary.js   # Cloudinary config
├── controllers/
│   ├── authController.js
│   ├── orderController.js
│   ├── restaurantController.js
│   ├── dishController.js
│   ├── paymentController.js
│   ├── trackingController.js
│   └── adminController.js
├── middleware/
│   ├── authenticate.js  # JWT verification
│   ├── authorize.js     # Role-based access
│   ├── upload.js        # Multer + Cloudinary
│   ├── rateLimiter.js   # Rate limiting
│   ├── validate.js      # express-validator helpers
│   └── errorHandler.js  # Centralized error handler
├── models/
│   ├── UserModel.js
│   ├── OrderModel.js
│   ├── RestaurantModel.js
│   ├── CategoryModel.js  ← NEW
│   ├── DishModel.js      ← NEW
│   ├── ReviewModel.js    ← NEW
│   ├── EarningsModel.js  ← NEW
│   └── CouponModel.js    ← NEW
├── routes/
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── restaurantRoutes.js
│   ├── dishRoutes.js
│   ├── paymentRoutes.js
│   ├── riderRoutes.js
│   └── adminRoutes.js
├── socket/
│   └── socketHandler.js  # All Socket.io event handlers
├── utils/
│   ├── logger.js         # Winston logger
│   └── createError.js    # Error factory
└── app.js
```

---

## ✅ Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 High  | Multer + Cloudinary image upload | 1 day | Owner can add dish images |
| 🔴 High  | Category → Dish schema + routes | 1 day | Full menu management |
| 🔴 High  | PATCH /dish/:id update route | 0.5 day | Owner can edit dishes |
| 🟡 Medium | Redis cart persistence | 1 day | Better UX on refresh |
| 🟡 Medium | Socket.io order rooms (full) | 1 day | Live tracking for customer |
| 🟡 Medium | Rider earnings / wallet | 1 day | Rider monetization |
| 🟢 Low   | Redis menu caching | 0.5 day | Performance |
| 🟢 Low   | Centralized error handler | 0.5 day | Code quality |
| 🟢 Low   | Reviews & ratings | 1 day | Trust signals |
| 🟢 Low   | Coupons & discounts | 1.5 days | Marketing |
| 🟢 Low   | Admin dashboard | 2 days | Operations |

---

*Generated for Food Delivery Vingo App — Advanced Monolithic System Design*