import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const AuthProtector = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (token && location.pathname !== '/dashboard' && location.pathname !== '/login') {
      navigate('/dashboard');
    }
  }, [token, navigate, location]);

  if (!token) return null;

  return children;
}

export default AuthProtector