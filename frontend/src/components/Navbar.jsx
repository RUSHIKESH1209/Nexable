import React from 'react';
import { FaHome, FaUserFriends, FaBell, FaUser } from 'react-icons/fa'; // Removed FaSearch as it's not directly used for link
import { Link } from 'react-router-dom';
import Search from './Search'; // Assuming Search component is fine as is

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between border-b border-gray-200">
      {/* Logo / Brand */}
      {/* Changed text color to match the Login's primary blue */}
      <div className="text-2xl font-bold text-[#7494ec]">
        <Link to="/home">Nexable</Link>
      </div>

      {/* Search bar */}
      {/* Assuming Search component will visually blend or can be styled separately */}
      <Search />

      {/* Navigation links with icons and labels */}
      <div className="flex items-center gap-6 text-[#333] text-sm font-semibold"> {/* Changed text color to dark grey, added font-semibold */}
        <Link to="/home" className="flex items-center gap-2 hover:text-[#7494ec] transition-colors">
          <FaHome className="text-lg" />
          <span>Home</span>
        </Link>
        <Link to="/connections" className="flex items-center gap-2 hover:text-[#7494ec] transition-colors">
          <FaUserFriends className="text-lg" />
          <span>Connections</span>
        </Link>
        <Link to="/notifications" className="flex items-center gap-2 hover:text-[#7494ec] transition-colors">
          <FaBell className="text-lg" />
          <span>Notifications</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:text-[#7494ec] transition-colors">
          <FaUser className="text-lg" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;