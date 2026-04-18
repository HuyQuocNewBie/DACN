import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth'; 
import { toast } from 'react-hot-toast';

const getDisplayName = (user) =>
  user?.username || user?.fullname || user?.name || 'Quản trị viên';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const fullName = getDisplayName(user);
    logout();
    setOpen(false);
    setIsLogoutModalOpen(false);
    toast.success(`Hẹn gặp lại, ${fullName}! 👋`);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-xl transition-all duration-300">
        <div>
          <p className="mb-1 text-[10px] font-black leading-none tracking-widest text-primary uppercase">
            Hệ thống
          </p>
          <h2 className="text-xl font-black tracking-tight text-slate-900 capitalize md:text-2xl">
            {location.pathname.split('/').pop() || 'Tổng quan'}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <button className="hover:bg-primary/10 hover:text-primary group relative rounded-2xl bg-slate-50 p-2.5 text-slate-400 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[24px] leading-none">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary group-hover:animate-ping"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="group flex items-center gap-3 rounded-[1.25rem] bg-slate-50 p-1.5 pr-4 transition-all hover:bg-slate-100 focus:outline-none active:scale-95"
            >
              {/* Avatar Container: Đã sửa màu nền bg-primary/10 để ảnh sáng hơn */}
              <div className="group-hover:bg-primary group-hover:shadow-primary/30 flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-sm font-black text-primary shadow-lg shadow-slate-200 transition-all">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={getDisplayName(user)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getDisplayName(user).charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="hidden text-left md:block">
                <p className="text-xs leading-none font-black text-slate-900">
                  {getDisplayName(user).split(' ').pop()}
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Quản trị viên
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              >
                expand_more
              </span>
            </button>

            {open && (
              <div className="animate-in fade-in slide-in-from-top-4 absolute right-0 z-50 mt-4 w-64 overflow-hidden rounded-4xl border border-slate-100 bg-white py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] duration-200">
                <div className="mb-2 border-b border-slate-50 px-6 py-4">
                  <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
                    Tài khoản của bạn
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 text-lg">
                      {user?.avatar ? (
                        <img src={user.avatar} className="h-full w-full object-cover" alt="" />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-black text-slate-900">
                        {getDisplayName(user)}
                      </p>
                      <p className="truncate text-[11px] font-medium text-slate-400">
                        {user?.email || 'admin@system.com'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 px-2">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-4 rounded-[1.25rem] bg-primary/5 px-4 py-3 text-sm font-black text-primary transition-all hover:bg-primary/10"
                  >
                    <span className="material-symbols-outlined text-xl">
                      rocket_launch
                    </span>
                    Về trang User
                  </button>
                </div>

                <div className="mt-2 border-t border-slate-50 px-2 pt-2">
                  <button
                    onClick={() => {
                      setIsLogoutModalOpen(true);
                      setOpen(false);
                    }}
                    className="group flex w-full items-center gap-4 rounded-[1.25rem] px-4 py-3 text-sm font-black text-red-500 transition-all hover:bg-red-50"
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

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-md duration-300">
          <div
            className="absolute inset-0"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-sm overflow-hidden rounded-[3rem] border border-white bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] duration-300">
            <div className="h-3 w-full bg-red-500"></div> 
            
            <div className="p-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-4xl shadow-inner shadow-red-100">
                👋
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Đăng xuất?
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị không?
              </p>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 active:scale-95"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-2xl bg-red-500 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-red-500/30 transition-all hover:bg-red-600 active:scale-95"
                >
                  Xác nhận
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