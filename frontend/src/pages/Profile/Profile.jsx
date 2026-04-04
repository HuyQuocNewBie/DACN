import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success("Cập nhật thông tin thành công! (Dữ liệu mẫu)");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Cài đặt cá nhân</h1>
        <p className="text-slate-500 text-sm">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-500 text-sm">Thành viên từ: 2026</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Họ và tên" defaultValue={user?.name} />
          <Input label="Email" defaultValue={user?.email} disabled />
          <div className="pt-4 flex gap-3">
            <Button type="submit">Lưu thay đổi</Button>
            <Button variant="outline">Đổi mật khẩu</Button>
          </div>
        </form>
      </div>

      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
        <h3 className="text-red-700 font-bold mb-2">Vùng nguy hiểm</h3>
        <p className="text-red-600 text-sm mb-4">Xóa tài khoản sẽ mất toàn bộ dữ liệu bộ thẻ và quá trình học tập.</p>
        <button className="text-red-700 font-bold hover:underline text-sm">Xóa tài khoản ngay</button>
      </div>
    </div>
  );
};

export default Profile;