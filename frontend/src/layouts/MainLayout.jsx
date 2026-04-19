import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/user/Sidebar';
import Header from '../components/layout/user/Header';
import Footer from '../components/layout/user/Footer';

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getTitle = () => {
    if (location.pathname === '/') return 'Tiến độ học tập';
    if (location.pathname.startsWith('/decks')) return 'Bộ thẻ';
    if (location.pathname.startsWith('/review')) return 'Ôn tập';
    if (location.pathname.startsWith('/profile')) return 'Trang cá nhân';
    if (location.pathname.startsWith('/explore')) return 'Khám phá';
    return 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-24'}`}>
        
        <Header title={getTitle()} isSidebarOpen={isSidebarOpen} />

        <main className="mt-20 flex-1 p-8">
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