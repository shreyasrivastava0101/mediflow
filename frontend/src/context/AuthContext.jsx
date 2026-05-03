import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const previewMode = true;
  const previewUser = { id: 'preview', name: 'Demo Patient', email: 'demo@mediflow.com', role: 'Patient' };
  const [user, setUser] = useState(previewUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!previewMode) {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await api.get('/user/profile');
            setUser(res.data.data);
          } catch (error) {
            console.error('Auth error', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        setLoading(false);
      };
      checkAuth();
    }
  }, []);

  const login = async () => {
    toast('Login is disabled in preview mode. Browse the dashboard directly.');
    return { success: false };
  };

  const demoLogin = async () => {
    toast.success('Preview mode active. Dashboard is ready.');
    setUser(previewUser);
    return { success: true, user: previewUser };
  };

  const register = async () => {
    toast('Registration is disabled in preview mode. Enjoy the demo experience.');
    return false;
  };

  const logout = () => {
    toast('Logout is disabled while previewing the dashboard.');
  };

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
