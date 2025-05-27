import React, { createContext, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  // Login states (from before)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profile states
  const [profilePic, setProfilePic] = useState(null);
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');

  const value = {
    // Login
    name, setName,
    email, setEmail,
    password, setPassword,
    // Profile
    profilePic, setProfilePic,
    about, setAbout,
    phone, setPhone,
    address, setAddress,
    skills, setSkills,
    skillInput, setSkillInput,
    position, setPosition,
    company, setCompany,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;
