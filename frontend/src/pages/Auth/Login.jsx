import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    if (/\s/.test(email)) {
      toast.error('Email không được chứa khoảng trắng!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Định dạng email không hợp lệ!');
      return false;
    }

    if (!email.endsWith('@gmail.com')) {
      toast.error('Hệ thống chỉ hỗ trợ @gmail.com!');
      return false;
    }

    if (/\s/.test(password)) {
      toast.error('Mật khẩu không được chứa khoảng trắng!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await toast.promise(login({ email, password }), {
        loading: 'Đang xác thực...',
        success: 'Đăng nhập thành công!',
        error: (err) =>
          `${err.response?.data?.message || 'Thông tin không chính xác'}`,
      });

      if (res && res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Tách class để tái sử dụng và quản lý Dark Mode (Giống bên Register)
  const inputClass =
    'w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-sm dark:bg-slate-800/50 dark:border-slate-800 dark:text-white dark:focus:bg-slate-800 dark:placeholder-slate-600';
  const labelClass =
    'block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 dark:text-slate-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className={labelClass}>Email học viên</label>
        <input
          type="email"
          value={email}
          placeholder="name@gmail.com"
          className={inputClass}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="••••••••"
            className={inputClass}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            {showPassword ? (
              <MdVisibilityOff size={20} />
            ) : (
              <MdVisibility size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="dark:accent-primary h-4 w-4 rounded border-slate-300 accent-slate-900 dark:border-slate-600 dark:bg-slate-700"
            />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Ghi nhớ tôi
            </span>
          </label>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="text-primary transition-all hover:underline"
            >
              Đăng ký
            </button>
          </p>
        </div>

        <button
          type="submit"
          className="dark:bg-primary w-full rounded-xl bg-slate-900 py-4 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98] dark:shadow-none dark:hover:brightness-110"
        >
          Xác nhận đăng nhập
        </button>
      </div>
    </form>
  );
};

export default Login;