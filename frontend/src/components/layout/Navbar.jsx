import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-primary">FlashCard App</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">{user?.name || 'Người dùng'}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <Button variant="outline" className="py-1 px-3 text-sm" onClick={logout}>
          Đăng xuất
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;