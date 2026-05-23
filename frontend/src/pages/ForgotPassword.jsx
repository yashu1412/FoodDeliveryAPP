import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { apiRequest } from "../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });

      setMessage(data.message);
      setStep(2);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setMessage(data.message);
      setTimeout(() => navigate("/signin"), 1200);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-4 mt-12">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-center text-[#ff4d2d] mb-3">
            Reset Password
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {step === 1
              ? "Enter your email and we will send an OTP using Gmail SMTP."
              : "Enter the OTP from your email and choose a new password."}
          </p>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 mb-4"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-[#ff4d2d] text-white py-3 font-semibold disabled:opacity-70"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 mb-4"
                placeholder="Enter 6-digit OTP"
              />
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 mb-4"
                placeholder="Enter new password"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-[#ff4d2d] text-white py-3 font-semibold disabled:opacity-70"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-5 text-center text-sm text-gray-600">
            <Link to="/signin" className="text-[#ff4d2d] font-medium">
              Back to login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
