import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

import './index.css';

function App() {
  return (
    <Router>
      {/* Thêm transition-colors duration-300 để hiệu ứng chuyển mode mượt mà.
        Thêm dark:bg-slate-950 dark:text-slate-50 để dự phòng nếu bg-surface chưa cấu hình màu tối 
      */}
      <div className="min-h-screen bg-surface text-on-surface font-body transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
        
        <Toaster
          position="top-center"
          toastOptions={{
            // Thêm transition và các class dark mode cho Toaster để thông báo cũng đổi màu
            className: 'font-medium text-sm rounded-2xl border border-outline-variant shadow-xl bg-surface-container-lowest text-on-surface transition-colors duration-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white',
            duration: 3000,
            success: {
              iconTheme: {
                primary: '#006c49', 
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ba1a1a', 
                secondary: '#fff',
              },
            },
          }}
        />

        <AppRoutes />
        
      </div>
    </Router>
  );
}

export default App;