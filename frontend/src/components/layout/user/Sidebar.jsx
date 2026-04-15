import { Link, useLocation, useNavigate } from 'react-router-dom';
import userApi from '../../../api/user.api';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logic xử lý khi nhấn vào Ôn tập hoặc Quick Action
  const handleReviewClick = async (e) => {
    if (e) e.preventDefault();
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
      onClick: handleReviewClick,
    },
    { icon: 'account_circle', label: 'Cá nhân', path: '/profile' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 hidden h-screen flex-col border-r border-slate-100 bg-white py-6 transition-all duration-300 md:flex ${isOpen ? 'w-64 px-6' : 'w-24 px-4'}`}
    >
      {/* Nút Toggle Sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all hover:bg-slate-900 hover:text-white"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* Logo Section */}
      <div
        className={`group relative mb-10 flex items-center justify-center overflow-hidden rounded-4xl bg-slate-50 py-4 transition-all duration-300 ${isOpen ? 'px-2' : 'px-0'}`}
      >
        <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <Link to="/dashboard" className="relative z-10 flex items-center">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className={`object-contain transition-all duration-300 ${isOpen ? 'h-10 w-auto hover:scale-110' : 'h-8 w-8'}`}
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <p
          className={`mb-4 text-[10px] font-black tracking-[0.2em] whitespace-nowrap text-slate-400 uppercase transition-all duration-300 ${isOpen ? 'px-4 opacity-100' : 'mb-0 h-0 text-center opacity-0'}`}
        >
          Menu chính
        </p>

        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={item.onClick}
              title={!isOpen ? item.label : ''}
              className={`group relative flex items-center rounded-2xl py-3.5 transition-all duration-300 ${
                isOpen ? 'gap-4 px-5' : 'justify-center px-0'
              } ${
                isActive
                  ? 'translate-x-2 bg-slate-900 text-white shadow-xl shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="bg-primary absolute left-0 h-6 w-1 rounded-r-full"></span>
              )}

              <span
                className={`material-symbols-outlined shrink-0 text-[22px] transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary' : 'opacity-70'
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`text-sm tracking-tight whitespace-nowrap transition-all duration-300 ${isActive ? 'font-black' : 'font-bold'} ${isOpen ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0'}`}
              >
                {item.label}
              </span>

              {!isActive && isOpen && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-slate-200 opacity-0 transition-opacity group-hover:opacity-100"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Action Section */}
      <div className="mt-auto border-t border-slate-50 pt-6">
        <div
          className={`bg-primary/5 border-primary/10 group relative overflow-hidden rounded-4xl border transition-all duration-300 ${isOpen ? 'p-5' : 'p-3'}`}
        >
          {isOpen && (
            <div className="text-primary/10 absolute -right-4 -bottom-4 rotate-12 text-6xl font-black italic transition-transform duration-500 group-hover:rotate-0">
              !
            </div>
          )}

          <p
            className={`text-primary relative z-10 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all duration-300 ${isOpen ? 'mb-3 opacity-100' : 'mb-0 h-0 overflow-hidden opacity-0'}`}
          >
            Quick Action
          </p>

          <button
            onClick={handleReviewClick}
            title={!isOpen ? 'Bắt đầu học' : ''}
            className={`hover:bg-primary hover:shadow-primary/30 relative z-10 flex w-full items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 transition-all active:scale-95 ${isOpen ? 'gap-2 py-3.5' : 'py-3'}`}
          >
            <span className="material-symbols-outlined shrink-0 text-sm">
              bolt
            </span>
            <span
              className={`text-xs font-black tracking-[0.15em] whitespace-nowrap uppercase transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0'}`}
            >
              Bắt đầu học
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
