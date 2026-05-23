import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { apiRequest, getImageFallback } from "../utils/api";

export default function Service() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/restaurants");
        setRestaurants(data.restaurants || []);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const cities = useMemo(() => {
    const values = new Set(restaurants.map((restaurant) => restaurant.address?.city).filter(Boolean));
    return ["All", ...values];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesQuery =
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine?.join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCity = cityFilter === "All" || restaurant.address?.city === cityFilter;
      return matchesQuery && matchesCity;
    });
  }, [restaurants, query, cityFilter]);

  return (
    <>
      <main className="min-h-screen p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-white mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Discover Restaurants</h1>
              <p className="text-gray-600 mt-1">
                Live backend-powered list of restaurants, cuisines, and delivery details.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search restaurants or cuisines..."
                className="w-full sm:w-80 rounded-lg border border-gray-300 px-4 py-3"
              />
              <select
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-3"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">Loading restaurants...</div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">No restaurants found.</div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <article
                  key={restaurant._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={restaurant.image || getImageFallback}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {restaurant.address?.city}, {restaurant.address?.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{restaurant.rating || 0} ★</div>
                        <div className="text-xs text-gray-500">
                          {restaurant.averageDeliveryTime || 30} mins
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 min-h-12">
                      {restaurant.description || "Fresh food, fast delivery, and real-time order tracking."}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {(restaurant.cuisine || []).slice(0, 4).map((item) => (
                        <span
                          key={`${restaurant._id}-${item}`}
                          className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Delivery Fee: Rs. {restaurant.deliveryFee || 0}
                      </div>
                      <Link
                        to={`/menu?restaurantId=${restaurant._id}`}
                        className="rounded-lg bg-[#ff4d2d] px-4 py-2 text-white font-semibold"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
