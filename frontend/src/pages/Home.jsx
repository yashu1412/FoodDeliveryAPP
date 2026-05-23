import { motion } from "framer-motion";
import Footer from "../components/Footer";
import FoodCategories from "../components/FoodCategories";

export default function VingoHome() {
  const MotionHeading = motion.h1;
  const MotionText = motion.p;
  const MotionImage = motion.img;

  return (
    <>
    <div className="min-h-screen bg-white text-[#ff4d2d] flex flex-col items-center px-6 py-10 mt-10">
      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 max-w-6xl">
        {/* Content Side */}
        <div className="flex-1 flex flex-col gap-6">
          <MotionHeading
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Welcome to <span className="text-[#740011]">Vingo</span>
          </MotionHeading>

          {/* Typewriter Effect */}
          <MotionText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-semibold"
          >
            <span className="border-r-4 border-[#ff4d2d] pr-2 animate-pulse">
              About Vingo — your food discovery partner!
            </span>
          </MotionText>

          <p className="text-lg opacity-100" style={{fontFamily:"inherit"}}>
            Find your favorite meals, explore new tastes, and enjoy a smoother food
            ordering experience. Explore the best flavors from local favorites and international cuisines.
          </p>
        </div>

        {/* Image Side */}
        <MotionImage
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src="https://bigfoto.name/uploads/posts/2022-01/1642489937_36-bigfoto-name-p-kafe-vnutri-v-interere-68.jpg" // Replace with your image
          alt="Food"
          className="w-full max-w-lg rounded-2xl shadow-2xl"
        />
      </div>
       <section className="w-full bg-white px-6">
      <FoodCategories />
    </section>
    </div>


     <div className="mt-2">
        <Footer/>
    </div>
    </>
  );
}
