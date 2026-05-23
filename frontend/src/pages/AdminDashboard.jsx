import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";

export default function AdminDashboard() {
  const { user } = useAppContext();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role === "admin") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.admin.getOrders(),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users);
      setOrders(ordersRes.orders);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  if (user?.role !== "admin") {
    return <div className="container mx-auto p-8 text-center">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6 border-b">
          {["overview", "users", "orders"].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-[#ff4d2d]">₹{stats?.totalRevenue || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Active Restaurants</h3>
              <p className="text-3xl font-bold text-green-600">{stats?.activeRestaurants || 0}</p>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" :
                          user.role === "owner" ? "bg-blue-100 text-blue-800" :
                          user.role === "deliveryBoy" ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">All Orders</h2>
            </div>
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
      </div>
    </div>
  );
}
