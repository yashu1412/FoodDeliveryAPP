import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import { apiRequest, getImageFallback } from "../utils/api";

export default function Cart() {
  const navigate = useNavigate();
  const { refreshCartCount } = useAppContext();
  const [cartData, setCartData] = useState({ cart: null, restaurant: null, pricing: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/cart");
      setCartData(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      const data = await apiRequest("/cart", {
        method: "PUT",
        body: JSON.stringify({ menuItemId, quantity }),
      });

      setCartData(data);
      refreshCartCount();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      const data = await apiRequest(`/cart/${menuItemId}`, {
        method: "DELETE",
      });

      setCartData(data);
      refreshCartCount();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const clearCart = async () => {
    try {
      const data = await apiRequest("/cart/clear", {
        method: "DELETE",
      });

      setCartData(data);
      refreshCartCount();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const items = cartData.cart?.items || [];

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-gray-600">
                Review items, update quantity, and proceed to checkout.
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear Cart
              </button>
            )}
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">Loading cart...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-4">Add some items from the restaurant menu to continue.</p>
              <Link
                to="/services"
                className="inline-block rounded-lg bg-[#ff4d2d] px-5 py-3 text-white font-semibold"
              >
                Browse Restaurants
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.menuItem}
                    className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-4"
                  >
                    <img
                      src={item.image || getImageFallback}
                      alt={item.name}
                      className="w-full md:w-36 h-28 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {cartData.restaurant?.name || "Restaurant"}
                          </p>
                        </div>
                        <div className="text-lg font-bold text-[#ff4d2d]">
                          Rs. {item.price}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.menuItem, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 rounded-full border border-gray-300"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                          className="w-10 h-10 rounded-full border border-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.menuItem)}
                          className="ml-auto text-sm text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="bg-white rounded-2xl shadow-sm p-5 h-fit">
                <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>Rs. {cartData.pricing?.itemsTotal || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>Rs. {cartData.pricing?.deliveryFee || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs. {cartData.pricing?.taxAmount || 0}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                    <span>Grand Total</span>
                    <span>Rs. {cartData.pricing?.grandTotal || 0}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-5 rounded-lg bg-[#ff4d2d] py-3 text-white font-semibold"
                >
                  Proceed to Checkout
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
