import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import { apiRequest } from "../utils/api";
import { loadScript } from "../utils/loadScript";

const initialAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  latitude: "",
  longitude: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { user, refreshCartCount } = useAppContext();
  const [cartData, setCartData] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    ...initialAddress,
    fullName: user?.fullName || "",
    phone: user?.mobile || "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchCart();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const normalizedAddress = {
    ...deliveryAddress,
    latitude: deliveryAddress.latitude ? Number(deliveryAddress.latitude) : null,
    longitude: deliveryAddress.longitude ? Number(deliveryAddress.longitude) : null,
  };

  const handleCashOnDelivery = async () => {
    try {
      setSubmitting(true);
      setError("");
      const data = await apiRequest("/orders/cod", {
        method: "POST",
        body: JSON.stringify({
          deliveryAddress: normalizedAddress,
        }),
      });

      refreshCartCount();
      navigate(`/orders?created=${data.order._id}`);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    try {
      setSubmitting(true);
      setError("");
      await loadScript("https://checkout.razorpay.com/v1/checkout.js", "razorpay-checkout-script");

      const data = await apiRequest("/payments/razorpay/order", {
        method: "POST",
        body: JSON.stringify({
          deliveryAddress: normalizedAddress,
        }),
      });

      const options = {
        key: data.razorpayKey,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "Vingo Food Delivery",
        description: "Checkout Payment",
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          try {
            await apiRequest("/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                orderId: data.order._id,
                ...response,
              }),
            });

            refreshCartCount();
            navigate(`/orders?created=${data.order._id}`);
          } catch (verifyError) {
            setError(verifyError.message);
          }
        },
        prefill: {
          name: normalizedAddress.fullName,
          email: user?.email,
          contact: normalizedAddress.phone,
        },
        theme: {
          color: "#ff4d2d",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const items = cartData?.cart?.items || [];

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600 mb-6">Add your address and place the order with COD or Razorpay.</p>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">Loading checkout...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">Your cart is empty.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(deliveryAddress).map(([key, value]) => (
                    <input
                      key={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder={key.replace(/([A-Z])/g, " $1")}
                      className={`rounded border border-gray-300 p-3 ${
                        key === "line1" || key === "line2" ? "md:col-span-2" : ""
                      }`}
                    />
                  ))}
                </div>
              </section>

              <aside className="bg-white rounded-2xl p-6 shadow-sm h-fit">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.menuItem} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-4">
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
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>Rs. {cartData.pricing?.grandTotal || 0}</span>
                  </div>
                </div>
                <button
                  onClick={handleRazorpayCheckout}
                  disabled={submitting}
                  className="w-full mt-5 rounded-lg bg-[#ff4d2d] py-3 text-white font-semibold disabled:opacity-70"
                >
                  {submitting ? "Processing..." : "Pay with Razorpay"}
                </button>
                <button
                  onClick={handleCashOnDelivery}
                  disabled={submitting}
                  className="w-full mt-3 rounded-lg border border-[#ff4d2d] py-3 text-[#ff4d2d] font-semibold disabled:opacity-70"
                >
                  Cash on Delivery
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
