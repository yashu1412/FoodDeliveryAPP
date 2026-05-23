import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";

export default function OwnerDashboard() {
  const { user } = useAppContext();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role === "owner") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [restaurantRes, ordersRes] = await Promise.all([
        api.restaurants.getMyRestaurant(),
        api.orders.getAll(),
      ]);
      setRestaurant(restaurantRes.restaurant);
      if (restaurantRes.restaurant) {
        const [menuRes, categoriesRes] = await Promise.all([
          api.menu.getByRestaurant(restaurantRes.restaurant._id),
          api.categories.getByRestaurant(restaurantRes.restaurant._id),
        ]);
        setMenuItems(menuRes.items);
        setCategories(categoriesRes.categories);
      }
      setOrders(ordersRes.orders);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = async () => {
    try {
      await api.restaurants.toggleOpen();
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  if (user?.role !== "owner") {
    return <div className="container mx-auto p-8 text-center">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={toggleOpen}
              className={`px-4 py-2 rounded-lg font-medium ${
                restaurant?.isOpen
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {restaurant?.isOpen ? "Open" : "Closed"}
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b">
          {["overview", "orders", "menu", "categories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab ? "border-b-2 border-[#ff4d2d] text-[#ff4d2d]" : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Menu Items</h3>
              <p className="text-3xl font-bold text-gray-800">{menuItems.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Categories</h3>
              <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Rating</h3>
              <p className="text-3xl font-bold text-gray-800">{restaurant?.rating || 0}/5</p>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user?.fullName || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.pricing?.grandTotal || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-[#ff4d2d] font-bold mt-2">₹{item.price}</p>
                  <p className={`text-sm mt-1 ${item.isAvailable ? "text-green-600" : "text-red-600"}`}>
                    {item.isAvailable ? "Available" : "Out of Stock"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div key={category._id} className="border rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
