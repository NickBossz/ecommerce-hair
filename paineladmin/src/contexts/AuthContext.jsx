import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Configurar axios com token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar sessão ao carregar
  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/auth/verify`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Sessão inválida:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [token]);

  const loginAdmin = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login/admin`, {
        email,
        password
      });

      const { user, session } = response.data;

      setUser(user);
      setToken(session.access_token);
      localStorage.setItem('admin_token', session.access_token);
      localStorage.setItem('admin_user', JSON.stringify(user));

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    loginAdmin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
