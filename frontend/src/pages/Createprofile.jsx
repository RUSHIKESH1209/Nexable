import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../context/ShopContext';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function CreateProfile() {
  const {
    email,
    profilePic, setProfilePic,
    about, setAbout,
    phone, setPhone,
    address, setAddress,
    skills, setSkills,
    skillInput, setSkillInput,
    position, setPosition,
    company, setCompany,
  } = useContext(ShopContext);

  const [preview, setPreview] = useState(profilePic ? URL.createObjectURL(profilePic) : null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      setProfilePic(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else if (name === 'skillInput') {
      setSkillInput(value);
    } else {
      switch (name) {
        case 'about': setAbout(value); break;
        case 'phone': setPhone(value); break;
        case 'address': setAddress(value); break;
        case 'position': setPosition(value); break;
        case 'company': setCompany(value); break;
        default: break;
      }
    }
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() !== '') {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('profilePic', profilePic);
    data.append('about', about);
    data.append('phone', phone);
    data.append('address', address);
    data.append('skills', JSON.stringify(skills));
    data.append('position', position);
    data.append('company', company);
    data.append('email', email);

    try {
      await axios.post(`${backendURL}/api/user/createprofile`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile created successfully');
    } catch (error) {
      alert('Error creating profile');
    }
  };

  console.log( `${backendURL}/api/user/createprofile`);

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
            value={about}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1F7D53] rounded-xl"
          />

          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="skillInput"
                placeholder="Enter a skill"
                value={skillInput}
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
              {skills.map((skill, index) => (
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
              value={position}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 border border-[#1F7D53] rounded-xl"
            />
            <input
              type="text"
              name="company"
              placeholder="Company or College"
              value={company}
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
