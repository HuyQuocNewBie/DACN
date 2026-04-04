import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Chào mừng!</h2>
          <p className="text-slate-500 mt-2">Học tập hiệu quả hơn mỗi ngày</p>
        </div>
        
        {/* Nơi hiển thị Form Login hoặc Register */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;