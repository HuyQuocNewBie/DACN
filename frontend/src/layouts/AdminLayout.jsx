import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: 'grid_view' },
    { path: '/admin/users', label: 'Người dùng', icon: 'group' },
    { path: '/admin/decks', label: 'Bộ thẻ', icon: 'layers' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Hẹn gặp lại, Admin! 👋');
    navigate('/login');
  };

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
    <div className="bg-slate-50 min-h-screen flex">
      
      <aside className="fixed z-50 hidden h-screen w-64 flex-col bg-slate-900 text-white p-6 md:flex transition-all duration-300">
        
        <div className="mb-10 flex items-center gap-4 px-2 py-5 bg-white/5 rounded-4xl border border-white/10 relative overflow-hidden">
          <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20 relative z-10">
            <span className="material-symbols-outlined text-white text-2xl">
              admin_panel_settings
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-black tracking-tight leading-none">ADMIN PANEL</p>
            <p className="text-[10px] font-bold tracking-[0.2em] text-primary mt-1 uppercase">
              Memo.Space
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Quản trị hệ thống
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-white' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
          <Link
            to="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Trang User
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-white shadow-lg hover:shadow-red-500/20"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col md:ml-64 transition-all duration-300">
        
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Hệ thống</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">
              {location.pathname.split('/').pop() || 'Tổng quan'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary border-2 border-white rounded-full"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-slate-900 rounded-[1.25rem] text-white hover:bg-primary transition-all shadow-lg shadow-slate-200"
              >
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                  AD
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-tighter leading-none">Root Admin</p>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-4 w-60 overflow-hidden rounded-4xl bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tư cách</p>
                    <p className="text-sm font-black text-slate-900">Quản trị tối cao</p>
                  </div>
                  <div className="p-2">
                    <button 
                        onClick={() => { navigate('/dashboard'); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">person</span>
                      Về trang User
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Thoát hệ thống
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>

        <footer className="border-t border-slate-100 py-8 px-8 flex justify-between items-center bg-white/50">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} <span className="text-slate-500">Focused Admin Console</span>
            </p>
            <div className="flex gap-4">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;