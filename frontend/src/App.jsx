import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

// Import Tailwind CSS
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-slate-900">
        {/* Toaster: hiển thị thông báo toàn app */}
        <Toaster
          position="top-center"
          toastOptions={{
            // Style chung cho tất cả toast
            className: 'font-medium text-sm',
            success: {
              iconTheme: {
                primary: '#10b981', // Màu secondary (emerald) của bạn
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Routes */}
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
