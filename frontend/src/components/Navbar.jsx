import React from 'react';
import { FaHome, FaUserFriends, FaBell, FaUser, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between border-b border-gray-200">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-[#1F7D53]">
        <Link to="/home">Nexable</Link>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md w-[40%] max-w-md">
        <FaSearch className="text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Navigation links with icons and labels */}
      <div className="flex items-center gap-6 text-[#1F7D53] text-sm font-medium">
        <Link to="/home" className="flex items-center gap-2 hover:text-[#EC5228] transition-colors">
          <FaHome className="text-lg" />
          <span>Home</span>
        </Link>
        <Link to="/connections" className="flex items-center gap-2 hover:text-[#EC5228] transition-colors">
          <FaUserFriends className="text-lg" />
          <span>Connections</span>
        </Link>
        <Link to="/notifications" className="flex items-center gap-2 hover:text-[#EC5228] transition-colors">
          <FaBell className="text-lg" />
          <span>Notifications</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:text-[#EC5228] transition-colors">
          <FaUser className="text-lg" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
