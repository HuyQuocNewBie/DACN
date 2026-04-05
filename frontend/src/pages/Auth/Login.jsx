import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.promise(
      login({ email, password }),
      {
        loading: 'Đang xác thực...',
        success: 'Đăng nhập thành công!',
        error: (err) => `Lỗi: ${err.response?.data?.message || 'Thông tin không chính xác'}`,
      }
    ).then(() => navigate('/dashboard')).catch(() => {});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* EMAIL */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
          Email
        </label>
        <input 
          type="email" 
          required
          placeholder="name@example.com"
          className="w-full px-4 py-3 bg-surface-container-low rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition"
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Mật khẩu
          </label>
          <a className="text-[11px] font-semibold text-primary hover:underline" href="#">
            Quên mật khẩu?
          </a>
        </div>

        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-surface-container-low rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition"
            onChange={(e) => setPassword(e.target.value)} 
          />

          {/* ICON BUTTON */}
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <MdVisibilityOff className="text-xl text-outline-variant hover:text-on-surface transition" />
            ) : (
              <MdVisibility className="text-xl text-outline-variant hover:text-on-surface transition" />
            )}
          </button>
        </div>
      </div>

      {/* REMEMBER */}
      <div className="flex items-center gap-2 px-1">
        <input type="checkbox" id="remember" className="w-4 h-4 accent-primary" />
        <label htmlFor="remember" className="text-sm text-on-surface-variant font-medium">
          Ghi nhớ đăng nhập
        </label>
      </div>

      {/* SUBMIT */}
      <button className="w-full py-4 bg-linear-to-r from-primary to-primary-container text-white font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition">
        Đăng nhập
      </button>

    </form>
  );
};

export default Login;