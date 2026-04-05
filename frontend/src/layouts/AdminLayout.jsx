import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
const isAdminPath = location.pathname.startsWith('/admin');

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: 'dashboard' },
    { path: '/admin/users', label: 'Người dùng', icon: 'group' },
    { path: '/admin/decks', label: 'Bộ thẻ', icon: 'style' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Đã đăng xuất');
    navigate('/login');
  };

  // 🔥 Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-surface text-on-surface flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="fixed z-40 hidden h-screen w-64 flex-col bg-slate-900 text-white shadow-xl md:flex">
        {/* LOGO */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-sm text-white">
              admin_panel_settings
            </span>
          </div>
          <div>
            <p className="text-sm font-bold">Admin Panel</p>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase">
              Focused Scholar
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex min-h-screen flex-1 flex-col md:ml-64">
        {/* PROGRESS BAR */}
        <div className="bg-primary sticky top-0 z-50 h-0.5 w-full shadow-[0_0_6px_rgba(0,88,190,0.4)]"></div>

        {/* HEADER */}
        <header className="bg-surface/80 border-outline-variant sticky top-0.5 z-40 flex h-16 items-center justify-between border-b px-8 backdrop-blur-xl">
          {/* LEFT */}
          <div>
            <p className="text-on-surface-variant text-xs font-medium">Admin</p>
            <h2 className="text-sm font-bold capitalize">
              {location.pathname.split('/').pop() || 'Tổng quan'}
            </h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="hover:bg-surface-container rounded-lg p-2 transition">
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
            </button>

            {/* Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm leading-tight font-bold">
                    Quản trị viên
                  </p>
                  <p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                    Online
                  </p>
                </div>

                <div className="bg-surface-container-high flex h-9 w-9 items-center justify-center rounded-full font-bold shadow-sm">
                  AD
                </div>
              </button>

              {open && (
                <div className="bg-surface-container-lowest border-outline-variant absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border py-2 shadow-xl">
                  {/* Info */}
                  <div className="border-outline-variant/30 border-b px-4 py-3">
                    <p className="text-outline mb-1 text-[10px] font-bold tracking-widest uppercase">
                      Tài khoản
                    </p>
                    <p className="text-on-surface text-sm font-bold">
                      Quản trị viên
                    </p>
                    <p className="text-outline text-[11px]">admin@email.com</p>
                  </div>

                  {/* Menu */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${
                        isAdminPath
                          ? 'text-tertiary hover:bg-tertiary-container/10'
                          : 'text-primary hover:bg-primary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        home
                      </span>
                      User
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-outline-variant/30 mt-1 border-t p-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="hover:bg-error-container/20 text-error flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
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

        {/* CONTENT */}
        <div className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">
          <Outlet />
        </div>

        {/* FOOTER */}
        <footer className="border-outline-variant/50 text-on-surface-variant border-t py-3 text-center text-[11px]">
          © {new Date().getFullYear()} Focused Scholar Admin
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
