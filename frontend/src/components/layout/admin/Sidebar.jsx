import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems, handleLogout, isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <aside className={`fixed z-50 hidden h-screen flex-col bg-slate-900 text-white py-6 md:flex transition-all duration-300 dark:bg-black dark:border-r dark:border-slate-800 ${isOpen ? 'w-64 px-6' : 'w-24 px-4'}`}>
      
      {/* Nút Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 text-white hover:bg-primary hover:border-primary transition-all z-50 shadow-lg dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-primary"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* Logo */}
      <div className={`mb-10 flex items-center justify-center py-4 bg-white/5 rounded-4xl border border-white/10 relative overflow-hidden group transition-colors duration-300 dark:bg-slate-900/50 dark:border-slate-800 ${isOpen ? 'px-2' : 'px-0'}`}>
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Link to="/admin" className="flex items-center relative z-10">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className={`object-contain transition-all duration-300 ${isOpen ? 'h-10 w-auto hover:scale-110' : 'h-8 w-8'}`}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className={`text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 whitespace-nowrap transition-all duration-300 dark:text-slate-500 ${isOpen ? 'px-4 opacity-100' : 'text-center opacity-0 h-0 mb-0'}`}>
          Quản trị hệ thống
        </p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : ''} 
              className={`group flex items-center rounded-2xl py-4 transition-all duration-300 ${
                isOpen ? 'gap-4 px-5' : 'justify-center px-0'
              } ${
                isActive
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] shrink-0 transition-colors ${isActive ? 'text-white' : 'group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className={`text-sm tracking-tight whitespace-nowrap transition-all duration-300 ${isActive ? 'font-black' : 'font-bold'} ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar (Actions) */}
      <div className="mt-auto space-y-3 pt-6 border-t border-white/5 transition-colors duration-300 dark:border-slate-800">
        <Link
          to="/dashboard"
          title={!isOpen ? 'Trang User' : ''}
          className={`flex w-full items-center rounded-xl bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all dark:hover:bg-slate-800 ${isOpen ? 'justify-center gap-2' : 'justify-center'}`}
        >
          <span className="material-symbols-outlined text-sm shrink-0">home</span>
          {isOpen && <span className="whitespace-nowrap">Trang User</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          title={!isOpen ? 'Đăng xuất' : ''}
          className={`flex w-full items-center rounded-xl bg-red-500/10 py-3 text-xs font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-white shadow-lg hover:shadow-red-500/20 ${isOpen ? 'justify-center gap-2' : 'justify-center'}`}
        >
          <span className="material-symbols-outlined text-sm shrink-0">logout</span>
          {isOpen && <span className="whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;