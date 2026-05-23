# 🍔 SwiftEats — Frontend UI Design Prompt (Trae / Cursor Ready)

Copy and paste the full prompt below into Trae AI or Cursor Composer.

---

## ✅ TRAE PROMPT — COPY FROM HERE

```
You are a senior frontend engineer and UI/UX designer. Build a complete, production-grade React frontend for a food delivery app called **SwiftEats**.

---

## 🎨 DESIGN SYSTEM

### Brand Identity
- App Name: SwiftEats
- Tagline: "Hot food. Swift delivery."
- Theme: Light theme only
- Personality: Energetic, fresh, modern, appetizing

### Color Palette (use as CSS variables)
```css
:root {
  /* Primary — Spice Orange */
  --color-primary:        #FF5C00;
  --color-primary-light:  #FF7A2E;
  --color-primary-dark:   #D94E00;
  --color-primary-50:     #FFF0E8;
  --color-primary-100:    #FFD9C2;

  /* Backgrounds */
  --color-bg:             #FFFFFF;
  --color-bg-soft:        #FFF8F5;
  --color-bg-muted:       #F5F5F5;
  --color-bg-card:        #FFFFFF;

  /* Text */
  --color-text-primary:   #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-text-muted:     #A0A0A0;
  --color-text-inverse:   #FFFFFF;

  /* Accents */
  --color-accent-yellow:  #FFB800;
  --color-accent-green:   #2ECC71;
  --color-accent-red:     #E74C3C;

  /* Borders & Shadows */
  --color-border:         #EBEBEB;
  --color-border-focus:   #FF5C00;
  --shadow-sm:            0 1px 4px rgba(0,0,0,0.06);
  --shadow-md:            0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg:            0 8px 32px rgba(0,0,0,0.14);
  --shadow-spice:         0 8px 32px rgba(255,92,0,0.18);

  /* Radius */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-full: 9999px;

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}
```

### Typography
- Display / Headings: `Syne` (Google Fonts) — bold, geometric, modern
- Body / UI text: `DM Sans` (Google Fonts) — clean, readable
- Import in index.html:
  `https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap`

### Design Principles
- White base with spice orange (#FF5C00) as the dominant accent
- Cards: white with subtle shadow, rounded corners (12–20px)
- Buttons: solid spice orange with white text; hover darkens slightly
- Tags/chips: `--color-primary-50` background with `--color-primary` text
- Inputs: white bg, `--color-border` border, orange focus ring
- Active states: orange glow (`--shadow-spice`)
- Micro-animations on all interactive elements (hover scale, tap press)

---

## 📱 PAGES & COMPONENTS TO BUILD

### 1. 🏠 Home / Discovery Page (`/`)
- Sticky navbar: SwiftEats logo (🌶️ icon + wordmark), location selector, search bar, cart icon with item count badge, profile avatar
- Hero banner: Large gradient card (spice orange → warm amber) with "Hungry? We're swift." headline and a search bar for dishes/restaurants
- Category pills: Horizontal scrollable chips — 🍕 Pizza, 🍔 Burger, 🍜 Noodles, 🍣 Sushi, 🍗 Chicken, 🌮 Tacos, 🥗 Salad, 🍩 Desserts
- "Top Restaurants Near You" section: Grid of restaurant cards
- "Popular Dishes" section: Horizontal scroll of dish cards
- Footer: minimal

**Restaurant Card Component:**
- Cover image (full width top)
- Restaurant name in `Syne` font
- Cuisine tags (chips)
- Rating (⭐ + number), delivery time (🕐 + mins), delivery fee
- "Open" green badge or "Closed" grey badge
- Hover: card lifts with `--shadow-spice`, cover image zooms slightly

**Dish Card Component (compact):**
- Square image
- Dish name, price in orange
- ➕ add button (orange circle)
- Veg 🟢 / Non-veg 🔴 indicator dot

---

### 2. 🍽️ Restaurant Detail Page (`/restaurant/:id`)
- Hero: full-width restaurant banner image with gradient overlay, restaurant name, rating, tags
- Sticky sub-nav: category tabs (Starters | Mains | Desserts | Drinks) that scroll to sections
- Menu layout: left sidebar with category list (desktop), main area with dish listings
- Dish row: image thumbnail, name + description, price, veg/non-veg dot, qty stepper (+/-)
- Floating cart summary bar at bottom: "X items · ₹XXX — View Cart →" (orange bar, slides up when cart has items)

---

### 3. 🛒 Cart Page (`/cart`)
- List of cart items: image, name, restaurant name, qty stepper, line total, remove button
- Empty cart state: illustration + "Nothing here yet. Let's fix that 🍔" + Browse button
- Order summary card (right side on desktop, bottom on mobile):
  - Item total
  - Delivery fee
  - Taxes (5%)
  - Coupon input field with "Apply" button
  - **Total in bold orange**
  - "Proceed to Checkout" CTA button (full width, orange)

---

### 4. 📦 Checkout Page (`/checkout`)
- Delivery address section: saved addresses (radio select) + "Add new address" form
- Payment method section:
  - Razorpay (card/UPI/netbanking) — default selected with orange radio
  - Cash on Delivery
- Order summary (compact, right column)
- "Place Order" button: large, full width, orange, with 🛵 icon

---

### 5. 📍 Live Order Tracking Page (`/orders/:id/track`)
- Status stepper at top: Confirmed → Preparing → Picked Up → On the Way → Delivered
  - Active step: orange filled circle, completed: orange checkmark, upcoming: grey
- Google Maps embed (full width, 50vh) with rider pin (🛵) and destination pin (📍)
- Rider info card: avatar, name, phone (call button), rating
- Order items summary (collapsible)
- Estimated time in large bold orange text: "12 min away"

---

### 6. 📋 Order History Page (`/orders`)
- Tabs: Active Orders | Past Orders
- Order card: restaurant name + image, items summary, total, date, status badge, "Re-order" button (outline orange), "Track" button (filled orange, only for active)
- Status badges:
  - `pending` → yellow chip
  - `preparing` → orange chip
  - `on_the_way` → blue chip
  - `delivered` → green chip
  - `cancelled` → red chip

---

### 7. 🏪 Owner Dashboard (`/owner/dashboard`)
- Sidebar nav: Dashboard, Orders, Menu, Settings
- Stats row: Total Orders, Today's Revenue, Active Orders, Avg Rating — in stat cards with icons
- Orders table: order ID, customer name, items, total, status dropdown (owner can update), time
- Quick toggle: Restaurant Open / Closed (large toggle switch, green/red)

---

### 8. 🍽️ Owner Menu Management (`/owner/menu`)
- Category tabs across top, "+ Add Category" button
- Dish grid: each dish card shows image, name, price, veg dot, available toggle, Edit / Delete icons
- "Add Dish" floating action button (orange circle, bottom right)
- **Add/Edit Dish Modal:**
  - Image upload zone (dashed border, drag & drop, preview)
  - Fields: Dish Name, Description, Price, Category (dropdown), Prep Time, Veg/Non-veg toggle, Available toggle
  - Save button (orange)

---

### 9. 🚚 Delivery Boy App (`/delivery/dashboard`)
- Status toggle: Available / Offline (prominent top toggle)
- Active order card (if assigned): restaurant pickup address, customer drop address, Google Maps link, status update buttons (Picked Up → On the Way → Delivered)
- Earnings summary: Today ₹XXX | This Week ₹XXX | Total ₹XXX
- Past deliveries list

---

### 10. 🔐 Auth Pages (`/login`, `/signup`)
- Centered card on soft background (`--color-bg-soft`)
- SwiftEats logo + tagline at top
- Login: email + password fields, "Forgot password?" link, Login button (orange), divider, "Continue with Google" button
- Signup: name, email, password, role selector (Customer / Restaurant Owner / Delivery Boy) as visual card buttons, Sign Up button
- Smooth tab switch animation between Login / Signup

---

## 🧩 SHARED COMPONENT LIBRARY

Build these reusable components:

```
components/
├── ui/
│   ├── Button.jsx          // variant: primary | outline | ghost | danger, size: sm | md | lg
│   ├── Input.jsx           // with label, error state, icon slot
│   ├── Badge.jsx           // status colors mapped automatically
│   ├── Card.jsx            // base card wrapper with shadow
│   ├── Avatar.jsx          // circular image with fallback initials
│   ├── Spinner.jsx         // orange spinning loader
│   ├── Modal.jsx           // centered overlay with backdrop blur
│   ├── Toast.jsx           // bottom-right notifications (success/error/info)
│   └── Toggle.jsx          // iOS-style toggle, orange when on
├── layout/
│   ├── Navbar.jsx          // sticky top nav
│   ├── Sidebar.jsx         // owner/delivery sidebar
│   └── BottomNav.jsx       // mobile bottom navigation (4 icons)
├── food/
│   ├── RestaurantCard.jsx
│   ├── DishCard.jsx
│   ├── CartItem.jsx
│   ├── OrderCard.jsx
│   └── StatusStepper.jsx
└── maps/
    └── TrackingMap.jsx     // Google Maps wrapper
