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

  const validateForm = () => {
    // 0. Bắt buộc nhập
    if (!email) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!password) {
      toast.error("Vui lòng nhập password");
      return false;
    }

    if (/\s/.test(email)) {
      toast.error("Email không được chứa khoảng trắng!");
      return false;
    }
    if (!email.endsWith("@gmail.com")) {
      toast.error("Email đăng nhập bắt buộc phải có đuôi @gmail.com!");
      return false;
    }
    const localPart = email.split('@')[0];
    if (email.length > 254) {
      toast.error("Độ dài toàn bộ email không được vượt quá 254 ký tự!");
      return false;
    }

    if (/\s/.test(password)) {
      toast.error("Mật khẩu tuyệt đối không được chứa khoảng trắng!");
      return false;
    }
    // Ghi chú: Xóa validation Regex chữ hoa, thường ở Login để cứu tài khoản Admin CŨ.
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    toast.promise(
      login({ email, password }),
      {
        loading: 'Đang xác thực...',
        success: 'Đăng nhập thành công!',
        error: (err) => `Lỗi: ${err.response?.data?.message || 'Thông tin không chính xác'}`,
      }
    ).then((res) => {
      // Phân luồng giao diện tùy theo Role trả về từ thẻ Căn Cước
      if (res && res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }).catch(() => {});
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