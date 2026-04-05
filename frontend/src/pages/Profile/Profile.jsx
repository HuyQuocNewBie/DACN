import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success('Cập nhật thành công!', { id: 'update-profile' });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
          Hồ sơ cá nhân
        </h1>
        <p className="text-on-surface-variant mt-2">
          Quản lý thông tin và tài khoản của bạn
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-surface-container rounded-2xl p-8 shadow-sm">

        {/* TOP INFO */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-outline-variant pb-6">

          {/* AVATAR */}
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-on-surface">
              {user?.name}
            </h2>
            <p className="text-on-surface-variant text-sm">
              {user?.email}
            </p>
          </div>

          {/* ACTION */}
          <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container transition">
            Chỉnh sửa ảnh
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="mt-8 grid md:grid-cols-2 gap-6">

          {/* NAME */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-on-surface-variant">
              Họ và tên
            </label>
            <input
              defaultValue={user?.name}
              className="w-full p-4 rounded-xl bg-surface-container-lowest border border-outline-variant focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-on-surface-variant">
              Email
            </label>
            <input
              defaultValue={user?.email}
              disabled
              className="w-full p-4 rounded-xl bg-surface-container-lowest border border-outline-variant opacity-60"
            />
          </div>

          {/* ACTION */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-80 transition"
            >
              Đổi mật khẩu
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* STATS (OPTIONAL - cho đẹp + xịn) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-on-surface-variant text-sm">Bộ thẻ</p>
          <p className="text-2xl font-bold text-primary mt-1">12</p>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-on-surface-variant text-sm">Đã học</p>
          <p className="text-2xl font-bold text-secondary mt-1">320</p>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-on-surface-variant text-sm">Streak</p>
          <p className="text-2xl font-bold text-tertiary mt-1">7 ngày</p>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-error-container/20 border border-error/20 rounded-2xl p-6">
        <h3 className="text-error font-bold mb-2">Vùng nguy hiểm</h3>
        <p className="text-sm text-on-error-container mb-4">
          Xóa tài khoản sẽ mất toàn bộ dữ liệu học tập.
        </p>

        <button className="px-4 py-2 rounded-lg bg-error text-white font-bold hover:opacity-90 transition">
          Xóa tài khoản
        </button>
      </div>
    </div>
  );
};

export default Profile;