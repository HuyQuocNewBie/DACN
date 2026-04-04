import { Outlet } from 'react-router-dom';
// Sau này bạn sẽ import Navbar và Sidebar vào đây

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b p-4 shadow-sm">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl text-primary">Spaced Repetition</h1>
          {/* Tạm thời để menu đơn giản */}
          <div className="space-x-4">
            <span className="text-sm text-slate-600">Menu</span>
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-slate-50">
        <div className="max-w-7xl mx-auto py-6">
          {/* Outlet là nơi các trang con như Dashboard, DeckList sẽ hiển thị */}
          <Outlet />
        </div>
      </main>

      <footer className="p-4 text-center text-slate-400 text-xs border-t">
        © 2026 Đồ án chuyên ngành - Nhóm 11
      </footer>
    </div>
  );
};

export default MainLayout;