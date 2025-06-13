import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBriefcase,
    FaCode,
} from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

const Profile_template = ({ userId }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    const isOwnProfile = userId === currentUserId;
    console.log('Current User ID:', currentUserId, 'Profile User ID:', userId);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You need to be logged in to view profiles.');
                    setLoading(false);
                    return;
                }

                if (!userId) {
                    setError('No user ID provided to load profile.');
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`${backendURL}/api/user/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError('Failed to load profile. This user might not exist or there was a server error.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [backendURL, userId]);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 10,
                stiffness: 100,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (loading) {
        return (
            <div className="bg-white rounded-[30px] shadow-2xl p-6 flex flex-col items-center justify-center min-h-[300px] mx-4 my-4">
                <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-semibold text-gray-700">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-[30px] shadow-2xl p-6 flex flex-col items-center justify-center min-h-[300px] mx-4 my-4 text-red-600 text-center">
                <IoInformationCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-semibold">{error}</p>
                <p className="text-md text-gray-500 mt-2">Please try again later or check the URL.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white shadow-2xl rounded-[30px] p-8 border border-gray-100 mx-4 my-4 overflow-hidden relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#e0efff] to-white opacity-60 rounded-[30px] -z-10"></div>

            <motion.div
                className="flex flex-col items-center mb-8 pb-6 border-b border-gray-100"
                variants={itemVariants}
            >
                <img
                    src={user.profilePic || '/profilepic.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#7494ec] shadow-lg transform transition-transform duration-300 hover:scale-105"
                />
                <h2 className="text-4xl font-extrabold text-[#333] mt-4 text-center">{user.name}</h2>
                {(user.position || user.company) && (
                    <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
                        <FaBriefcase className="text-[#7494ec]" />
                        {user.position && user.company
                            ? `${user.position} at ${user.company}`
                            : user.position || user.company}
                    </p>
                )}
                {isOwnProfile ? (
                    <button
                        onClick={() => navigate('/createprofile')}
                        className="mt-4 px-5 py-2 rounded-full bg-[#7494ec] text-white font-semibold hover:bg-[#5a7bcb] transition"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(`/chat/${userId}`)}
                        className="mt-4 px-5 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                    >
                        Chat
                    </button>
                )}
            </motion.div>

            <motion.div className="mb-8" variants={itemVariants}>
                <h3 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-3">
                    <IoInformationCircle className="text-[#7494ec] text-3xl" /> About Me
                </h3>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                    {user.about || "This user hasn't provided an 'About' section yet. Connect with them to learn more!"}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100"
                    variants={itemVariants}
                >
                    <h3 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-3">
                        <FaEnvelope className="text-[#7494ec]" /> Contact
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-gray-700">
                            <FaEnvelope className="text-lg text-gray-500 flex-shrink-0" />
                            <span className="font-medium">Email:</span>
                            <span className="flex-1 break-words min-w-0">{user.email || 'N/A'}</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <FaPhone className="text-lg text-gray-500 flex-shrink-0" />
                            <span className="font-medium">Phone:</span>
                            <span className="flex-1 break-words min-w-0">{user.phone || 'N/A'}</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                            <FaMapMarkerAlt className="text-lg text-gray-500 flex-shrink-0" />
                            <span className="font-medium">Address:</span>
                            <span className="flex-1 break-words min-w-0">{user.address || 'N/A'}</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-l from-green-50 to-emerald-50 p-6 rounded-xl shadow-md border border-green-100"
                    variants={itemVariants}
                >
                    <h3 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-3">
                        <FaCode className="text-green-600" /> Skills
                    </h3>
                    {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-green-200 transition"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-700">No skills listed yet.</p>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Profile_template;
