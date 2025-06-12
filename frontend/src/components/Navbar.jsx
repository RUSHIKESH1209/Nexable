import React, { useContext } from 'react';
import { FaHome, FaUserFriends, FaBell, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Search from './Search';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const { setProfileUserId } = useContext(ShopContext);

    const handleProfileClick = () => {
        setProfileUserId(null);
    };

    return (
        <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between border-b border-gray-200 md:px-6">
            <div className="text-2xl font-bold text-[#7494ec] flex-shrink-0">
                <Link to="/home">Nexable</Link>
            </div>

            <div className="hidden md:block flex-grow max-w-sm mx-4">
                <Search />
            </div>

            <div className="flex items-center justify-end gap-4 text-[#333] text-sm font-semibold flex-shrink-0">
                <Link
                    to="/home"
                    className="flex flex-col items-center gap-1 hover:text-[#7494ec] transition-colors sm:flex-row sm:gap-2"
                >
                    <FaHome className="text-lg md:text-xl" />
                    <span className="hidden sm:block text-xs md:text-sm">Home</span>
                </Link>

                <Link
                    to="/connections"
                    className="flex flex-col items-center gap-1 hover:text-[#7494ec] transition-colors sm:flex-row sm:gap-2"
                >
                    <FaUserFriends className="text-lg md:text-xl" />
                    <span className="hidden sm:block text-xs md:text-sm">Connections</span>
                </Link>

                <Link
                    to="/notifications"
                    className="flex flex-col items-center gap-1 hover:text-[#7494ec] transition-colors sm:flex-row sm:gap-2"
                >
                    <FaBell className="text-lg md:text-xl" />
                    <span className="hidden sm:block text-xs md:text-sm">Notifications</span>
                </Link>

                <Link
                    to="/profile"
                    onClick={handleProfileClick}
                    className="flex flex-col items-center gap-1 hover:text-[#7494ec] transition-colors sm:flex-row sm:gap-2"
                >
                    <FaUser className="text-lg md:text-xl" />
                    <span className="hidden sm:block text-xs md:text-sm">Profile</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
