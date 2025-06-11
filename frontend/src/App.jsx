import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Connections from './pages/Connections';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import CreateProfile from './pages/Createprofile';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/createprofile'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/createprofile' element={<CreateProfile />} />
        <Route path='/home' element={<Home />} />
        <Route path='/connections' element={<Connections />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/chat/:receiverId' element={<Chat />} />
      </Routes>
    </>
  );
};

export default App;
