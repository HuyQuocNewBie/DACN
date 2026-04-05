import { Outlet, useLocation, Link } from 'react-router-dom';
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex flex-col font-['Inter'] relative overflow-hidden">
      
      <main className="grow flex items-center justify-center p-6 relative">
        
        {/* Background blur */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-[#006c49]/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md z-10">
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)]">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#191c1d] tracking-tight mb-2 font-['Manrope']">
                {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
              </h2>
              <p className="text-[#424754] text-sm">
                Hệ thống học tập thông minh.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[#f3f4f5] rounded-lg mb-8">
              <Link 
                to="/login"
                className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-md transition-all ${
                  isLogin 
                    ? 'bg-white text-[#0058be] shadow-sm' 
                    : 'text-[#424754] hover:text-[#191c1d]'
                }`}
              >
                Đăng nhập
              </Link>
              <Link 
                to="/register"
                className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-md transition-all ${
                  !isLogin 
                    ? 'bg-white text-[#0058be] shadow-sm' 
                    : 'text-[#424754] hover:text-[#191c1d]'
                }`}
              >
                Đăng ký
              </Link>
            </div>

            {/* Form */}
            <Outlet />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c2c6d6]/30"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="px-4 bg-white text-[#727785]">
                  Hoặc dùng mạng xã hội
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Google */}
              <button className="flex items-center justify-center gap-2 py-3 bg-[#f8f9fa] border border-[#c2c6d6]/20 rounded-lg hover:bg-[#edeeef] hover:scale-[1.02] active:scale-[0.98] transition-all">
                <FcGoogle className="text-xl" />
                <span className="text-sm font-semibold">Google</span>
              </button>

              {/* Facebook */}
              <button className="flex items-center justify-center gap-2 py-3 bg-[#f8f9fa] border border-[#c2c6d6]/20 rounded-lg hover:bg-[#edeeef] hover:scale-[1.02] active:scale-[0.98] transition-all">
                
                {/* Logo chuẩn Facebook */}
                <div className="w-6 h-6 flex items-center justify-center bg-[#1877F2] rounded-full">
                  <FaFacebookF className="text-white text-xs" />
                </div>

                <span className="text-sm font-semibold">Facebook</span>
              </button>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-center gap-4 text-xs text-[#727785]">
            <a href="#" className="hover:text-[#191c1d]">Điều khoản</a>
            <span>•</span>
            <a href="#" className="hover:text-[#191c1d]">Bảo mật</a>
            <span>•</span>
            <a href="#" className="hover:text-[#191c1d]">Trợ giúp</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;