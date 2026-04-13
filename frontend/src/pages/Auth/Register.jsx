import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // === CÁC LUẬT KIỂM TRA (VALIDATION) ===
  const validateForm = () => {
    const fullname = formData.fullname.trim();
    const email = formData.email;
    const password = formData.password;

    // 0. Bắt buộc nhập ráp theo nghiệp vụ
    if (!fullname) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }
    if (!email) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!password) {
      toast.error("Vui lòng nhập password");
      return false;
    }

    // 1. Fullname
    if (fullname.length < 10 || fullname.length > 255) {
      toast.error("Họ và tên phải từ 10 đến 255 ký tự!");
      return false;
    }

    // 2. Email
    if (/\s/.test(email)) {
      toast.error("Email không được chứa khoảng trắng!");
      return false;
    }
    if (!email.endsWith("@gmail.com")) {
      toast.error("Email đăng ký bắt buộc phải có đuôi @gmail.com!");
      return false;
    }
    const localPart = email.split('@')[0];
    if (localPart.length < 5 || localPart.length > 10) {
      toast.error("Phần tên email (trước @) phải từ 5 đến 10 ký tự!");
      return false;
    }
    if (email.length > 254) {
      toast.error("Độ dài toàn bộ email không được vượt quá 254 ký tự!");
      return false;
    }

    // 3. Password
    if (/\s/.test(password)) {
      toast.error("Mật khẩu tuyệt đối không được chứa khoảng trắng!");
      return false;
    }
    if (password.length < 10 || password.length > 12) {
      toast.error("Mật khẩu phải từ 10 đến 12 ký tự!");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 chữ IN HOA!");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 chữ IN THƯỜNG!");
      return false;
    }
    if (!/\d/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 CHỮ SỐ!");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 KÝ TỰ ĐẶC BIỆT!");
      return false;
    }

    return { fullname, email, password };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gọi hàm kiểm duyệt dữ liệu trước khi đụng vào server
    const validatedData = validateForm();
    if (!validatedData) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Truyền cục dữ liệu đã trim sạch thay vì formData gốc
        body: JSON.stringify(validatedData)
      });
      const data = await res.json();

      if (res.ok || res.status === 201) {
        toast.success(data.message || "Đăng ký thành công! Hãy đăng nhập.");
        navigate('/login');
      } else {
        toast.error(data.message || "Lỗi đăng ký");
      }
    } catch (error) {
      toast.error("Không kết nối được Backend!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-[#f3f4f5] border-none rounded-lg focus:ring-2 focus:ring-[#0058be]/20 text-on-surface placeholder:text-outline-variant transition-all';
  const labelClass =
    'block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className={labelClass}>Họ và tên</label>
        <input
          type="text"
          placeholder="Nguyễn Văn A"
          className={inputClass}
          required
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Email</label>
        <input
          type="email"
          placeholder="name@gmail.com"
          className={inputClass}
          required
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
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            {showPassword ? (
              <MdVisibilityOff className="text-xl text-outline-variant hover:text-on-surface" />
            ) : (
              <MdVisibility className="text-xl text-outline-variant hover:text-on-surface" />
            )}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold underline">Đăng nhập</Link>
        </p>
      </div>

      <p className="px-1 text-[11px] text-on-surface-variant italic">
        Bằng cách đăng ký, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
      </p>

      <button disabled={loading} className="w-full rounded-lg bg-linear-to-r from-secondary to-[#4edea3] py-4 font-bold text-white shadow-[0_8px_16px_-4px_rgba(0,108,73,0.3)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
        {loading ? "Đang xử lý..." : "Tạo tài khoản ngay"}
      </button>
    </form>
  );
};

export default Register;