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
        const response = await axios.get(`${apiUrl}/auth/me`);
        const userData = response.data;

        // Verificar se é admin
        if (userData.role !== 'admin' && userData.role !== 'superadmin') {
          console.error('Usuário não é admin');
          logout();
          setLoading(false);
          return;
        }

        setUser(userData);
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
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password
      });

      const { user, token: authToken } = response.data;

      // Verificar se o usuário é admin
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        return {
          success: false,
          error: 'Acesso negado. Apenas administradores podem acessar.'
        };
      }

      setUser(user);
      setToken(authToken);
      localStorage.setItem('admin_token', authToken);
      localStorage.setItem('admin_user', JSON.stringify(user));

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login'
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
