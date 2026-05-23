import Footer from "../components/Footer";
// import axios from "axios";
// import { toast } from "react-toastify";
import food from '../assets/food.jpg';
export default function Contact() {
//   const [formData, setFormData] = useState({
//     helpType: "",
//     name: "",
//     email: "",
//     mobile: "",
//     message: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/v1/message/send",
//         formData,
//         { withCredentials: true }
//       );

//       toast.success(response.data.message);
//       setFormData({
//         helpType: "",
//         name: "",
//         email: "",
//         mobile: "",
//         message: ""
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong!");
//     }
//   };

  return (
    <>
      {/* Header Image */}
      <div
        className="w-full h-[60vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${food})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1
            className="text-white text-3xl md:text-5xl font-bold text-center"
            style={{ fontFamily: "Times New Roman" }}
          >
            We would love to hear from you!
          </h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-10">
        <h2
          className="text-center text-gray-700 text-3xl font-bold mb-6"
          style={{ fontFamily: "Times New Roman" }}
        >
          Contact With Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Form */}
          <form
            // onSubmit={handleSubmit}
            className="bg-white shadow-md p-6 rounded-xl"
          >
            {/* Help Select */}
            <select
              name="helpType"
            //   value={formData.helpType}
            //   onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring focus:ring-[#ff4d2d]"
            >
              <option hidden value="">
                How can we help you?
              </option>
              <option value="1">I need help with my SwiftEats online order.</option>
              <option value="2">
                I found incorrect/outdated information on a page.
              </option>
              <option value="3">
                There is a photo/review that is bothering me and I would like to
                report it.
              </option>
              <option value="4">
                The website/app are not working the way they should.
              </option>
              <option value="5">I would like to give feedback/suggestions.</option>
              <option value="6">Others.</option>
            </select>

            {/* Name */}
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
            //   value={formData.name}
            //   onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring focus:ring-[#ff4d2d]"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
            //   value={formData.email}
            //   onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring focus:ring-[#ff4d2d]"
            />

            {/* Mobile */}
            <input
              type="number"
              placeholder="Mobile Number (Optional)"
              name="mobile"
            //   value={formData.mobile}
            //   onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring focus:ring-[#ff4d2d]"
            />

            {/* Message */}
            <textarea
              rows={6}
              placeholder="Type Message Here."
              name="message"
            //   value={formData.message}
            //   onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring focus:ring-[#ff4d2d]"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#ff4d2d] border border-[#ff4d2d] transition"
            >
              Submit
            </button>
          </form>

          {/* Right Cards */}
          <div className="flex flex-col gap-6">
            {/* Card 1 */}
            <div className="shadow-lg bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[#ff4d2d]">
                Report a Safety Emergency
              </h3>
              <p className="text-gray-600 mt-2">
                We are committed to the safety of everyone using SwiftEats.
              </p>
              <a
                href="/report"
                className="inline-block mt-4 text-[#ff4d2d] font-semibold text-lg"
              >
                Report Here
              </a>
            </div>

            {/* Card 2 */}
            <div className="shadow-lg bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[#ff4d2d]">
                Issue with your live order?
              </h3>
              <p className="text-gray-600 mt-2">
                Click on the 'Support' or 'Online ordering help' section in your
                app to connect to our customer support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
