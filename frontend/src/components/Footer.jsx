import { FaFacebookF, FaTwitter, FaInstagram, FaAngleUp } from "react-icons/fa";
import { BiLogoGooglePlus } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import { FiPhoneCall } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-6 px-6 md:px-12">
      
      {/* Footer Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">

        {/* Logo + About */}
        <div>
         <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#ff4d2d] rounded-full flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <span className="text-xl font-semibold text-[#ff4d2d]">Vingo</span>
        </a>

          <p className="text-gray-300 text-sm leading-relaxed mt-4">
            We want to help bring talented students and unique startups together.
          </p>

          <h3 className="text-[#ff4d2d] font-semibold mt-6 mb-2">Contact Us</h3>
          <div className="flex items-center gap-3 text-gray-300">
            <FiPhoneCall className="text-[#ff4d2d] text-xl" />
            <p>+91 7549200441</p>
          </div>
          <div className="flex items-center gap-3 text-gray-300 mt-2">
            <IoMdMail className="text-[#ff4d2d] text-xl" />
            <p>tauqueercoder@gmail.com</p>
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-[#ff4d2d] font-semibold mb-4">Information</h3>
          <ul className="space-y-2 text-gray-300">
            <li>About Us</li>
            <li>More Search</li>
            <li>Blog</li>
            <li>Testimonials</li>
            <li>Events</li>
          </ul>
        </div>

        {/* Helpful Links */}
        <div>
          <h3 className="text-[#ff4d2d] font-semibold mb-4">Helpful Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Services</li>
            <li>Supports</li>
            <li>Terms & Condition</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="text-[#ff4d2d] font-semibold mb-4">Subscribe More Info</h3>

          <div className="flex items-center bg-white rounded-lg overflow-hidden">
            <span className="px-3 text-black text-lg">
              <IoMdMail />
            </span>
            <input
              type="text"
              placeholder="Enter your email"
              className="flex-1 px-2 py-3 text-black outline-none"
            />
          </div>

          <button className="mt-4 bg-[#ff4d2d] text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-12 pt-6"></div>

      {/* Footer Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">

        {/* Social Icons */}
        <div className="flex gap-4 text-xl mb-4 md:mb-0">
          <FaFacebookF className="text-[#ff4d2d] cursor-pointer hover:scale-110 transition" />
          <BiLogoGooglePlus className="text-[#ff4d2d] cursor-pointer hover:scale-110 transition" />
          <FaTwitter className="text-[#ff4d2d] cursor-pointer hover:scale-110 transition" />
          <FaInstagram className="text-[#ff4d2d] cursor-pointer hover:scale-110 transition" />
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-sm">
          © 2025 Tauqueer Manzar. All Rights Reserved.
        </p>

        {/* Back to top */}
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="bg-[#ff4d2d] p-2 rounded-md ml-4 hover:opacity-90 transition"
        >
          <FaAngleUp className="text-white text-lg" />
        </button>
      </div>
    </footer>
  );
}
