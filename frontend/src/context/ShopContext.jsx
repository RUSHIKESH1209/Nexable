import React, { createContext, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [profilePic, setProfilePic] = useState(null);
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');

  const [profileUserId, setProfileUserId] = useState('');

   const value = {
    token, setToken,

    
    name, setName,
    email, setEmail,
    password, setPassword,
 
    profilePic, setProfilePic,
    about, setAbout,
    phone, setPhone,
    address, setAddress,
    skills, setSkills,
    skillInput, setSkillInput,
    position, setPosition,
    company, setCompany,

    profileUserId, setProfileUserId,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;
