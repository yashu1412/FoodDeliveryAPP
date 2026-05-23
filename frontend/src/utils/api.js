import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getImageFallback = "https://placehold.co/600x400?text=Food+Delivery";

export { API_BASE_URL };

export const api = {
  auth: {
    signin: (data) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    signup: (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    me: () => apiRequest("/auth/me"),
    logout: () => apiRequest("/auth/logout", { method: "POST" }),
    sendOtp: (email) => apiRequest("/auth/send-otp", { method: "POST", body: JSON.stringify({ email }) }),
    verifyOtp: (data) => apiRequest("/auth/verify-otp", { method: "POST", body: JSON.stringify(data) }),
    resetPassword: (data) => apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),
  },
  restaurants: {
    getAll: () => apiRequest("/restaurants"),
    getById: (id) => apiRequest(`/restaurants/${id}`),
    getMyRestaurant: () => apiRequest("/restaurants/my"),
    create: (data) => apiRequest("/restaurants", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/restaurants/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    toggleOpen: () => apiRequest("/restaurants/my/toggle-open", { method: "PATCH" }),
  },
  menu: {
    getByRestaurant: (restaurantId) => apiRequest(`/menu/restaurant/${restaurantId}`),
    create: (data) => apiRequest("/menu", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/menu/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/menu/${id}`, { method: "DELETE" }),
  },
  categories: {
    getByRestaurant: (restaurantId) => apiRequest(`/categories/restaurant/${restaurantId}`),
    create: (data) => apiRequest("/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/categories/${id}`, { method: "DELETE" }),
  },
  cart: {
    get: () => apiRequest("/cart"),
    addItem: (data) => apiRequest("/cart/items", { method: "POST", body: JSON.stringify(data) }),
    updateQuantity: (itemId, data) => apiRequest(`/cart/items/${itemId}`, { method: "PATCH", body: JSON.stringify(data) }),
    removeItem: (itemId) => apiRequest(`/cart/items/${itemId}`, { method: "DELETE" }),
    clear: () => apiRequest("/cart", { method: "DELETE" }),
  },
  orders: {
    getAll: () => apiRequest("/orders"),
    getById: (id) => apiRequest(`/orders/${id}`),
    create: (data) => apiRequest("/orders", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id, data) => apiRequest(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
    assignRider: (id, riderId) => apiRequest(`/orders/${id}/assign-rider`, { method: "PATCH", body: JSON.stringify({ riderId }) }),
  },
  payments: {
    createRazorpayOrder: (data) => apiRequest("/payments/create-order", { method: "POST", body: JSON.stringify(data) }),
    verifyPayment: (data) => apiRequest("/payments/verify-payment", { method: "POST", body: JSON.stringify(data) }),
  },
  tracking: {
    update: (orderId, data) => apiRequest(`/tracking/${orderId}`, { method: "POST", body: JSON.stringify(data) }),
    get: (orderId) => apiRequest(`/tracking/${orderId}`),
  },
  reviews: {
    submit: (data) => apiRequest("/reviews", { method: "POST", body: JSON.stringify(data) }),
    getByRestaurant: (restaurantId) => apiRequest(`/reviews/restaurant/${restaurantId}`),
  },
  riders: {
    toggleAvailability: (isAvailable) => apiRequest("/riders/availability", { method: "PATCH", body: JSON.stringify({ isAvailable }) }),
    getAvailable: () => apiRequest("/riders/available"),
    getEarnings: () => apiRequest("/riders/earnings"),
  },
  coupons: {
    getAll: () => apiRequest("/coupons"),
    apply: (data) => apiRequest("/coupons/apply", { method: "POST", body: JSON.stringify(data) }),
    create: (data) => apiRequest("/coupons", { method: "POST", body: JSON.stringify(data) }),
  },
  admin: {
    getStats: () => apiRequest("/admin/stats"),
    getUsers: () => apiRequest("/admin/users"),
    getOrders: () => apiRequest("/admin/orders"),
  },
};
