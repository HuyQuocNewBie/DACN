import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Sử dụng Hook đã tạo

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Hiển thị trạng thái chờ trong khi kiểm tra Token (ngăn chặn việc bị đá văng ra Login khi F5 trang)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Nếu có user thì cho vào (Outlet), không thì về trang Login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;