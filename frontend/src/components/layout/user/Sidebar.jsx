import { Link, useLocation, useNavigate } from 'react-router-dom';
import userApi from '../../../api/user.api';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleReviewClick = async (e) => {
    e.preventDefault();
    try {
      const data = await userApi.getStatistics();
      if (data.due_deck_id) {
        navigate(`/review/${data.due_deck_id}`);
      } else {
        toast.error('Không có bộ thẻ nào cần ôn tập');
      }
    } catch {
      toast.error('Lỗi khi tải dữ liệu');
    }
  };

  const menuItems = [
    { icon: 'grid_view', label: 'Dashboard', path: '/dashboard' },
    { icon: 'explore', label: 'Khám phá', path: '/explore' },
    { icon: 'layers', label: 'Bộ thẻ của tôi', path: '/decks' },
    { 
      icon: 'auto_stories', 
      label: 'Ôn tập', 
      path: '/review',
      onClick: handleReviewClick  // Thêm handler
    },
    { icon: 'account_circle', label: 'Cá nhân', path: '/profile' },
  ];

  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-screen w-64 bg-white border-r border-slate-100 flex-col p-6 md:flex transition-all duration-300">
      
      <div className="mb-10 flex items-center justify-center px-2 py-4 bg-slate-50 rounded-4xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Link to="/dashboard" className="flex items-center relative z-10">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          Menu chính
        </p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={item.onClick}  // Thêm onClick
              className={`group flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 relative ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"></span>
              )}

              <span
                className={`material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary' : 'opacity-70'
                }`}
              >
                {item.icon}
              </span>
              
              <span className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.label}
              </span>

              {!isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-50">
        <div className="bg-primary/5 rounded-4xl p-5 border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-primary/10 text-6xl font-black rotate-12 group-hover:rotate-0 transition-transform duration-500 italic">
                !
            </div>
            
            <p className="relative z-10 text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                Quick Action
            </p>
            
            <button
              onClick={handleReviewClick}
              className="relative z-10 flex items-center justify-center gap-2 bg-slate-900 hover:bg-primary text-white w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-slate-200 hover:shadow-primary/30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              Bắt đầu học
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;