// Home_createpost.js
import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';

const Home_createpost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Post submitted:', { selectedImage, caption });
    setCaption('');
    setSelectedImage(null);
  };

  return (
    <div className="bg-white rounded-xl p-4 min-h-[15vh] flex flex-col justify-between border border-[#255F38]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <img
            src="/profilepic.png"
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
          <label className="cursor-pointer text-[#EC5228] text-3xl">
            <FaImage />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected preview"
            className="rounded-md border border-[#1F7D53] max-h-[70vh] max-w-full object-contain"
          />
        )}

        <button
          type="submit"
          className="bg-[#EC5228] text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 self-end"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Home_createpost;
