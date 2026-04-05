import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: 'home', label: 'Dashboard', path: '/dashboard' },
    { icon: 'style', label: 'Bộ thẻ', path: '/decks' },
    { icon: 'psychology', label: 'Ôn tập', path: '/review' },
    { icon: 'person', label: 'Cá nhân', path: '/profile' },
  ];

  return (
    <aside className="bg-surface-container-lowest border-outline-variant fixed top-0 left-0 z-50 hidden h-screen w-64 flex-col space-y-2 border-r p-4 md:flex">
      {/* LOGO */}
      <div className="mb-6 flex items-center justify-start px-2">
        <Link to="/dashboard" className="flex items-center">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-primary-fixed text-on-primary-fixed-variant translate-x-1 font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}
              >
                {item.icon}
              </span>
              <span className="font-label text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* BUTTON */}
      <div className="border-outline-variant mt-auto border-t pt-4">
        <Link
          to="/review"
          className="bg-primary hover:bg-primary-container shadow-primary/20 block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-md transition-transform active:scale-95"
        >
          Bắt đầu học
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