```

---

## 📐 LAYOUT & RESPONSIVENESS

- Mobile first (375px base)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Desktop: sidebar layouts, 2–3 column grids
- Mobile: single column, bottom nav bar, sheet modals
- Use CSS Grid and Flexbox (no external layout libraries)

---

## ⚡ ANIMATIONS & INTERACTIONS

```css
/* Standard transitions */
--transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);
```

- Button hover: `transform: translateY(-1px); box-shadow: var(--shadow-spice);`
- Button active: `transform: translateY(0) scale(0.98);`
- Card hover: `transform: translateY(-4px); box-shadow: var(--shadow-lg);`
- Page transitions: fade + slide up (150ms)
- Cart badge: bounce animation when item added
- Status stepper: animate progress fill left-to-right
- Dish image on restaurant card: `transform: scale(1.05)` on card hover
- Add to cart button: scale pop + color flash

---

## 🛠️ TECH STACK

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **State**: Context API + useReducer (cart, auth, orders)
- **HTTP**: Axios with base URL from `.env`
- **Real-time**: Socket.io-client
- **Maps**: Google Maps JavaScript API (`@react-google-maps/api`)
- **Icons**: Lucide React
- **Styling**: Plain CSS with CSS variables (no Tailwind, no styled-components)
- **Fonts**: Google Fonts (Syne + DM Sans)
- **Notifications**: Custom Toast component

---

## 📁 FOLDER STRUCTURE

```
src/
├── api/
│   ├── axios.js           // base axios instance
│   ├── auth.js
│   ├── restaurants.js
│   ├── orders.js
│   └── payments.js
├── components/
│   ├── ui/                // shared UI components
│   ├── layout/
│   ├── food/
│   └── maps/
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── SocketContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── Restaurant.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderTracking.jsx
│   ├── OrderHistory.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── owner/
│   │   ├── Dashboard.jsx
│   │   └── MenuManagement.jsx
│   └── delivery/
│       └── Dashboard.jsx
├── hooks/
│   ├── useCart.js
│   ├── useAuth.js
│   └── useSocket.js
├── utils/
│   ├── formatCurrency.js  // ₹ formatter
│   ├── formatTime.js
│   └── constants.js
├── styles/
│   ├── variables.css      // all CSS variables
│   ├── reset.css
│   ├── typography.css
│   └── animations.css
├── App.jsx
└── main.jsx
```

---

## 🔌 API INTEGRATION

Backend base URL from environment:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_KEY=your_key_here
```

