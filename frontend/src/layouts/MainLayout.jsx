import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  const location = useLocation();

  // Mapping title theo route (xịn hơn hardcode)
  const getTitle = () => {
    if (location.pathname === "/") return "Tiến độ học tập";
    if (location.pathname.startsWith("/decks")) return "Bộ thẻ";
    if (location.pathname.startsWith("/review")) return "Ôn tập";
    if (location.pathname.startsWith("/profile")) return "Trang cá nhân";
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Header */}
        <Header title={getTitle()} />

        {/* Page Content */}
        <main className="flex-1 pt-16 px-6 md:px-8">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;