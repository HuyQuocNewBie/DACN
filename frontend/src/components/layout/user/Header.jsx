import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';

import { useTheme } from '../../../context/ThemeContext';

const getDisplayName = (user) =>
  user?.username || user?.fullname || user?.name || 'Học viên';

const Header = ({ title = 'Bảng điều khiển', isSidebarOpen = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { isDarkMode, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    const fullName = getDisplayName(user);

    logout();
    setShowLogoutModal(false);

    toast.success(`Hẹn gặp lại, ${fullName}! 👋`);

    navigate('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80 ${isSidebarOpen ? 'md:left-64' : 'md:left-24'}`}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl dark:text-white">
            <p className="text-primary mb-1 text-[10px] leading-none font-black tracking-widest uppercase">
              Hệ thống
            </p>
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 focus:outline-none active:scale-95 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
            title={isDarkMode ? 'Bật chế độ sáng' : 'Bật chế độ tối'}
          >
            <span
              className={`material-symbols-outlined text-xl transition-transform duration-500 ${isDarkMode ? 'rotate-360' : 'rotate-0'}`}
            >
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="group flex items-center gap-3 rounded-[1.25rem] bg-slate-50 p-1.5 pr-4 transition-all hover:bg-slate-100 focus:outline-none active:scale-95 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <div className="group-hover:bg-primary/10 flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm font-black text-slate-600 transition-all dark:bg-slate-700 dark:text-slate-300">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={getDisplayName(user)}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName(user))}&background=random`;
                    }}
                  />
                ) : (
                  getDisplayName(user).charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs leading-none font-black text-slate-900 dark:text-slate-100">
                  {getDisplayName(user).split(' ').pop()}
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Học viên
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              >
                expand_more
              </span>
            </button>

            {open && (
              <div className="animate-in fade-in slide-in-from-top-4 absolute right-0 z-50 mt-4 w-64 overflow-hidden rounded-4xl border border-slate-100 bg-white py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] duration-200 dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="mb-2 border-b border-slate-50 px-6 py-4 dark:border-slate-700">
                  <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase dark:text-slate-500">
                    Tài khoản của bạn
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-lg dark:bg-slate-700">
                      👤
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                        {getDisplayName(user)}
                      </p>
                      <p className="truncate text-[11px] font-medium text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 px-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setOpen(false);
                    }}
                    className="hover:text-primary group dark:hover:text-primary flex w-full items-center gap-4 rounded-[1.25rem] px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
                      person
                    </span>
                    Trang cá nhân
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate(isAdminPath ? '/dashboard' : '/admin');
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-4 rounded-[1.25rem] px-4 py-3 text-sm font-black transition-all ${
                        isAdminPath
                          ? 'text-primary bg-primary/5 hover:bg-primary/10 dark:text-primary dark:hover:bg-primary/20'
                          : 'bg-orange-50/50 text-orange-500 hover:bg-orange-50 dark:bg-orange-500/10 dark:hover:bg-orange-500/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {isAdminPath ? 'rocket_launch' : 'admin_panel_settings'}
                      </span>
                      {isAdminPath ? 'Chế độ Người dùng' : 'Bảng Quản trị'}
                    </button>
                  )}
                </div>

                <div className="mt-2 border-t border-slate-50 px-2 pt-2 dark:border-slate-700">
                  <button
                    onClick={handleLogoutClick}
                    className="group flex w-full items-center gap-4 rounded-[1.25rem] px-4 py-3 text-sm font-black text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-12">
                      logout
                    </span>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-md duration-300 dark:bg-slate-900/60">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] duration-300 dark:border-slate-700 dark:bg-slate-800">
            <div className="h-2 w-full bg-red-500"></div>
            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl shadow-inner dark:bg-red-500/10 dark:shadow-none">
                👋
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Đăng xuất?
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Bạn có chắc chắn muốn rời đi? Mọi tiến trình học tập của bạn đều
                đã được lưu lại an toàn.
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 text-sm font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 rounded-2xl bg-red-500 py-4 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-red-500/30 transition-all hover:bg-red-600 active:scale-95 dark:shadow-none"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
