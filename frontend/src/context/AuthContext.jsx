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
      const token = localStorage.getItem('sr_token');
      const savedUser = localStorage.getItem('sr_user');
      if (token && savedUser) {
        // Tạm thời lấy User trực tiếp từ LocalStorage do Backend PHP chưa có hàm getProfile()
        setUser(JSON.parse(savedUser));
      } else {
        localStorage.removeItem('sr_token');
        localStorage.removeItem('sr_user');
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser({ role: res.role, fullname: res.fullname });
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