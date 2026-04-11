import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok || res.status === 200) {
        toast.success(data.message || "Đăng nhập thành công!");
        // Lưu token giả lập vào LocalStorage để chặn vòng lặp AuthRoute
        localStorage.setItem('sr_token', data.token);
        localStorage.setItem('sr_user', JSON.stringify({ role: data.role, fullname: data.fullname }));
        
        // Điều hướng dựa vào Role
        // Ép web làm mới lại nhằm kích hoạt AuthContext đọc Token mới
        if (data.role === 'admin') window.location.href = '/admin';
        else window.location.href = '/dashboard';
      } else {
        toast.error(data.message || "Sai thông tin");
      }
    } catch (error) {
      toast.error("Không kết nối được Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Đăng Nhập</h2>
          <p className="text-sm text-slate-500 mt-2">Chào mừng trở lại! Hôm nay bạn sẽ học gì?</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
              placeholder="email@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input 
              type="password" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-slate-700">Nhớ tài khoản</label>
            </div>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Bắt Đầu Ôn Tập"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản? <Link to="/register" className="text-green-600 hover:text-green-800 font-semibold underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;