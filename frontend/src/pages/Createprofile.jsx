import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../context/ShopContext';
import 'boxicons/css/boxicons.min.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function CreateProfile() {
  const navigate = useNavigate();
  const {
    profilePic, setProfilePic,
    about, setAbout,
    phone, setPhone,
    address, setAddress,
    skills, setSkills,
    skillInput, setSkillInput,
    position, setPosition,
    company, setCompany,
    token,
  } = useContext(ShopContext);

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.warn("No token found. User might not be authenticated.");
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response = await axios.get(`${backendURL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const profileData = response.data.user;

        setAbout(profileData.about || '');
        setPhone(profileData.phone || '');
        setAddress(profileData.address || '');
        setSkills(profileData.skills || []);
        setPosition(profileData.position || '');
        setCompany(profileData.company || '');

        if (profileData.profilePic) {
          setPreview(profileData.profilePic);
        } else {
          setPreview('/profilepic.png'); // Default image
        }

      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [token, setAbout, setPhone, setAddress, setSkills, setPosition, setCompany, setProfilePic]);

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
        setPreview('/profilepic.png');
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
    setIsLoading(true);

    const data = new FormData();
    if (profilePic instanceof File) {
      data.append('profilePic', profilePic);
    }
    
    data.append('about', about);
    data.append('phone', phone);
    data.append('address', address);
    data.append('skills', JSON.stringify(skills));
    data.append('position', position);
    data.append('company', company);

    try {
      await axios.patch(`${backendURL}/api/user/createprofile`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        navigate('/home');
      }, 1000);

    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error saving profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-[#7494ec]" />
        <p className="text-[#333] ml-4 text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-2xl p-8 rounded-[30px] shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-[#333] mb-4 text-center">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-3">
            <label htmlFor="profilePicInput" className="cursor-pointer relative w-32 h-32">
              <img
                src={preview || '/profilepic.png'}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-[#eee] p-1 rounded-full shadow-md">
                <FontAwesomeIcon icon={faPen} className="text-[#333] text-sm" />
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

          <input type="text" name="about" placeholder="About You" value={about} onChange={handleChange} className="w-full px-5 py-3 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder-[#888]" />
          <input type="tel" name="phone" placeholder="Phone Number" value={phone} onChange={handleChange} className="w-full px-5 py-3 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder-[#888]" />
          <input type="text" name="address" placeholder="Address" value={address} onChange={handleChange} className="w-full px-5 py-3 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder-[#888]" />

          <div>
            <label className="block mb-2 text-base font-semibold text-[#333]">Skills</label>
            <div className="flex flex-wrap items-center gap-2 bg-[#eee] px-4 py-[10px] rounded-lg min-h-[54px]">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-[#7494ec] text-white px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = [...skills];
                      newSkills.splice(index, 1);
                      setSkills(newSkills);
                    }}
                    className="text-white hover:text-gray-200"
                  >
                    ✖
                  </button>
                </span>
              ))}
              <input
                type="text"
                name="skillInput"
                placeholder="Add skill and press Enter"
                value={skillInput}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSkillAdd();
                  }
                }}
                className="flex-grow px-2 py-[6px] bg-transparent border-none outline-none text-base text-[#333] font-medium placeholder-[#888]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <input type="text" name="position" placeholder="Current Position" value={position} onChange={handleChange} className="w-1/2 px-5 py-3 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder-[#888]" />
            <input type="text" name="company" placeholder="Company or College" value={company} onChange={handleChange} className="w-1/2 px-5 py-3 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder-[#888]" />
          </div>

          <motion.button
            whileHover={{ scale: !isLoading ? 1.03 : 1 }}
            whileTap={{ scale: !isLoading ? 0.98 : 1 }}
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 rounded-lg shadow-md border-none cursor-pointer text-base font-semibold transition duration-200
              ${isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#7494ec] text-white hover:bg-[#607bb0]'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin /> Saving...
              </span>
            ) : (
              'Save Profile'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateProfile;