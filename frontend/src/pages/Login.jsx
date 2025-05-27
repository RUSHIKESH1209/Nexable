import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';


function Login() {
  const { name, setName, email, setEmail, password, setPassword } = useContext(ShopContext);
  const [isSignup, setIsSignup] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? `${backendURL}/api/user/register` : `${backendURL}/api/user/login`;

    // Prepare form data object for request
    const formData = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      const res = await axios.post(url, formData);
      localStorage.setItem('token', res.data.token);
      window.location.href = isSignup ? '/createprofile' : '/home';
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl"
      >
        {/* Left - Form Section */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12">
          <h1 className="text-5xl font-black text-[#1F7D53] mb-6 text-center md:text-left">
            Connect, Share & Grow
          </h1>
          <h2 className="text-2xl font-semibold mb-8 text-[#255F38] text-center md:text-left">
            {isSignup ? 'Create your account' : 'Welcome back, sign in'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255F38]"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255F38]"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255F38]"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#EC5228] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition duration-200"
            >
              {isSignup ? 'Signup' : 'Login'}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#EC5228] hover:underline font-semibold"
            >
              {isSignup ? 'Login' : 'Signup'}
            </button>
          </p>
        </div>

        {/* Right - Image Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full md:w-1/2 mt-10 md:mt-0"
        >
          <img
            src="/login.png"
            alt="illustration"
            className="w-full max-w-5xl mx-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
