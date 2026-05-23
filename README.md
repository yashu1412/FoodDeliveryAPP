# 🍔 SwiftEats — Full-Stack Food Delivery App

A complete MERN stack food delivery application with real-time tracking, payment integration, and more!

---

## ✨ Features

### 🎯 Core Features
- ✅ User Authentication (Email/Password, Google One Tap)
- ✅ Password Reset via Email OTP
- ✅ Restaurant Browsing & Menu
- ✅ Cart & Checkout
- ✅ Razorpay Payment Gateway
- ✅ Real-time Order Tracking (Socket.io + Google Maps)
- ✅ Order History
- ✅ Restaurant Owner Dashboard
- ✅ Delivery Boy Dashboard
- ✅ Admin Dashboard
- ✅ Coupon & Discount System
- ✅ Reviews & Ratings

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js**
- **MongoDB (Mongoose)**
- **Socket.io** (Real-time communication)
- **Razorpay** (Payments)
- **Nodemailer** (Emails)
- **JWT** (Authentication)
- **Redis** (Caching)
- **Cloudinary** (Image Storage)

### Frontend
- **React 18 + Vite**
- **React Router v6**
- **Lucide React** (Icons)
- **CSS Variables** (Design System)
- **Google Fonts** (Syne + DM Sans)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yashu1412/FoodDeliveryAPP.git
cd FoodDeliveryAPP
```

#### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your-jwt-secret-here
NODE_ENV=development
SMTP_MAIL=your-email@gmail.com
SMTP_APP_PASSWORD=your-gmail-app-password
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
REDIS_URL=redis://localhost:6379
```

Run backend server:
```bash
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run frontend server:
```bash
npm run dev
```

#### 4. Seed Sample Data (Optional)
```bash
cd Backend
npm run seed
```

This will create:
- 4 users (Admin, Owner, Rider, Customer)
- 1 Restaurant
- 3 Categories
- 4 Menu Items
- 2 Coupons

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@yashpalsingh.com | admin123 |
| Owner | yashpalsinghpawara@gmail.com | owner123 |
| Rider | delivery@yashpalsingh.com | rider123 |
| Customer | customer@yashpalsingh.com | customer123 |

---

## 📱 Pages & Features

### 🏠 Home Page
- Hero banner
- Category chips
- Top restaurants grid
- Popular dishes horizontal scroll
- Veg/Non-veg indicators

### 🍽️ Restaurant Detail Page
- Hero image
- Restaurant info (cuisine, rating, delivery time)
- Category tabs
- Menu items with quantity steppers
- Floating cart summary

### 🛒 Cart Page
- Cart items with quantity controls
- Empty cart state
- Order summary (subtotal, delivery fee, tax)
- Coupon code input
- Proceed to checkout button

### 📦 Checkout Page
- Delivery address selection
- Add new address form
- Payment method selection (Razorpay, COD)
- Order summary

### 📍 Order Tracking Page
- Status stepper
- Live tracking (Google Maps placeholder)
- Rider info card
- Collapsible order items

### 📋 Order History Page
- Tabs (Active/Past Orders)
- Order cards with restaurant, items, status
- Re-order & Track buttons

---

## 📊 User Roles

### 👤 Customer
- Browse restaurants & menu
- Add to cart & checkout
- Track orders in real-time
- View order history
- Write reviews & ratings

### 🏪 Restaurant Owner
- Manage restaurant profile
- Create & manage menu
- View & update orders
- Toggle restaurant open/closed
- View sales stats

### 🚚 Delivery Boy
- Toggle availability
- Accept delivery orders
- Update order status (picked → on_the_way → delivered)
- View earnings
- Track delivery history

### 🔧 Admin
- View platform stats
- Manage users
- Manage all orders
- Manage coupons

---

## 📁 Project Structure

```
FoodDeliveryAPP/
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── redis.js
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── layout/
    │   │   └── food/
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── Home.jsx
    │   │   ├── RestaurantDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderTracking.jsx
    │   │   ├── OrderHistory.jsx
    │   │   └── ...
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 🎨 Design System

### Brand Identity
- **Name**: SwiftEats
- **Tagline**: Hot food. Swift delivery.
- **Theme**: Light theme only
- **Primary Color**: Spice Orange (#FF5C00)

### Color Palette
```css
--color-primary: #FF5C00;
--color-primary-light: #FF7A2E;
--color-primary-dark: #D94E00;
--color-bg: #FFFFFF;
--color-bg-soft: #FFF8F5;
--color-text-primary: #1A1A1A;
```

### Typography
- **Display/Headings**: Syne (Bold/Extra Bold)
- **Body/UI**: DM Sans (400/500/600)

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Signup
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/send-otp` - Send reset OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/my` - Get owner's restaurant
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/:id` - Update restaurant

### Menu
- `GET /api/menu/restaurant/:id` - Get restaurant menu
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Tracking
- `PUT /api/tracking/:orderId` - Update tracking location
- `GET /api/tracking/:orderId` - Get tracking history

---

## 📸 Pages Preview

### 🏠 Home Page
![Home Page](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/home.png)

### 🍽️ Restaurant Detail
![Restaurant Detail](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/restaurant-detail.png)

### 🛒 Cart
![Cart](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/cart.png)

### 📦 Checkout
![Checkout](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/checkout.png)

### 📍 Order Tracking
![Order Tracking](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/tracking.png)

### 📋 Order History
![Order History](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/order-history.png)

### 🔐 Login
![Login](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/login.png)

### 📝 Signup
![Signup](https://github.com/yashu1412/FoodDeliveryAPP/raw/main/screenshots/signup.png)

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Yashpalsingh Pawara**
- Email: yashpalsinghpawara@gmail.com
- Phone: +91 9359028987

---

## 🙏 Acknowledgments

Special thanks to all open-source contributors!

---

*Built with ❤️ by Yashpalsingh Pawara*
