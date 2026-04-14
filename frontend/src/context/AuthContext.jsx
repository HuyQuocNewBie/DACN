import { createContext, useState, useEffect } from 'react';
import authApi from '../api/auth.api';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('sr_token');
      const savedUser = localStorage.getItem('sr_user');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        localStorage.removeItem('sr_token');
        localStorage.removeItem('sr_user');
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sr_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const loggedUser = {
      role: res.role,
      username: res.username || res.fullname,
      email: credentials.email,
    };
    setUser(loggedUser);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
