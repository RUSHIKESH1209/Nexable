import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { GoogleLogin } from '@react-oauth/google';
import 'boxicons/css/boxicons.min.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    setToken
  } = useContext(ShopContext);

  const [isSignup, setIsSignup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? `${backendURL}/api/user/register` : `${backendURL}/api/user/login`;

    const formData = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      const res = await axios.post(url, formData);
      const receivedToken = res.data.token;

      localStorage.setItem('token', receivedToken);
      setToken?.(receivedToken);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate(isSignup ? '/createprofile' : '/home');
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${backendURL}/api/user/google-login`, {
        credential: credentialResponse.credential
      });

      const { token } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      console.log('Google login successful:', res.data);
      toast.success("Login successful!");

      setTimeout(() => {
        navigate(isSignup ? '/createprofile' : '/home');
      }, 1000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Google login failed');
    }
  };

  const transitionDuration = 0.8;
  const formPanelTransitionDuration = 0.5;

  const toggleBoxBeforeVariants = {
    loginState: { left: '-250%' },
    signupState: { left: '50%' },
  };

  const loginFormVariants = {
    loginState: { x: '0%', opacity: 1, pointerEvents: 'auto' },
    signupState: { x: '-100%', opacity: 0, pointerEvents: 'none' },
  };

  const registerFormVariants = {
    loginState: { x: '0%', opacity: 0, pointerEvents: 'none' },
    signupState: { x: '0%', opacity: 1, pointerEvents: 'auto' },
  };

  const toggleLeftPanelVariants = {
    loginState: { x: '0%', opacity: 1 },
    signupState: { x: '-100%', opacity: 0 },
  };

  const toggleRightPanelVariants = {
    loginState: { x: '0%', opacity: 0 },
    signupState: { x: '0%', opacity: 1 },
  };

  const desktopView = (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
      <motion.div className="relative w-[850px] h-[550px] bg-white m-5 rounded-[30px] shadow-2xl overflow-hidden">

        <motion.div
          className="absolute right-0 w-1/2 h-full bg-white flex items-center justify-center text-center p-10 z-30"
          variants={loginFormVariants}
          initial="loginState"
          animate={isSignup ? 'signupState' : 'loginState'}
          transition={{ duration: formPanelTransitionDuration, delay: isSignup ? 0 : formPanelTransitionDuration }}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-[36px] font-semibold mb-4 text-[#333]">Login</h1>
            <div className="relative mb-8">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>
            <div className="text-sm mb-4 text-right">
              <a href="#" className="text-[#333] hover:underline">Forgot Password?</a>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full h-12 bg-[#7494ec] rounded-lg shadow-md text-white font-semibold"
            >
              Login
            </motion.button>

            <p className="text-sm my-4 text-[#333]">or login with</p>
            <div className="flex justify-center my-2">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => alert('Google Sign In Failed')}
                theme="outline"
                size="large"
              />
            </div>
          </form>
        </motion.div>

        <motion.div
          className="absolute left-0 w-1/2 h-full bg-white flex items-center justify-center text-center p-10 z-30"
          variants={registerFormVariants}
          initial="loginState"
          animate={isSignup ? 'signupState' : 'loginState'}
          transition={{ duration: formPanelTransitionDuration, delay: isSignup ? formPanelTransitionDuration : 0 }}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-[36px] font-semibold mb-4 text-[#333]">Registration</h1>
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>
            <div className="relative mb-8">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full h-12 bg-[#7494ec] rounded-lg shadow-md text-white font-semibold"
            >
              Register
            </motion.button>

            <p className="text-sm my-4 text-[#333]">or login with</p>
            <div className="flex justify-center my-2">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => alert('Google Sign In Failed')}
              />
            </div>
          </form>
        </motion.div>

        <motion.div className="absolute top-0 left-0 w-full h-full z-10">
          <motion.div
            className="absolute top-0 h-full bg-[#7494ec] rounded-[150px] z-10 pointer-events-none"
            variants={toggleBoxBeforeVariants}
            initial="loginState"
            animate={isSignup ? "signupState" : "loginState"}
            transition={{ duration: transitionDuration, ease: "easeOut" }}
            style={{ width: '300%' }}
          ></motion.div>

          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-20 p-10"
            variants={toggleLeftPanelVariants}
            initial="loginState"
            animate={isSignup ? "signupState" : "loginState"}
            transition={{ duration: formPanelTransitionDuration, delay: isSignup ? 0 : formPanelTransitionDuration }}
          >
            <h1 className="text-4xl font-semibold mb-4">Hello, Welcome!</h1>
            <p className="text-base mb-5">Don't have an account?</p>
            <button
              className="w-40 h-12 bg-transparent border-2 border-white rounded-lg text-base text-white font-semibold"
              onClick={() => setIsSignup(true)}
            >
              Register
            </button>
          </motion.div>

          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-20 p-10"
            variants={toggleRightPanelVariants}
            initial="loginState"
            animate={isSignup ? "signupState" : "loginState"}
            transition={{ duration: formPanelTransitionDuration, delay: isSignup ? formPanelTransitionDuration : 0 }}
          >
            <h1 className="text-4xl font-semibold mb-4">Welcome Back!</h1>
            <p className="text-base mb-5">Already have an account?</p>
            <button
              className="w-40 h-12 bg-transparent border-2 border-white rounded-lg text-base text-white font-semibold"
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );

  const mobileView = (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] p-4">
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-2xl p-6">
        <h1 className="text-[32px] font-semibold mb-6 text-[#333] text-center">
          {isSignup ? 'Register' : 'Login'}
        </h1>

        <form onSubmit={handleSubmit} className="w-full">
          {isSignup && (
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>
          )}
          <div className="relative mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
            />
            <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 bg-[#eee] rounded-lg outline-none text-base text-[#333] font-medium placeholder-[#888]"
            />
            <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
          </div>
          {!isSignup && (
            <div className="text-sm mb-4 text-right">
              <a href="#" className="text-[#333] hover:underline">Forgot Password?</a>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-12 bg-[#7494ec] rounded-lg shadow-md text-white font-semibold"
          >
            {isSignup ? 'Register' : 'Login'}
          </motion.button>

          <p className="text-sm my-4 text-[#333] text-center">or {isSignup ? 'register' : 'login'} with</p>
          <div className="flex justify-center my-2">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert('Google Sign In Failed')}
              theme="outline"
              size="large"
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-base text-[#333]">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              className="text-[#7494ec] font-semibold hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  return isMobile ? mobileView : desktopView;
}

export default Login;