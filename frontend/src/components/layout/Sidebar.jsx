import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Bộ thẻ của tôi', path: '/decks', icon: '📁' },
    { name: 'Ôn tập', path: '/review', icon: '🔥' },
    { name: 'Cá nhân', path: '/profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 border-r bg-slate-50 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
      <div className="p-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;