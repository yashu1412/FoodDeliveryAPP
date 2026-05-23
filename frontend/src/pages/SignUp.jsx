import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from '../components/Footer';
import { apiRequest } from '../utils/api';
import { useAppContext } from '../context/AppContext';

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(true);
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { applySession, refreshCartCount } = useAppContext();

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Owner', value: 'owner' },
    { label: 'Delivery', value: 'deliveryBoy' },
  ];

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
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      applySession(data);
      refreshCartCount();
      setSuccessMessage('Account created successfully. Redirecting to home page...');
      navigate('/');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className='min-h-screen w-full flex items-center justify-center p-2 mt-16'
      style={{ backgroundColor: bgColor }}>
      <form
        className='bg-white rounded-xl shadow-lg w-full max-w-lg p-8'
        style={{ border: `1px solid ${borderColor}` }}
        onSubmit={handleSubmit}
      >
        <h1 className={`text-2xl font-semibold mb-2 text-center`} style={{ color: primaryColor }}>User Signup</h1>

        <p className='text-gray-600 mb-8'>Create your account to get started with delicious food deliveries</p>

        <div className='mb-2'>
          <label htmlFor="fullName" className='block text-gray-700 font-semibold mb-1'>Full Name</label>
          <input type='text' placeholder='Enter your full name' id="fullName" name="fullName"
            className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ border: `1px solid ${borderColor}` }}
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className='mb-2'>
          <label htmlFor="email" className='block text-gray-700 font-semibold mb-1'>Email</label>
          <input type="email" placeholder="Email" id="email" name="email"
            className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ border: `1px solid ${borderColor}` }}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className='mb-2'>
          <label htmlFor="mobile" className='block text-gray-700 font-semibold mb-1'>Mobile Number</label>
          <input type='text' placeholder='Enter your mobile number' id="mobile" name="mobile"
            className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ border: `1px solid ${borderColor}` }}
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className='mb-2'>
          <label htmlFor="password" className='block text-gray-700 font-semibold mb-1'>Password</label>
          <div className='relative'>
            <input
              type={`${!showPassword ? 'text' : 'password'}`}
              placeholder='Password'
              id="password"
              name="password"
              className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="button" className='absolute right-3 top-2.5 text-gray-500' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>
          </div>
        </div>

        <div className='mb-2 flex flex-col'>
          <label htmlFor="role" className='block text-gray-700 font-semibold mb-1'>Select Role</label>
          <div className='relative'>
            {roleOptions.map((item) => {
              return (
                <button
                  type="button"
                  key={item.value}
                  className={`w-1/4 md:w-1/4 p-2 mb-4 rounded border focus:outline-none focus:ring-2 focus:ring-offset-1 ${role === item.value ? 'bg-orange-500 text-white' : ''} `}
                  style={{ border: `1px solid ${borderColor}`, marginRight: '14px' }}
                  onClick={() => setRole(item.value)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
        {error && <p className='mb-4 text-sm text-red-600'>{error}</p>}
        {successMessage && <p className='mb-4 text-sm text-green-600'>{successMessage}</p>}
        <button className={`w-full p-2 rounded text-white font-semibold cursor-pointer hover:opacity-90 transition disabled:opacity-70`}
          style={{ backgroundColor: primaryColor }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        <Link to='/signin' className='block text-center mt-4 text-sm text-gray-600'>
          Already have an account? <span className='font-medium text-blue-600'>Sign In</span>
        </Link>
      </form>
    </div>
    <div className='mt-2'>
      <Footer/>
    </div>
    </>
  )
}

export default SignUp
