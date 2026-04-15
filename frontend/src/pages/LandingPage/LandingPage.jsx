import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FaFacebookF, FaArrowUp } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Login from '../Auth/Login';
import Register from '../Auth/Register';

const NavLink = ({ children, href }) => (
  <a
    href={href}
    className="hover:text-primary group relative text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-all"
  >
    {children}
    <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
  </a>
);

const FeatureCard = ({ title, icon, desc }) => (
  <div className="group hover:shadow-primary/5 relative overflow-hidden rounded-4xl border border-slate-100 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
    <div className="text-primary/5 pointer-events-none absolute -top-4 -right-4 text-8xl font-black transition-transform duration-500 group-hover:rotate-12">
      {icon}
    </div>
    <div className="group-hover:bg-primary/10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl transition-colors">
      {icon}
    </div>
    <h4 className="mb-4 text-xl font-black tracking-tight text-slate-900">
      {title}
    </h4>
    <p className="text-sm leading-relaxed font-medium text-slate-500">{desc}</p>
  </div>
);

const StepCard = ({ step, title, desc, icon }) => (
  <div className="group relative rounded-4xl border border-slate-100 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
    <div className="absolute -top-6 -right-2 z-0 text-8xl font-black text-slate-50 transition-colors duration-500 group-hover:text-slate-100">
      {step}
    </div>
    <div className="relative z-10">
      <div className="group-hover:bg-primary/10 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl transition-colors">
        {icon}
      </div>
      <h4 className="mb-3 text-xl font-black text-slate-900">{title}</h4>
      <p className="text-sm leading-relaxed font-medium text-slate-500">
        {desc}
      </p>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, quote, avatar }) => (
  <div className="group rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
    <div className="mb-6 flex gap-1 text-sm text-orange-400">★★★★★</div>
    <p className="mb-8 leading-relaxed font-medium text-slate-600">"{quote}"</p>
    <div className="flex items-center gap-4">
      <img
        src={avatar}
        alt={name}
        className="h-12 w-12 rounded-full border-2 border-slate-50 object-cover"
      />
      <div>
        <h5 className="font-black text-slate-900">{name}</h5>
        <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          {role}
        </p>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const [authMode, setAuthMode] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const closeAuth = useCallback(() => setAuthMode(null), []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hàm xử lý cuộn lên đầu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const navItems = useMemo(
    () => [
      { name: 'Tính năng', href: '#tinh-nang' },
      { name: 'Quy trình', href: '#quy-trinh' },
      { name: 'Cộng đồng', href: '#cong-dong' },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        title: 'Quản lý bộ thẻ',
        icon: '📚',
        desc: 'Tổ chức kho kiến thức theo từng chủ đề với giao diện trực quan và khoa học.',
      },
      {
        title: 'Thuật toán SM-2',
        icon: '🎯',
        desc: 'Tối ưu hóa việc ghi nhớ bằng cách lặp lại kiến thức vào thời điểm vàng.',
      },
      {
        title: 'Thống kê chi tiết',
        icon: '📈',
        desc: 'Theo dõi biểu đồ tiến bộ hàng ngày để duy trì động lực học tập bền bỉ.',
      },
    ],
    []
  );

  return (
    <div className="selection:bg-primary/20 selection:text-primary min-h-screen bg-[#FDFDFF] text-slate-900">
      <nav className="fixed inset-x-0 top-0 z-50 flex h-24 items-center justify-between border-b border-slate-50 bg-white/70 px-8 backdrop-blur-2xl md:px-12">
        <div className="group flex cursor-pointer items-center gap-3">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="hidden items-center gap-12 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.name} href={item.href}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setAuthMode('login')}
            className="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-900"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className="hover:bg-primary hover:shadow-primary/30 rounded-2xl bg-slate-900 px-8 py-3.5 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Bắt đầu ngay
          </button>
        </div>
      </nav>

      <main className="pt-24">
        <section className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-20 lg:grid-cols-12 lg:py-32">
          <div className="animate-in fade-in slide-in-from-left space-y-10 duration-1000 lg:col-span-7">
            <div className="bg-primary/5 inline-flex items-center gap-3 rounded-full px-5 py-2">
              <span className="bg-primary flex h-2 w-2 animate-ping rounded-full"></span>
              <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                Phương pháp học tập 4.0
              </span>
            </div>

            <h1 className="text-7xl leading-[0.85] font-black tracking-tight text-slate-900 md:text-8xl lg:text-9xl">
              Học ít hơn, <br />
              <span className="text-primary relative italic">
                Nhớ lâu hơn.
                <svg
                  className="text-primary/20 absolute -bottom-2 left-0 h-3 w-full"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 25 0 50 5 T 100 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                  />
                </svg>
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
              Ứng dụng khoa học não bộ{' '}
              <span className="font-bold text-slate-900">
                Spaced Repetition
              </span>{' '}
              để biến kiến thức ngắn hạn thành trí nhớ vĩnh cửu.
            </p>

            <div className="flex flex-col items-center gap-8 pt-6 sm:flex-row">
              <button
                onClick={() => setAuthMode('register')}
                className="bg-primary shadow-primary/40 w-full rounded-4xl px-12 py-6 text-xs font-black tracking-[0.2em] text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95 sm:w-auto"
              >
                Trải nghiệm miễn phí
              </button>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?u=${i + 10}`}
                      className="h-12 w-12 rounded-full border-4 border-white shadow-sm shadow-slate-200"
                      alt="user"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-black text-slate-900">
                    2,000+ Students
                  </p>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Joined this week
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in zoom-in relative delay-200 duration-1000 lg:col-span-5">
            <div className="bg-primary/5 absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"></div>

            <div className="group relative rotate-3 rounded-[3.5rem] border border-slate-50 bg-white p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:rotate-0">
              <div className="mb-16 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl group-hover:animate-bounce">
                  🧠
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                    <div className="bg-primary h-full w-2/3 animate-pulse"></div>
                  </div>
                  <div className="h-2 w-12 rounded-full bg-slate-50"></div>
                </div>
              </div>

              <div className="mb-12 space-y-6 text-center">
                <h3 className="text-3xl font-black tracking-tight text-slate-900">
                  Kỹ thuật SM-2
                </h3>
                <p className="font-medium text-slate-400 italic">
                  "Lặp lại ngắt quãng giúp não bộ tối ưu hóa việc lưu trữ thông
                  tin."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-orange-50 p-5 text-center text-orange-500">
                  <p className="text-[10px] font-black tracking-widest uppercase">
                    Khó quá
                  </p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-5 text-center text-emerald-500">
                  <p className="text-[10px] font-black tracking-widest uppercase">
                    Đã thuộc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tinh-nang" className="bg-slate-50/50 px-8 py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 space-y-4 text-center">
              <h2 className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">
                Tính năng cốt lõi
              </h2>
              <p className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Mọi thứ bạn cần để thông thái hơn
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} />
              ))}
            </div>
          </div>
        </section>

        <section id="quy-trinh" className="px-8 py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 space-y-4 text-center">
              <h2 className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">
                Quy trình học tập
              </h2>
              <p className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                3 bước để ghi nhớ vĩnh viễn
              </p>
            </div>

            <div className="relative grid gap-8 md:grid-cols-3">
              <div className="absolute top-1/2 left-0 -z-10 hidden h-0.5 w-full -translate-y-1/2 border-t-2 border-dashed border-slate-100 md:block"></div>

              <StepCard
                step="01"
                title="Tạo bộ thẻ"
                desc="Tự do sáng tạo flashcard của riêng bạn hoặc import hàng loạt từ Excel, Quizlet chỉ trong 1 nốt nhạc."
                icon="📝"
              />
              <StepCard
                step="02"
                title="Ôn tập thông minh"
                desc="Ứng dụng sẽ tự động tính toán 'điểm rơi quên lãng' để nhắc bạn ôn tập đúng lúc cần thiết nhất."
                icon="🔄"
              />
              <StepCard
                step="03"
                title="Làm chủ kiến thức"
                desc="Theo dõi biểu đồ tiến độ. Biến mọi thông tin ngắn hạn từ não bộ đi sâu vào vùng trí nhớ vĩnh cửu."
                icon="🏆"
              />
            </div>
          </div>
        </section>

        <section id="cong-dong" className="bg-slate-50/50 px-8 py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 space-y-4 text-center">
              <h2 className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">
                Cộng đồng học tập
              </h2>
              <p className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Hàng ngàn người đã thay đổi cách học
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <TestimonialCard
                name="Hải Đăng"
                role="Sinh viên Y Khoa"
                quote="Khối lượng kiến thức ngành Y khổng lồ khiến mình từng stress nặng. Từ khi dùng nền tảng này, mình ghi nhớ tên thuốc và giải phẫu nhẹ nhàng hơn hẳn."
                avatar="https://i.pravatar.cc/100?u=41"
              />
              <TestimonialCard
                name="Minh Anh"
                role="Chinh phục IELTS 8.0"
                quote="Thuật toán lặp lại ngắt quãng thực sự là cứu tinh cho việc học từ vựng tiếng Anh. Giao diện lại cực kỳ sạch sẽ và hiện đại, không bị rối mắt chút nào."
                avatar="https://i.pravatar.cc/100?u=22"
              />
              <TestimonialCard
                name="Hoàng Nam"
                role="Kỹ sư phần mềm"
                quote="Mình dùng app để ghi nhớ các design pattern và syntax của ngôn ngữ lập trình mới. Tốc độ nạp kiến thức hiệu quả hơn việc đọc tài liệu chay rất nhiều."
                avatar="https://i.pravatar.cc/100?u=33"
              />
            </div>
          </div>
        </section>

        <section className="px-8 py-32">
          <div className="group relative mx-auto max-w-6xl overflow-hidden rounded-[4rem] bg-slate-900 p-16 md:p-24">
            <div className="bg-primary/20 group-hover:bg-primary/30 absolute top-0 right-0 -mt-48 -mr-48 h-96 w-96 rounded-full blur-[120px] transition-all"></div>

            <div className="relative z-10 space-y-12 text-center">
              <h2 className="text-5xl leading-tight font-black tracking-tight text-white md:text-7xl">
                Sẵn sàng bứt phá <br />
                <span className="text-primary italic">giới hạn trí nhớ?</span>
              </h2>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <button
                  onClick={() => setAuthMode('register')}
                  className="bg-primary shadow-primary/20 rounded-2xl px-12 py-6 text-xs font-black tracking-[0.2em] text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Đăng ký miễn phí
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/10 px-12 py-6 text-xs font-black tracking-[0.2em] text-white uppercase backdrop-blur-md transition-all hover:bg-white/20">
                  Xem bản Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900 ${
          showScrollTop
            ? 'translate-y-0 opacity-50 hover:opacity-100'
            : 'pointer-events-none translate-y-5 opacity-0'
        }`}
        aria-label="Cuộn lên đầu trang"
      >
        <FaArrowUp className="text-lg" />
      </button>

      {authMode && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-xl duration-300">
          <div className="absolute inset-0" onClick={closeAuth} />

          <div className="animate-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-[3.5rem] border border-white bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] duration-500">
            <div className="bg-primary h-3 w-full"></div>

            <div className="p-10 md:p-14">
              <div className="mb-10 space-y-2 text-center">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">
                  {authMode === 'login' ? 'Chào trở lại!' : 'Chào bạn mới!'}
                </h2>
                <p className="font-medium text-slate-400">
                  Bắt đầu hành trình học tập cùng Memo.Space
                </p>
              </div>

              <div className="mb-10 flex rounded-2xl bg-slate-50 p-1.5">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400'
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              <div className="space-y-6">
                {authMode === 'login' ? (
                  <Login onSwitch={() => setAuthMode('register')} />
                ) : (
                  <Register onSwitch={() => setAuthMode('login')} />
                )}
              </div>

              <div className="relative flex items-center py-8">
                <div className="flex-1 border-t border-slate-100"></div>
                <span className="px-4 text-[10px] font-black tracking-widest text-slate-300 uppercase">
                  Hoặc đăng nhập qua
                </span>
                <div className="flex-1 border-t border-slate-100"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 py-4 text-sm font-bold transition-all hover:bg-slate-50">
                  <FcGoogle className="text-xl" /> Google
                </button>
                <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 py-4 text-sm font-bold transition-all hover:bg-slate-50">
                  <div className="rounded-md bg-[#1877F2] p-1 text-[10px] text-white">
                    <FaFacebookF />
                  </div>{' '}
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="space-y-8 border-t border-slate-50 bg-white py-20 text-center">
        <div className="group flex cursor-pointer items-center justify-center gap-2 opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        <div className="flex justify-center gap-10 text-[10px] font-black tracking-widest text-slate-400 uppercase">
          <a href="#" className="hover:text-primary transition-colors">
            Facebook
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>
        <p className="text-[10px] font-bold tracking-[0.4em] text-slate-200 uppercase">
          © 2026 Memo.Space — Hệ thống học tập thông minh
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
