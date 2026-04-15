import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { icon: 'grid_view', label: 'Dashboard', path: '/dashboard' },
    { icon: 'explore', label: 'Khám phá', path: '/explore' },
    { icon: 'layers', label: 'Bộ thẻ của tôi', path: '/decks' },
    { icon: 'auto_stories', label: 'Ôn tập', path: '/review' },
    { icon: 'account_circle', label: 'Cá nhân', path: '/profile' },
  ];

  return (
    <aside className={`fixed top-0 left-0 z-50 hidden h-screen bg-white border-r border-slate-100 flex-col py-6 md:flex transition-all duration-300 ${isOpen ? 'w-64 px-6' : 'w-24 px-4'}`}>
      
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white transition-all z-50 shadow-md"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      <div className={`mb-10 flex items-center justify-center py-4 bg-slate-50 rounded-4xl relative overflow-hidden group transition-all duration-300 ${isOpen ? 'px-2' : 'px-0'}`}>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Link to="/dashboard" className="flex items-center relative z-10">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className={`object-contain transition-all duration-300 ${isOpen ? 'h-10 w-auto hover:scale-110' : 'h-8 w-8'}`}
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <p className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 whitespace-nowrap transition-all duration-300 ${isOpen ? 'px-4 opacity-100' : 'text-center opacity-0 h-0 mb-0'}`}>
          Menu chính
        </p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : ''}
              className={`group flex items-center rounded-2xl py-3.5 transition-all duration-300 relative ${
                isOpen ? 'gap-4 px-5' : 'justify-center px-0'
              } ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"></span>
              )}

              <span
                className={`material-symbols-outlined text-[22px] shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary' : 'opacity-70'
                }`}
              >
                {item.icon}
              </span>
              
              <span className={`text-sm tracking-tight whitespace-nowrap transition-all duration-300 ${isActive ? 'font-black' : 'font-bold'} ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>

              {!isActive && isOpen && (
                <span className="ml-auto w-1.5 h-1.5 shrink-0 rounded-full bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-50">
        <div className={`bg-primary/5 rounded-4xl border border-primary/10 relative overflow-hidden group transition-all duration-300 ${isOpen ? 'p-5' : 'p-3'}`}>
            
            {isOpen && (
              <div className="absolute -right-4 -bottom-4 text-primary/10 text-6xl font-black rotate-12 group-hover:rotate-0 transition-transform duration-500 italic">
                  !
              </div>
            )}
            
            <p className={`relative z-10 text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${isOpen ? 'mb-3 opacity-100' : 'h-0 opacity-0 mb-0 overflow-hidden'}`}>
                Quick Action
            </p>
            
            <Link
              to="/review"
              title={!isOpen ? 'Bắt đầu học' : ''}
              className={`relative z-10 flex items-center justify-center bg-slate-900 hover:bg-primary text-white w-full rounded-xl shadow-lg shadow-slate-200 hover:shadow-primary/30 transition-all active:scale-95 ${isOpen ? 'gap-2 py-3.5' : 'py-3'}`}
            >
              <span className="material-symbols-outlined text-sm shrink-0">bolt</span>
              <span className={`text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                Bắt đầu học
              </span>
            </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;