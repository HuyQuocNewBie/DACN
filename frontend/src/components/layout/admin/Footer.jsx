const Footer = () => {
  return (
    <footer className="border-t border-slate-100 py-8 px-8 flex justify-between items-center bg-white/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/50 backdrop-blur-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors duration-300 dark:text-slate-600">
        © {new Date().getFullYear()} <span className="text-slate-500 transition-colors duration-300 dark:text-slate-400">Focused Admin Console</span>
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