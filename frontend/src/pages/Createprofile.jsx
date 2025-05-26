// CreateProfile.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';

function CreateProfile() {
  const [formData, setFormData] = useState({
    profilePic: null,
    about: '',
    phone: '',
    address: '',
    skills: [],
    skillInput: '',
    position: '',
    company: ''
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      setFormData({ ...formData, profilePic: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkillAdd = () => {
    if (formData.skillInput.trim() !== '') {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      if (key !== 'skillInput') {
        data.append(key, Array.isArray(formData[key]) ? JSON.stringify(formData[key]) : formData[key]);
      }
    }
    try {
      await axios.post('/api/profile/create', data);
      alert('Profile created successfully');
    } catch (error) {
      alert('Error creating profile');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-3xl p-8 rounded-2xl"
      >
        <h1 className="text-4xl font-bold text-[#1F7D53] mb-8 text-center">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center">
            <label htmlFor="profilePicInput" className="cursor-pointer relative w-32 h-32">
              <img
                src={preview || '/profilepic.png'}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover border border-[#1F7D53]"
              />
              <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md">
                <FontAwesomeIcon icon={faPen} className="text-[#1F7D53] text-sm" />
              </div>
              <input
                type="file"
                id="profilePicInput"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
          <input
            type="text"
            name="about"
            placeholder="About You"
            value={formData.about}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl"
          />

          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="skillInput"
                placeholder="Enter a skill"
                value={formData.skillInput}
                onChange={handleChange}
                className="flex-grow px-4 py-3 border border-[#1F7D53] rounded-xl"
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="px-4 bg-[#1F7D53] text-white rounded-xl hover:bg-[#255F38]"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#1F7D53] text-white px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              name="position"
              placeholder="Current Position"
              value={formData.position}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 border border-[#1F7D53] rounded-xl"
            />
            <input
              type="text"
              name="company"
              placeholder="Company or College"
              value={formData.company}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 border border-[#1F7D53] rounded-xl"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#EC5228] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition duration-200"
          >
            Save Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateProfile;
