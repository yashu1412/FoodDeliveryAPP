import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import { apiRequest, getImageFallback } from "../utils/api";

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, refreshCartCount } = useAppContext();
  const [restaurants, setRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedRestaurantId = searchParams.get("restaurantId") || "";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await apiRequest("/restaurants");
        setRestaurants(data.restaurants || []);

        if (!selectedRestaurantId && data.restaurants?.length) {
          setSearchParams({ restaurantId: data.restaurants[0]._id });
        }
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!selectedRestaurantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiRequest(`/menu/restaurant/${selectedRestaurantId}`);
        setItems(data.items || []);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedRestaurantId]);

  const selectedRestaurant = restaurants.find((restaurant) => restaurant._id === selectedRestaurantId);

  const categories = useMemo(() => {
    const values = new Set(items.map((item) => item.category || "General"));
    return ["All", ...values];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, category]);

  const addToCart = async (menuItemId) => {
    try {
      if (!isAuthenticated) {
        setError("Please sign in before adding items to cart");
        return;
      }

      const data = await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({
          menuItemId,
          quantity: 1,
        }),
      });

      setMessage(data.message);
      refreshCartCount();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <>
      <div className="py-24 px-6 md:px-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold text-orange-500 mb-2">Restaurant Menu</h2>
              <p className="text-gray-600">
                Browse live menu items from the backend and add them directly to cart.
              </p>
            </div>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-lg bg-[#ff4d2d] px-5 py-3 text-white font-semibold"
            >
              Go to Cart
            </Link>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <aside className="bg-white rounded-2xl p-5 shadow-sm h-fit">
              <h3 className="text-lg font-semibold mb-4">Restaurants</h3>
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant._id}
                    onClick={() => setSearchParams({ restaurantId: restaurant._id })}
                    className={`w-full rounded-xl border p-3 text-left ${
                      selectedRestaurantId === restaurant._id
                        ? "border-[#ff4d2d] bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="font-semibold">{restaurant.name}</div>
                    <div className="text-sm text-gray-500">
                      {restaurant.address?.city}, {restaurant.address?.state}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section>
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <h3 className="text-2xl font-bold">{selectedRestaurant?.name || "Select a restaurant"}</h3>
                <p className="text-gray-600 mt-1">{selectedRestaurant?.description || "Menu will appear here once a restaurant is selected."}</p>
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search dishes..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3"
                  />
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-3"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm">Loading menu...</div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm">No menu items found.</div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition"
                    >
                      <img
                        src={item.image || getImageFallback}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                            {item.category || "General"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 min-h-10">
                          {item.description || "Freshly prepared and delivered hot."}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-xl font-bold text-orange-600">
                              Rs. {item.discountPrice || item.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.preparationTime || 20} mins | {item.isVeg ? "Veg" : "Non-Veg"}
                            </p>
                          </div>
                          <button
                            onClick={() => addToCart(item._id)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Menu;
