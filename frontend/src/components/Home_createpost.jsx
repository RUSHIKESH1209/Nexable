import React, { useState, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';

const Home_createpost = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('/profilepic.png'); // default image

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log('Post created:', response.data.post);
        setCaption('');
        setSelectedFile(null);
        setPreview(null);
      } else {
        console.error('Failed to post:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 min-h-[15vh] flex flex-col justify-between border border-[#255F38]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <img
            src={profilePic}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-[#1F7D53]"
          />
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm resize-none"
            rows={2}
          />
          <label className="cursor-pointer text-[#EC5228] text-4xl">
            <FaImage />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {preview && (
          <img
            src={preview}
            alt="Selected preview"
            className="rounded-md border border-[#1F7D53] max-h-[70vh] max-w-full object-contain"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#EC5228] text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 self-end"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default Home_createpost;
