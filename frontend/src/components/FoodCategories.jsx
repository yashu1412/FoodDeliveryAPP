import React from "react";

const foodCategories = [
  {
    name: "Chicken Biryani",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.V5zLoRwYMkgV0-meJWZKJgHaE8?pid=Api&P=0&h=180",
  },
  {
    name: "Mutton Biryani",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.RV0xeyi7wiSnLxFdmzuTMAHaDt?pid=Api&P=0&h=180",
  },
  {
    name: "Chicken Lollipop",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.K2lnVgPEj0-LL0gYYkLA_AHaE5?pid=Api&P=0&h=180",
  },
  {
    name: "Paneer Tikka",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.5bjx9mZ6KgNJa_A8--BYigHaFj?pid=Api&P=0&h=180",
  },
  {
    name: "Butter Chicken",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.JR56U2K2x2RNpRPb7nMfZQHaE7?pid=Api&P=0&h=180",
  },
  {
    name: "Pizza",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.ildCrKedl5wZSDvDouexMQHaEo?pid=Api&P=0&h=180",
  },
  {
    name: "Pasta",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
  },
  {
    name: "Burger",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
   {
    name: "Shawarma",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.8n3C3ujyVSuYzaGxp1MV1QHaE7?pid=Api&P=0&h=180",
  },
   {
    name: "Manchurian",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.iv8f15QmJppYffaAKuHARAHaEK?pid=Api&P=0&h=180",
  },
];

export default function FoodCategories() {
  return (
    <section className="w-full py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-[#ff4d2d] text-center mb-6">
        Order Our Best Food Options
      </h2>

      {/* Responsive Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {foodCategories.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 overflow-hidden rounded-full shadow-lg border border-[#ff4d2d]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm sm:text-base text-[#ff4d2d] font-semibold">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
