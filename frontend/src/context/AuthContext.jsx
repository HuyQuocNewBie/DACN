import { createContext, useState, useEffect } from 'react';
import authApi from '../api/auth.api';

// 1. Chuyển export này thành bình thường (không export ra ngoài nữa)
const AuthContext = createContext();

// Để các file khác dùng được Context, ta vẫn cần export nó hoặc dùng export này 
// nhưng để tránh lỗi Fast Refresh, tốt nhất là export Hook riêng (Bước 1.1 bên dưới)
export { AuthContext }; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authApi.getProfile();
          setUser(res.user);
        } catch {
          // 2. Sửa lỗi unused: Bỏ biến 'error' nếu không dùng đến
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    localStorage.setItem('token', res.access_token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};