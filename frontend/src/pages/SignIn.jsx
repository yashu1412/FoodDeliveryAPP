import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { apiRequest } from '../utils/api';
import useGoogleOneTap from '../hooks/useGoogleOneTap';
import { useAppContext } from '../context/AppContext';

const SignIn = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const { applySession, refreshCartCount } = useAppContext();
  const [showPassword,setShowPassword] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/';

  useGoogleOneTap({
    enabled: true,
    onSuccess: (data) => {
      applySession(data);
      refreshCartCount();
      navigate(redirectPath);
    },
    onError: (message) => setError(message),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      applySession(data);
      refreshCartCount();
      setSuccessMessage('Login successful. Redirecting to home page...');
      navigate(redirectPath);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className='min-h-screen w-full flex items-center justify-center p-4'
      style={{ backgroundColor: bgColor }}>
      <form
        className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'
        style={{ border: `1px solid ${borderColor}` }}
        onSubmit={handleSubmit}
      >
        <h1 className={`text-2xl font-semibold mb-4 text-center`} style={{ color: primaryColor }}>User Login</h1>
        <p className='text-gray-700 mb-8'>Welcome back! Please signin to continue enjoying delicious food deliveries.</p>

        <label htmlFor='email' className='block text-gray-700 font-semibold mb-1'>Email</label>
        <input type="email" placeholder="Email" id="email" name="email"
          className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor='password' className='block text-gray-700 font-semibold mb-1'>Password</label>
        <div className='relative'>
        <input type={`${!showPassword? 'text' : 'password'}`} placeholder='Password' id="password" name="password"
          className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-offset-1"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
          {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
        </button>
        </div>

       <div>
        <label className="flex justify-end mb-4">
          <Link to='/forgot-password' className='text-sm text-red-600 text-bold'>
            Forgot Password?
          </Link>
        </label>
       </div>
        {error && <p className='mb-4 text-sm text-red-600'>{error}</p>}
        {successMessage && <p className='mb-4 text-sm text-green-600'>{successMessage}</p>}
        <button className={`w-full p-3 rounded text-white font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-70`}
          style={{ backgroundColor: primaryColor }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <div className='flex items-center my-4'>
          <button type="button" className='w-full flex item-center justify-center gap-3 border border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-700 bg-white'>
              <FcGoogle className='text-2xl' />
              <span>Google One Tap is enabled</span>
          </button>
        </div>
        <Link to='/signup' className='block text-center mt-4 text-md text-gray-600'>
         If you have no account then? <span className='text-blue-600 font-medium'>SignUp</span>
        </Link>
      </form>
    </div>
    <div className='mt-2'>
      <Footer/>
    </div>
    </>
  )
}

export default SignIn
