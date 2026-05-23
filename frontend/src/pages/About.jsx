import React from "react";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
    <section className="w-full bg-white py-16 px-6 mt-10" id="about">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        

        {/* Right Side Content */}
        <div>
          <h2 className="text-4xl font-extrabold mb-4 text-[#ff4d2d]">
            About Vingo Food
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Vingo Food is your perfect destination for delicious, hygienic and 
            freshly prepared meals delivered right to your doorstep. We combine 
            premium ingredients with rich flavors to offer food that not only 
            tastes amazing but also nourishes your soul.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            From Indian spices to global delights, you get to explore premium 
            dishes that bring joy in every bite. Food is not just what you eat, 
            it’s an experience — and we make sure it's unforgettable.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center mt-6">
            <div>
              <h3 className="text-2xl font-bold text-[#ff4d2d]">150+</h3>
              <p className="text-gray-700 text-sm">Food Items</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#ff4d2d]">20+</h3>
              <p className="text-gray-700 text-sm">Cities Served</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#ff4d2d]">4.9★</h3>
              <p className="text-gray-700 text-sm">Customer Rating</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="mt-8 bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:text-[#ff4d2d] border border-[#ff4d2d] transition">
            Order Now
          </button>
        </div>

         {/* Left Side Image */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
              alt="Delicious Food"
              className="w-full h-full object-cover transform hover:scale-110 transition duration-300"
            />
          </div>

          <div className="absolute -bottom-4 -right-4 bg-[#ff4d2d] text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
            10K+ Happy Customers
          </div>
        </div>
      </div>
    </section>
     <div className="mt-5">
        <Footer/>
      </div>
    </>
  );
}
