import React, { useContext } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Connections from './pages/Connections';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import CreateProfile from './pages/Createprofile';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import Error404Page from './pages/Error404Page';
import { ShopContext } from './context/ShopContext';
import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { profileUserId: userId } = useContext(ShopContext);

  return (
    <>
      {/* Toast container setup */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Login />} />
        <Route path='/createprofile' element={<CreateProfile />} />
        <Route path='/chat/:receiverId' element={<Chat />} />
        <Route path='/*' element={<Error404Page />} />

        {/* Protected Routes with Navbar */}
        <Route element={<ProtectedRoute><LayoutWithNavbar /></ProtectedRoute>}>
          <Route path='/home' element={<Home />} />
          <Route path='/connections' element={<Connections />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/profile' element={<Profile userId={userId} />} />
        </Route>
      </Routes>
    </>
  );
};

// Navbar layout wrapper
const LayoutWithNavbar = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default App;
