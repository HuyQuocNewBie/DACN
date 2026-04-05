import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-40 h-16 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 border-b border-outline-variant">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h2 className="font-headline font-semibold tracking-tight text-xl text-on-surface">
          {title}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🔍 Search (giống UI mẫu) */}
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant focus-within:border-primary transition-colors group">
          <span className="material-symbols-outlined text-outline group-focus-within:text-primary text-xl">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm text-on-surface-variant w-48 ml-2"
            placeholder="Tìm kiếm bộ thẻ..."
            type="text"
          />
        </div>

        {/* 🔔 Notification */}
        <button className="relative p-2 rounded-full hover:bg-surface-container-low transition">
          <span className="material-symbols-outlined text-on-surface-variant">
            notifications
          </span>

          {/* Dot đỏ */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* 👤 Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center focus:outline-none"
          >
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm overflow-hidden">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 py-2 overflow-hidden">

              {/* Info */}
              <div className="px-4 py-3 border-b border-outline-variant/30">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">
                  Tài khoản
                </p>
                <p className="text-sm font-bold text-on-surface truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-outline truncate">
                  {user?.email}
                </p>
              </div>

              {/* Menu */}
              <div className="p-1">
                <button
                  onClick={() => { navigate('/profile'); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low rounded-xl text-sm text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-lg">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold ${
                      isAdminPath
                        ? 'text-primary hover:bg-primary-fixed'
                        : 'text-tertiary hover:bg-tertiary-container/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isAdminPath ? 'rocket_launch' : 'shield_person'}
                    </span>
                    {isAdminPath ? 'User' : 'Admin'}
                  </button>
                )}
              </div>

              {/* Logout */}
              <div className="border-t border-outline-variant/30 mt-1 p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-error-container/20 text-sm text-error rounded-xl"
                >
                  <span className="material-symbols-outlined text-lg">
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