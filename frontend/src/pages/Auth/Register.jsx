import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authApi from '../../api/auth.api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        authApi.register(formData),
        {
          loading: 'Đang tạo tài khoản...',
          success: 'Đăng ký thành công! Hãy đăng nhập.',
          error: 'Email đã tồn tại hoặc dữ liệu không hợp lệ',
        }
      );
      navigate('/login');
    } catch  { /* Toast đã xử lý */ }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" placeholder="Họ và tên" className="border p-2 rounded" required
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
      />
      <input 
        type="email" placeholder="Email" className="border p-2 rounded" required
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
      />
      <input 
        type="password" placeholder="Mật khẩu" className="border p-2 rounded" required
        onChange={(e) => setFormData({...formData, password: e.target.value})} 
      />
      <button type="submit" className="bg-primary text-white p-2 rounded font-bold">
        Đăng ký
      </button>
      <p className="text-center text-sm text-slate-500">
        Đã có tài khoản? <Link to="/login" className="text-primary hover:underline">Đăng nhập</Link>
      </p>
    </form>
  );
};

export default Register;