Axios instance:
```js
// src/api/axios.js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 🎯 EXTRA DETAILS

- Show ₹ (Indian Rupee) for all prices
- Veg indicator: filled green circle 🟢, Non-veg: filled red circle 🔴
- All food images: use `https://source.unsplash.com/400x300/?food,{dishname}` as placeholder
- Restaurant images: `https://source.unsplash.com/800x400/?restaurant,food`
- Empty states: friendly illustrations (use inline SVG) + helpful CTA
- Loading states: skeleton screens (grey animated shimmer), NOT spinners for page loads
- Error states: friendly message + retry button
- All forms: real-time validation with inline error messages in red
- Mobile: bottom sheet for cart summary, modals fullscreen

---

## 🚀 START HERE

Build in this order:
1. `styles/variables.css` + `styles/reset.css` + `styles/typography.css`
2. Shared UI components (Button, Input, Card, Badge, Toast, Modal)
3. Layout components (Navbar, BottomNav)
4. AuthContext + CartContext + SocketContext
5. Auth pages (Login + Signup)
6. Home page (full, with mock data)
7. Restaurant detail page
8. Cart page
9. Checkout page
10. Order tracking page
11. Order history page
12. Owner dashboard + menu management
13. Delivery boy dashboard
14. Wire all pages to real API endpoints

Use realistic mock data for development. Every component must be fully functional and visually polished before moving to the next.
```

---

## 📌 QUICK REFERENCE

| Item | Value |
|------|-------|
| Primary color | `#FF5C00` (Spice Orange) |
| Background | `#FFFFFF` (White) |
| Soft background | `#FFF8F5` |
| Heading font | Syne (700/800) |
| Body font | DM Sans (400/500) |
| Border radius | 8px / 12px / 20px |
| Primary shadow | `0 8px 32px rgba(255,92,0,0.18)` |
| Currency | ₹ Indian Rupee |
| Framework | React 18 + Vite |
| Styling | Plain CSS with variables |

---

*SwiftEats UI Design Prompt — ready for Trae AI / Cursor Composer*