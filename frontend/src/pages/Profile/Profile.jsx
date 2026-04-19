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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [stats, setStats] = useState({
    total_decks: 0,
    mastered_cards: 0,
    retention_rate: 100,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await userApi.getStatistics();
        setStats(response);
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStatistics();
  }, []);

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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      return toast.error('Chỉ hỗ trợ ảnh JPG hoặc PNG');
    }

    if (file.size > maxSize) {
      return toast.error('Ảnh không được vượt quá 2MB');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result || '');
    };
    reader.readAsDataURL(file);

    setSelectedAvatarFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      let updatedUser = { ...user, username };

      if (selectedAvatarFile) {
        const response = await userApi.uploadAvatar(selectedAvatarFile);
        updatedUser.avatar = response.avatar;
      }

      await userApi.updateProfile(updateData);

      toast.success('Cập nhật thông tin thành công!');
      setUser(updatedUser);

      setSelectedAvatarFile(null);
      setPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
      );
      setAvatarPreview(user?.avatar || '');
      setSelectedAvatarFile(null);
    } finally {
      setLoading(false);
    }
  };

  // Nâng cấp inputClass và labelClass để hỗ trợ Dark Mode
  const inputClass =
    'w-full rounded-xl border border-slate-200 p-3.5 transition-colors duration-300 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-primary';
  const labelClass =
    'ml-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-colors duration-300 dark:text-slate-500';

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      
      {/* --- HEADER --- */}
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-colors duration-300 md:flex-row md:items-center md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl dark:bg-indigo-500/10"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 transition-colors duration-300 md:text-3xl dark:text-white">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 transition-colors duration-300 md:text-base dark:text-slate-400">
            Quản lý thông tin và tài khoản của bạn để đồng bộ tiến độ học tập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* --- CỘT TRÁI (THÔNG TIN CHÍNH) --- */}
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors duration-300 md:p-8 dark:border-slate-800 dark:bg-slate-900">
            
            {/* User Info Header */}
            <div className="flex flex-col gap-6 border-b border-slate-50 pb-8 transition-colors duration-300 md:flex-row md:items-center dark:border-slate-800">
              <div className="group relative">
                <div className="bg-primary/10 text-primary border-primary/20 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 text-4xl font-bold shadow-inner transition-colors duration-300 dark:bg-primary/20">
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
                  disabled={loading}
                  className="absolute -right-1 -bottom-1 cursor-pointer rounded-full border border-slate-100 bg-white p-2 shadow-md transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  📷
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={loading}
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 transition-colors duration-300 dark:text-white">
                  {username || 'Người dùng'}
                </h2>
                <p className="font-medium text-slate-500 transition-colors duration-300 dark:text-slate-400">
                  {user?.email}
                </p>
                <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 transition-colors duration-300 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Tài khoản đã xác thực
                </div>
              </div>

              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={loading}
                className="hover:bg-primary rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 dark:bg-primary dark:shadow-none dark:hover:bg-primary/90"
              >
                Chỉnh sửa ảnh
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Tên hiển thị</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên của bạn..."
                    className={`${inputClass} bg-slate-50 dark:bg-slate-950`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Email (Cố định)</label>
                  <input
                    defaultValue={user?.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3.5 text-sm text-slate-400 italic transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500"
                  />
                </div>
              </div>

              <div
                className={`rounded-xl border transition-all duration-300 ${
                  showPasswordFields 
                    ? 'border-primary/20 bg-primary/5 p-5 dark:border-primary/20 dark:bg-primary/10' 
                    : 'border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30'
                }`}
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
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-700 transition-colors dark:text-slate-200">
                        Đổi mật khẩu mới
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordFields(false);
                          setPassword('');
                          setConfirmPassword('');
                        }}
                        className="text-xs font-bold text-slate-400 transition-colors hover:text-red-500 dark:text-slate-500 dark:hover:text-rose-400"
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
                            className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors dark:text-slate-500"
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
                            className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors dark:text-slate-500"
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
                  className="bg-primary shadow-primary/20 hover:bg-primary/90 min-w-40 rounded-xl px-10 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 dark:shadow-none"
                >
                  {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI (THỐNG KÊ & KHÁM PHÁ) --- */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-800 transition-colors duration-300 dark:text-slate-200">
              📊 Thống kê tổng quát
            </h3>
            <div className="space-y-5">
              {loadingStats ? (
                <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50 text-sm font-medium text-slate-500 transition-colors duration-300 dark:bg-slate-800/50 dark:text-slate-400">
                  Đang tải dữ liệu...
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4 transition-colors duration-300 dark:bg-blue-500/10">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase transition-colors duration-300 dark:text-blue-400">
                        Bộ thẻ
                      </p>
                      <p className="mt-0.5 text-2xl font-black text-blue-900 transition-colors duration-300 dark:text-blue-300">
                        {stats.total_decks}
                      </p>
                    </div>
                    <span className="text-2xl">🗂️</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4 transition-colors duration-300 dark:bg-purple-500/10">
                    <div>
                      <p className="text-xs font-bold text-purple-600 uppercase transition-colors duration-300 dark:text-purple-400">
                        Thẻ thành thạo
                      </p>
                      <p className="mt-0.5 text-2xl font-black text-purple-900 transition-colors duration-300 dark:text-purple-300">
                        {stats.mastered_cards}
                      </p>
                    </div>
                    <span className="text-2xl">🧠</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4 transition-colors duration-300 dark:bg-orange-500/10">
                    <div>
                      <p className="text-xs font-bold text-orange-600 uppercase transition-colors duration-300 dark:text-orange-400">
                        Tỷ lệ ghi nhớ
                      </p>
                      <p className="mt-0.5 text-2xl font-black text-orange-900 transition-colors duration-300 dark:text-orange-300">
                        {stats.retention_rate}%
                      </p>
                    </div>
                    <span className="text-2xl">🔥</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl shadow-indigo-100 transition-shadow duration-300 dark:shadow-none">
            <h4 className="mb-2 font-bold">Khám phá nội dung</h4>
            <p className="text-xs leading-relaxed opacity-90">
              Tìm và lựa chọn các bộ thẻ phù hợp để bắt đầu học hoặc mở rộng
              kiến thức của bạn.
            </p>
            <Link
              to="/explore"
              className="hover:bg-opacity-90 mt-4 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-black text-indigo-600 transition-colors dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
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