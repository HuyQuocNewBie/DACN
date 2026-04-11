import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // CHÚ Ý: Chỉnh sửa lại đường dẫn localhost này cho đúng với máy tính XAMPP của bạn
      const res = await fetch("http://localhost:8000/api/auth/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok || res.status === 201) {
        toast.success(data.message || "Đăng ký thành công! Hãy Đăng nhập.");
        navigate('/login');
      } else {
        toast.error(data.message || "Lỗi đăng ký");
      }
    } catch (error) {
      toast.error("Không kết nối được Backend: Nhớ bật XAMPP lên nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Tạo tài khoản mới</h2>
          <p className="text-sm text-slate-500 mt-2">Ghi nhớ kiến thức hiệu quả hơn mỗi ngày</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên</label>
            <input 
              type="text" name="fullname" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
              placeholder="VD: Nguyễn Văn A"
              onChange={(e) => setFormData({...formData, fullname: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" name="email" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
              placeholder="email@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input 
              type="password" name="password" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
