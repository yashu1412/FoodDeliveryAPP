import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";

export default function RiderDashboard() {
  const { user } = useAppContext();
  const [isAvailable, setIsAvailable] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "deliveryBoy") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [earningsRes, ordersRes] = await Promise.all([
        api.riders.getEarnings(),
        api.orders.getAll(),
      ]);
      setEarnings(earningsRes);
      setOrders(ordersRes.orders.filter(order => order.deliveryPartner === user._id));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      await api.riders.toggleAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  if (user?.role !== "deliveryBoy") {
    return <div className="container mx-auto p-8 text-center">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Rider Dashboard</h1>
          <button
            onClick={toggleAvailability}
            className={`px-6 py-2 rounded-lg font-medium ${
              isAvailable ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {isAvailable ? "Online" : "Offline"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-[#ff4d2d]">₹{earnings?.total || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">₹{earnings?.pending || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Deliveries</h3>
            <p className="text-3xl font-bold text-gray-800">{earnings?.history?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Deliveries</h2>
          </div>
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No deliveries yet</div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order._id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">Total: ₹{order.pricing?.grandTotal || 0}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
