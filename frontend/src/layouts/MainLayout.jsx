import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === '/') return 'Tiến độ học tập';
    if (location.pathname.startsWith('/decks')) return 'Bộ thẻ';
    if (location.pathname.startsWith('/review')) return 'Ôn tập';
    if (location.pathname.startsWith('/profile')) return 'Trang cá nhân';
    if (location.pathname.startsWith('/explore')) return 'Khám phá';
    return 'Dashboard';
  };

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col md:ml-64 transition-all duration-300">
        <Header title={getTitle()} />

        <main className="flex-1 p-8 mt-20">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;