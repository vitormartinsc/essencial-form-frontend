import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Desabilitado temporariamente para testes sem servidor
  // const token = localStorage.getItem('accessToken');
  // return token ? children : <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
