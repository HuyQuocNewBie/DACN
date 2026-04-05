import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

// Import CSS đã được cấu hình Tailwind v4
import './index.css';

function App() {
  return (
    <Router>
      {/* Sử dụng font-body và bg-surface để đảm bảo 
        toàn app đồng nhất với thiết kế Material 3 
      */}
      <div className="min-h-screen bg-surface text-on-surface font-body">
        
        {/* Cấu hình lại Toaster để hợp với tone màu xanh dương/xanh lá của bạn */}
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'font-medium text-sm rounded-2xl border border-outline-variant shadow-xl bg-surface-container-lowest text-on-surface',
            duration: 3000,
            success: {
              iconTheme: {
                primary: '#006c49', // Màu secondary xanh lá chuẩn
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ba1a1a', // Màu error chuẩn Material
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Quản lý điều hướng chính của ứng dụng */}
        <AppRoutes />
        
      </div>
    </Router>
  );
}

export default App;