import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string;
  role: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const token = localStorage.getItem('token');
    if (token) {
      loadCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);

      const { data } = await api.post('/auth/signup', {
        email,
        password,
        full_name: fullName,
      });

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        error: new Error(
          error.response?.data?.error || 'Error creating account. Please try again.'
        ),
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);

      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        error: new Error(
          error.response?.data?.error || 'Invalid credentials'
        ),
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      localStorage.removeItem('token');
      setUser(null);
      toast.error('Error logging out');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // TODO: Implement profile update endpoint
      // For now, just update local state
      setUser({ ...user, ...data });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
