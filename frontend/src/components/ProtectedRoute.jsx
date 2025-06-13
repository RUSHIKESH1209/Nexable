import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
