import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/admin/Sidebar';
import Header from '../components/layout/admin/Header';
import Footer from '../components/layout/admin/Footer';

const AdminLayout = () => {
  const navigate = useNavigate();
  // State quản lý việc thu/phóng sidebar
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
    <div className="bg-slate-50 min-h-screen flex">
      <Sidebar 
        menuItems={menuItems} 
        handleLogout={handleLogout} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-24'}`}>
        <Header handleLogout={handleLogout} />

        <div className="flex-1 p-8">
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