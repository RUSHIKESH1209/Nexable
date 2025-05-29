import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendURL}/api/user/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data.users);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
        <FaSearch className="text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {results.length > 0 && (
        <div className="absolute z-10 bg-white shadow-md rounded-md w-full mt-1 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user._id}
              className="p-2 border-b hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            >
              <img
                src={user.profilePic || '/profilepic.png'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
