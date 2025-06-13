import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { FaSearch, FaUserPlus, FaUserTimes, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const navigate = useNavigate();
  const { setProfileUserId, token } = useContext(ShopContext);

  const [currentUserConnections, setCurrentUserConnections] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      setLoadingProfile(true);
      try {
        const storedToken = localStorage.getItem('token');
        const currentAuthToken = token || storedToken;

        if (!currentAuthToken) {
          console.error("No token found for fetching current user's profile.");
          setLoadingProfile(false);
          return;
        }

        const res = await axios.get(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${currentAuthToken}` },
        });

        if (res.data.success) {
          setCurrentUserId(res.data.user._id);
          setCurrentUserConnections(res.data.user.connections || []);
        } else {
          console.warn("Failed to fetch current user's profile:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching current user's profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (token) {
      fetchCurrentUserProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [token, backendURL]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, currentUserId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchUsers = async () => {
    setLoadingSearch(true);
    try {
      const storedToken = localStorage.getItem('token');
      const currentAuthToken = token || storedToken;

      if (!currentAuthToken) {
        console.error('No token found for search request.');
        setLoadingSearch(false);
        return;
      }

      const res = await axios.get(`${backendURL}/api/user/search?q=${query}`, {
        headers: { Authorization: `Bearer ${currentAuthToken}` },
      });

      const filteredUsers = res.data.users.filter(user => user._id !== currentUserId);
      setResults(filteredUsers);

    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleUserClick = (userId) => {
    setProfileUserId(userId);
    setQuery('');
    setResults([]);
    navigate('/profile');
  };

  const handleChatClick = (userId) => {
    navigate(`/chat/${userId}`);
    setQuery('');
    setResults([]);
  };

  const handleConnection = async (userId) => {
    try {
      const storedToken = localStorage.getItem('token');
      const currentAuthToken = token || storedToken;

      if (!currentAuthToken) {
        console.error('No token found for connection request.');
        return;
      }

      const isCurrentlyConnected = currentUserConnections.includes(userId);
      let newConnections;

      if (isCurrentlyConnected) {
        newConnections = currentUserConnections.filter(id => id !== userId);
      } else {
        newConnections = [...currentUserConnections, userId];
      }
      setCurrentUserConnections(newConnections);

      const response = await axios.post(
        `${backendURL}/api/user/updateConnections`,
        { connectionId: userId },
        { headers: { Authorization: `Bearer ${currentAuthToken}` } }
      );

      if (response.data.success) {
        console.log(response.data.message);
      } else {
        console.warn('Connection request not successful:', response.data.message);
        setCurrentUserConnections(isCurrentlyConnected ? [...newConnections, userId] : newConnections.filter(id => id !== userId));
        alert(response.data.message || 'Connection operation failed.');
      }
    } catch (err) {
      console.error('Connection failed:', err);
      const isCurrentlyConnected = currentUserConnections.includes(userId);
      setCurrentUserConnections(isCurrentlyConnected ? currentUserConnections.filter(id => id !== userId) : [...currentUserConnections, userId]);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('An error occurred during connection operation.');
      }
    }
  };

  if (loadingProfile && !currentUserId) {
    return (
      <div className="flex justify-center items-center h-8 w-full max-w-md mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-l-2 border-[#7494ec]"></div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      ref={searchContainerRef}
    >
      <div className="flex items-center gap-3 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-[#7494ec] transition-all duration-300">
        <FaSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search for people..."
          className="bg-transparent outline-none flex-grow text-gray-800 placeholder-gray-400 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() !== '' && (
        <div className="absolute z-10 bg-white shadow-lg rounded-xl w-full mt-2 max-h-80 overflow-y-auto border border-gray-200">
          {loadingSearch ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-l-2 border-[#7494ec]"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2 space-y-2">
              {results.map((user) => {
                const isConnected = currentUserConnections.includes(user._id);

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div
                      className="flex items-center gap-3 flex-grow cursor-pointer"
                      onClick={() => handleUserClick(user._id)}
                    >
                      <img
                        src={user.profilePic || '/profilepic.png'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#7494ec]"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleChatClick(user._id)}
                        className="p-2 rounded-full text-[#7494ec] bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center shadow-sm"
                        aria-label={`Message ${user.name}`}
                        title={`Message ${user.name}`}
                      >
                        <FaCommentDots className="text-base" />
                      </button>

                      <button
                        onClick={() => handleConnection(user._id)}
                        className={`p-2 rounded-full text-white transition-colors duration-200 flex items-center justify-center shadow-sm ${isConnected
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'bg-[#7494ec] hover:bg-[#5b7dd4]'
                          }`}
                        aria-label={isConnected ? `Disconnect from ${user.name}` : `Connect with ${user.name}`}
                        title={isConnected ? `Disconnect from ${user.name}` : `Connect with ${user.name}`}
                      >
                        {isConnected ? (
                          <FaUserTimes className="w-4 h-4 fill-red-500" />
                        ) : (
                          <FaUserPlus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-600">
              No results found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;