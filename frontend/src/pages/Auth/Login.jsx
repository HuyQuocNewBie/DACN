import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useGoogleLogin } from '@react-oauth/google';
import authApi from '../../api/auth.api';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      // Dùng access token để lấy thông tin user từ Google
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const googleUser = await googleRes.json();

      // Tạo credential object giả để gửi email/name lên backend
      // Backend sẽ verify bằng email từ Google userinfo
      const res = await authApi.googleLogin(tokenResponse.access_token);

      const loggedUser = {
        role:     res.role,
        username: res.username,
        email:    res.email,
        avatar:   res.avatar || googleUser.picture || null,
      };
      setUser(loggedUser);
      localStorage.setItem('sr_user', JSON.stringify(loggedUser));

      toast.success(`Xin chào, ${res.username}! 👋`);
      if (res.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error('Đăng nhập Google thất bại!');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError:   () => toast.error('Đăng nhập Google thất bại!'),
  });

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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="ml-1 block text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
          Email học viên
        </label>
        <input
          type="email"
          value={email}
          placeholder="name@gmail.com"
          className="ring-primary/10 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm transition-all outline-none focus:bg-white focus:ring-4"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="ml-1 block text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="••••••••"
            className="ring-primary/10 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm transition-all outline-none focus:bg-white focus:ring-4"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
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
              className="h-4 w-4 rounded border-slate-300 accent-slate-900"
            />
            <span className="text-xs font-bold text-slate-500">
              Ghi nhớ tôi
            </span>
          </label>

          <p className="text-xs font-bold text-slate-500">
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
          className="w-full rounded-xl bg-slate-900 py-4 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98]"
        >
          Xác nhận đăng nhập
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Hoặc</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.4C9.7 35.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2C41 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Tiếp tục với Google
        </button>
      </div>
    </form>
  );
};

export default Login;
