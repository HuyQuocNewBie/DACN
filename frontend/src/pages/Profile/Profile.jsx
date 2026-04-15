import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import userApi from '../../api/user.api';
import { validatePassword } from '../../utils/validate';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      return toast.error('Chỉ hỗ trợ ảnh JPG hoặc PNG');
    }

    if (file.size > maxSize) {
      return toast.error('Ảnh không được vượt quá 2MB');
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result || '');
    };
    reader.readAsDataURL(file);

    // Upload
    setAvatarLoading(true);
    try {
      const response = await userApi.uploadAvatar(file);
      toast.success('Cập nhật ảnh đại diện thành công!');
      setUser({ ...user, avatar: response.avatar });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi upload ảnh');
      setAvatarPreview(user?.avatar || '');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      return toast.error('Tên hiển thị không được để trống!');
    }

    const updateData = { username };

    if (showPasswordFields) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return toast.error(passwordValidation.message);
      }
      if (password !== confirmPassword) {
        return toast.error('Mật khẩu xác nhận không khớp!');
      }
      updateData.password = password;
    }

    setLoading(true);
    try {
      await userApi.updateProfile(updateData);
      toast.success('Cập nhật thông tin thành công!');
      setUser({ ...user, username });

      setPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'focus:ring-primary/20 focus:border-primary w-full rounded-xl border border-slate-200 bg-white p-3.5 transition-all outline-none focus:ring-2 text-sm';
  const labelClass =
    'ml-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase';

  return (
    <div className="space-y-8">
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 md:text-base">
            Quản lý thông tin và tài khoản của bạn để đồng bộ tiến độ học tập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 border-b border-slate-50 pb-8 md:flex-row md:items-center">
              <div className="group relative">
                <div className="bg-primary/10 text-primary border-primary/20 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 text-4xl font-bold shadow-inner">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={avatarLoading}
                  className="absolute -right-1 -bottom-1 cursor-pointer rounded-full border border-slate-100 bg-white p-2 shadow-md transition-all hover:bg-slate-50 disabled:opacity-50"
                >
                  {avatarLoading ? '⏳' : '📷'}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={avatarLoading}
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">
                  {username || 'Người dùng'}
                </h2>
                <p className="font-medium text-slate-500">{user?.email}</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Tài khoản đã xác thực
                </div>
              </div>

              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={avatarLoading}
                className="hover:bg-primary rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {avatarLoading ? 'Đang tải...' : 'Chỉnh sửa ảnh'}
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Tên hiển thị</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên của bạn..."
                    className={inputClass.replace('bg-white', 'bg-slate-50')}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Email (Cố định)</label>
                  <input
                    defaultValue={user?.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3.5 text-sm text-slate-400 italic"
                  />
                </div>
              </div>

              <div
                className={`rounded-xl border transition-all duration-300 ${showPasswordFields ? 'border-primary/20 bg-primary/5 p-5' : 'border-slate-100 bg-slate-50/50 p-4'}`}
              >
                {!showPasswordFields ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(true)}
                    className="text-primary flex items-center gap-2 text-sm font-bold hover:underline"
                  >
                    <span>🔒</span> Thay đổi mật khẩu truy cập?
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-700">
                        Đổi mật khẩu mới
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordFields(false);
                          setPassword('');
                          setConfirmPassword('');
                        }}
                        className="text-xs font-bold text-slate-400 transition-colors hover:text-red-500"
                      >
                        Hủy thay đổi
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className={labelClass}>Mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputClass + ' pr-11'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors"
                          >
                            {showPassword ? (
                              <MdVisibilityOff size={20} />
                            ) : (
                              <MdVisibility size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Xác nhận lại</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputClass + ' pr-11'}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <MdVisibilityOff size={20} />
                            ) : (
                              <MdVisibility size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary shadow-primary/20 hover:bg-primary/90 min-w-40 rounded-xl px-10 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-800">
              📊 Thống kê tổng quát
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase">
                    Bộ thẻ
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-blue-900">12</p>
                </div>
                <span className="text-2xl">🗂️</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4">
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase">
                    Đã học
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-purple-900">
                    320
                  </p>
                </div>
                <span className="text-2xl">🧠</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4">
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase">
                    Streak
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-orange-900">
                    7 ngày
                  </p>
                </div>
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl shadow-indigo-100">
            <h4 className="mb-2 font-bold">Khám phá nội dung</h4>
            <p className="text-xs leading-relaxed opacity-90">
              Tìm và lựa chọn các bộ thẻ phù hợp để bắt đầu học hoặc mở rộng
              kiến thức của bạn.
            </p>
            <Link
              to="/explore"
              className="hover:bg-opacity-90 mt-4 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-black text-indigo-600 transition-colors"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
