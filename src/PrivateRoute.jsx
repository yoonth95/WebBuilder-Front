import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useAuth(setIsLoading, setIsAuthenticated);

  if (isLoading) return null
  
  return isAuthenticated ? children : <Navigate to='/' state={{ from: location }} />;
};

export default PrivateRoute;
