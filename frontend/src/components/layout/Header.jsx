import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const getDisplayName = (user) => user?.username || user?.fullname || user?.name || 'Học viên';

const Header = ({ title = "Bảng điều khiển" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
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

  const handleLogout = () => {
    const fullName = getDisplayName(user);
    
    logout();
    setOpen(false);
    
    toast.success(`Hẹn gặp lại, ${fullName}! 👋`);

    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-40 h-20 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-slate-100 transition-all duration-300">

      <div className="flex items-center gap-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all group active:scale-95">
          <span className="material-symbols-outlined text-[24px] leading-none">
            notifications
          </span>
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full group-hover:animate-ping"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 group focus:outline-none bg-slate-50 p-1.5 pr-4 rounded-[1.25rem] hover:bg-slate-100 transition-all active:scale-95"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm overflow-hidden shadow-lg shadow-slate-200 group-hover:bg-primary group-hover:shadow-primary/30 transition-all">
              {getDisplayName(user).charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-slate-900 leading-none">
                {getDisplayName(user).split(' ').pop()}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Học viên</p>
            </div>
            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 py-3 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="px-6 py-4 border-b border-slate-50 mb-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
                  Tài khoản của bạn
                </p>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-lg">👤</div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black text-slate-900 truncate">
                            {getDisplayName(user)}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
              </div>

              <div className="px-2 space-y-1">
                <button
                  onClick={() => { navigate('/profile'); setOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-[1.25rem] text-sm font-bold text-slate-600 hover:text-primary transition-all group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
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
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-[1.25rem] text-sm font-black transition-all ${
                      isAdminPath
                        ? 'text-primary bg-primary/5 hover:bg-primary/10'
                        : 'text-orange-500 bg-orange-50/50 hover:bg-orange-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isAdminPath ? 'rocket_launch' : 'admin_panel_settings'}
                    </span>
                    {isAdminPath ? 'Chế độ Người dùng' : 'Bảng Quản trị'}
                  </button>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-50 px-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 text-sm font-black text-red-500 rounded-[1.25rem] transition-all group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">
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
  );
};

export default Header;