import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems, handleLogout, isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed z-50 hidden h-screen flex-col py-6 transition-all duration-300 md:flex
      bg-slate-900 text-white
      dark:bg-slate-900 dark:text-white
      border-r border-transparent dark:border-slate-800
      ${isOpen ? 'w-64 px-6' : 'w-24 px-4'}`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg transition-all
        border-slate-700 bg-slate-800 text-white
        dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
        hover:bg-primary hover:border-primary hover:text-white"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* Logo */}
      <div
        className={`group relative mb-10 flex items-center justify-center overflow-hidden rounded-4xl py-4 transition-colors duration-300
        bg-white/5 border border-white/10
        dark:bg-slate-800/50 dark:border-slate-800
        ${isOpen ? 'px-2' : 'px-0'}`}
      >
        <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-primary/10"></div>

        <Link to="/admin" className="relative z-10 flex items-center">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              isOpen ? 'h-10 w-auto hover:scale-110' : 'h-8 w-8'
            }`}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p
          className={`mb-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300
          text-slate-500 dark:text-slate-500
          ${isOpen ? 'px-4 opacity-100' : 'mb-0 h-0 text-center opacity-0'}`}
        >
          Quản trị hệ thống
        </p>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : ''}
              className={`group flex items-center rounded-2xl py-4 transition-all duration-300
              ${isOpen ? 'gap-4 px-5' : 'justify-center px-0'}
              ${
                isActive
                  ? 'translate-x-2 bg-primary text-white shadow-xl shadow-primary/20 dark:bg-primary/20 dark:text-primary dark:shadow-none'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span
                className={`material-symbols-outlined shrink-0 text-[22px] transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'group-hover:text-primary'
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`text-sm tracking-tight whitespace-nowrap transition-all duration-300
                ${isActive ? 'font-black' : 'font-bold'}
                ${isOpen ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-3 border-t pt-6 border-white/5 dark:border-slate-800">
        <Link
          to="/dashboard"
          title={!isOpen ? 'Trang User' : ''}
          className={`flex w-full items-center rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all
          bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white
          dark:bg-white/5 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white
          ${isOpen ? 'justify-center gap-2' : 'justify-center'}`}
        >
          <span className="material-symbols-outlined shrink-0 text-sm">
            home
          </span>
          {isOpen && <span className="whitespace-nowrap">Trang User</span>}
        </Link>

        <button
          onClick={handleLogout}
          title={!isOpen ? 'Đăng xuất' : ''}
          className={`flex w-full items-center rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all
          bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white
          ${isOpen ? 'justify-center gap-2' : 'justify-center'}`}
        >
          <span className="material-symbols-outlined shrink-0 text-sm">
            logout
          </span>
          {isOpen && <span className="whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;