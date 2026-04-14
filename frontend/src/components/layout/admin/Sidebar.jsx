import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems, handleLogout }) => {
  const location = useLocation();

  return (
    <aside className="fixed z-50 hidden h-screen w-64 flex-col bg-slate-900 text-white p-6 md:flex transition-all duration-300">
      
      {/* KHỐI LOGO ĐƯỢC ĐỒNG BỘ GIỐNG BÊN USER */}
      <div className="mb-10 flex items-center justify-center px-2 py-4 bg-white/5 rounded-4xl border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Link to="/admin" className="flex items-center relative z-10">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
          />
        </Link>
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
  );
};

export default Sidebar;