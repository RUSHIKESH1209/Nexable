import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import 'boxicons/css/boxicons.min.css';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Home_profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authorization token found. Please login.');
                    setLoading(false);
                    // window.location.href = '/'; // Consider redirecting if no token
                    return;
                }

                const response = await axios.get(`${backendURL}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setProfile(response.data.user);
                } else {
                    setError('Failed to load profile');
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-[30px] shadow-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[#333] text-lg font-semibold"
                >
                    Loading profile...
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-[30px] shadow-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center text-red-600 font-semibold">
                {error}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white w-full p-6 rounded-[30px] shadow-2xl flex flex-col items-center text-center"
        >
            {/* Profile Header Section */}
            <div className="mb-6 flex flex-col items-center">
                <img
                    src={profile.profilePic || '/profilepic.png'}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#7494ec] shadow-md mb-4"
                />
                <h2 className="text-3xl font-bold text-[#333] mb-1">
                    {profile.name || 'No Name'}
                </h2>
                <h3 className="text-lg text-[#888] font-medium mb-1">
                    {profile.position || 'No Position'} at {profile.company || 'No Company'}
                </h3>

            </div>

            {/* About Section */}
            <div className="w-full text-left mb-6 p-4 bg-[#f0f4ff] rounded-xl shadow-inner">
                <h4 className="text-lg font-semibold text-[#333] mb-2">About Me</h4>
                <p className="text-sm text-[#555] leading-relaxed break-words">
                    {profile.about || 'No "About Me" information provided yet.'}
                </p>
            </div>

            {/* Contact Information Section */}
            <div className="w-full text-left mb-6 p-4 bg-[#f0f4ff] rounded-xl shadow-inner">
                <h4 className="text-lg font-semibold text-[#333] mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-[#555]">
                    {/* Phone */}
                    <p className="flex items-start overflow-hidden"> {/* Added overflow-hidden to parent p */}
                        <i className="bx bxs-phone text-[#7494ec] text-lg mr-2 flex-shrink-0 mt-1"></i> {/* Added mt-1 for vertical alignment */}
                        <span className="flex-grow min-w-0 break-all"> {/* Added flex-grow and min-w-0 */}
                            {profile.phone || 'N/A'}
                        </span>
                    </p>
                    {/* Email */}
                    <p className="flex items-start overflow-hidden"> {/* Added overflow-hidden to parent p */}
                        <i className="bx bxs-envelope text-[#7494ec] text-lg mr-2 flex-shrink-0 mt-1"></i> {/* Added mt-1 for vertical alignment */}
                        <span className="flex-grow min-w-0 break-all"> {/* Added flex-grow and min-w-0 */}
                            {profile.email || 'N/A'}
                        </span>
                    </p>
                    {/* Address */}
                    <p className="flex items-start overflow-hidden"> {/* Added overflow-hidden to parent p */}
                        <i className="bx bxs-map text-[#7494ec] text-lg mr-2 flex-shrink-0 mt-1"></i> {/* Added mt-1 for vertical alignment */}
                        <span className="flex-grow min-w-0 break-all"> {/* Added flex-grow and min-w-0 */}
                            {profile.address || 'N/A'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Skills Section */}
            <div className="w-full text-left p-4 bg-[#f0f4ff] rounded-xl shadow-inner">
                <h4 className="text-lg font-semibold text-[#333] mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="bg-[#7494ec] text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-[#555]">No skills listed yet.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Home_profile;