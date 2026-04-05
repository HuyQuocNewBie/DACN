import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authApi from '../../api/auth.api';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(authApi.register(formData), {
        loading: 'Đang tạo tài khoản...',
        success: 'Đăng ký thành công! Hãy đăng nhập.',
        error: (err) =>
          `Lỗi: ${err.response?.data?.message || 'Email đã tồn tại'}`,
      });
      navigate('/login');
    } catch {
      /* Toast đã xử lý */
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-[#f3f4f5] border-none rounded-lg focus:ring-2 focus:ring-[#0058be]/20 text-[#191c1d] placeholder:text-[#c2c6d6] transition-all';
  const labelClass =
    'block text-[10px] font-bold uppercase tracking-wider text-[#424754] ml-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div className="space-y-1.5">
        <label className={labelClass}>Họ và tên</label>
        <input
          type="text"
          placeholder="Nguyễn Văn A"
          className={inputClass}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className={labelClass}>Email</label>
        <input
          type="email"
          placeholder="name@example.com"
          className={inputClass}
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className={labelClass}>Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={inputClass}
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            {showPassword ? (
              <MdVisibilityOff className="text-xl text-[#c2c6d6] hover:text-[#191c1d]" />
            ) : (
              <MdVisibility className="text-xl text-[#c2c6d6] hover:text-[#191c1d]" />
            )}
          </button>
        </div>
      </div>

      {/* Terms Agreement (Optional but looks professional) */}
      <p className="px-1 text-[11px] text-[#424754] italic">
        Bằng cách đăng ký, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
      </p>

      {/* Action Button */}
      <button className="w-full rounded-lg bg-linear-to-r from-[#006c49] to-[#4edea3] py-4 font-bold text-white shadow-[0_8px_16px_-4px_rgba(0,108,73,0.3)] transition-all hover:opacity-90 active:scale-[0.98]">
        Tạo tài khoản ngay
      </button>
    </form>
  );
};

export default Register;
