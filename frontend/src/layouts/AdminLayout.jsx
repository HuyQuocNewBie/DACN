import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/admin/Sidebar';
import Header from '../components/layout/admin/Header';
import Footer from '../components/layout/admin/Footer';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: 'grid_view' },
    { path: '/admin/users', label: 'Người dùng', icon: 'group' },
    { path: '/admin/decks', label: 'Bộ thẻ', icon: 'layers' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Hẹn gặp lại, Admin! 👋');
    navigate('/login');
  };

  return (
    /* Thêm transition-colors và dark:bg-slate-950 ở đây */
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Sidebar 
        menuItems={menuItems} 
        handleLogout={handleLogout} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content area */}
      <main className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-24'}`}>
        <Header handleLogout={handleLogout} />

        {/* Nền của phần content cũng cần được xử lý màu sắc khi dark mode */}
        <div className="flex-1 p-8 transition-colors duration-300">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;