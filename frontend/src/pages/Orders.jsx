import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";

const STATUS_LABELS = {
  pending: "Pending Payment",
  confirmed: "Confirmed",
  preparing: "Preparing",
  picked: "Picked Up",
  on_the_way: "On The Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Orders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/orders/my-orders");
        setOrders(data.orders || []);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createdOrderId = searchParams.get("created");

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-gray-600 mb-6">
            Track past orders, payment status, and delivery progress.
          </p>

          {createdOrderId && (
            <p className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
              Your order was created successfully.
            </p>
          )}

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">No orders found yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order._id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {order.restaurant?.name || "Restaurant"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Order ID: {order._id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: {order.payment?.method?.toUpperCase()} | {order.payment?.status}
                      </p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-lg font-bold text-[#ff4d2d]">
                        Rs. {order.pricing?.grandTotal || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        {STATUS_LABELS[order.status] || order.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    {order.items.map((item) => (
                      <div key={`${order._id}-${item.menuItem}`} className="rounded-lg bg-gray-50 p-3">
                        {item.name} x {item.quantity} - Rs. {item.price * item.quantity}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/track/${order._id}`}
                      className="rounded-lg bg-[#ff4d2d] px-4 py-2 text-white font-medium"
                    >
                      Track Order
                    </Link>
                    <div className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">
                      Delivery to: {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
