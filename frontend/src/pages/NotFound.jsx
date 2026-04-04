import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <h1 className="text-9xl font-bold text-primary/20">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4">Không tìm thấy trang</h2>
      <p className="text-slate-500 mt-2">Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.</p>
      <Link 
        to="/" 
        className="mt-6 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Quay lại bảng điều khiển
      </Link>
    </div>
  );
};

export default NotFound;