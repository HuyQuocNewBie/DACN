const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-between border-t border-slate-100 bg-white/50 px-8 py-8 backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase transition-colors duration-300 dark:text-slate-500">
        © {currentYear}{' '}
        <span className="text-slate-900 transition-colors duration-300 dark:text-slate-200">
          Memo.Space
        </span>{' '}
        — Hệ thống học tập thông minh
      </p>

      <div className="flex gap-4">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 transition-colors duration-300 dark:bg-slate-800"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 transition-colors duration-300 dark:bg-slate-800"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 transition-colors duration-300 dark:bg-slate-800"></div>
      </div>
    </footer>
  );
};

export default Footer;
