import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { validateEmail, validatePassword } from '../../utils/validate';
import axiosClient from '../../api/axiosClient';

const Register = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      toast.error(emailCheck.message);
      return false;
    }

    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.isValid) {
      toast.error(passwordCheck.message);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp!');
      return false;
    }

    return {
      username: formData.email.split('@')[0],
      email: formData.email,
      password: formData.password,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedData = validateForm();
    if (!validatedData) return;

    setLoading(true);
    try {
      await axiosClient.post('/auth/register.php', validatedData);
      toast.success('Đăng ký thành công!');
      if (onSwitch) onSwitch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  // Tách class để code sạch hơn và dễ quản lý dark mode
  const inputClass =
    'w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-sm dark:bg-slate-800/50 dark:border-slate-800 dark:text-white dark:focus:bg-slate-800 dark:placeholder-slate-600';
  const labelClass =
    'block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 dark:text-slate-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={labelClass}>Địa chỉ Gmail</label>
        <input
          type="email"
          placeholder="username@gmail.com"
          className={inputClass}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 dark:text-slate-500 dark:hover:text-slate-300"
          >
            {showPassword ? (
              <MdVisibilityOff size={20} />
            ) : (
              <MdVisibility size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Nhập lại mật khẩu</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 dark:text-slate-500 dark:hover:text-slate-300"
          >
            {showConfirmPassword ? (
              <MdVisibilityOff size={20} />
            ) : (
              <MdVisibility size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <button
          disabled={loading}
          className="dark:bg-primary w-full rounded-xl bg-slate-900 py-4 text-[11px] font-black text-white uppercase shadow-xl transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:shadow-none dark:hover:brightness-110"
        >
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản học viên'}
        </button>
      </div>
    </form>
  );
};

export default Register;
