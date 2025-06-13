import React, { useState, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Home_createpost = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('/profilepic.png');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProfilePic(response.data.user.profilePic || '/profilepic.png');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [backendURL]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (selectedFile) {
        formData.append('postPic', selectedFile);
      }
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendURL}/api/post/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        console.log('Post created:', response.data.post);
        setCaption('');
        setSelectedFile(null);
        setPreview(null);
      } else {
        console.error('Failed to post:', response.data.message);
      }
      toast.success("Post Created Successfully", {
        autoClose: 500,  
      });

    } catch (error) {

      console.error('Error creating post:', error);
      toast.error('Error creating post');


    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-[30px] p-6 shadow-2xl flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <img
            src={profilePic}
            alt="User"
            className="w-12 h-12 rounded-full object-cover border-2 border-[#7494ec]"
          />
          <textarea
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 bg-[#f9f9f9] rounded-xl p-3 text-base resize-none outline-none focus:ring-2 focus:ring-[#7494ec] placeholder-[#888]"
            rows={2}
          />
        </div>

        {preview && (
          <div className="relative mt-2">
            <img
              src={preview}
              alt="Selected preview"
              className="rounded-xl max-h-[25vh] w-full object-cover border-2 border-[#7494ec] shadow-md"
            />
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setPreview(null); }}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs hover:bg-opacity-75"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <label
            htmlFor="image-upload"
            className="flex items-center text-[#7494ec] text-lg cursor-pointer hover:text-[#607bb0] transition px-3 py-2 rounded-lg bg-[#f9f9f9] hover:bg-[#eee]"
          >
            <FaImage className="text-xl mr-2" />
            <span className="text-sm font-medium hidden sm:inline">Add Image</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || (!caption && !selectedFile)}
            className="bg-[#7494ec] text-white px-5 py-2.5 rounded-lg text-base font-semibold hover:bg-[#607bb0] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Share'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default Home_createpost;