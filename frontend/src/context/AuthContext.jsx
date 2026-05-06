import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on mount:', token); // Debug
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      console.log('Fetching user data with token:', token); // Debug
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User data received:', response.data); // Debug
      setUser(response.data);
      setIsAuthenticated(true); // Set this AFTER successful fetch
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, userData = null) => {
    console.log('Login called with token:', token, 'userData:', userData); // Debug
    localStorage.setItem('token', token);
    
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      // Fetch user data from backend if not provided
      await fetchUserData(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    setUser,
  };
  {/* make value available to all child component */}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context. For reading the data from AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  } 
  return context;
};