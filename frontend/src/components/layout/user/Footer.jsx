const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white/50 px-8 py-8 backdrop-blur-sm transition-colors duration-300 md:flex-row dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center gap-3">
        <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"></div>
        <p className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase transition-colors duration-300 dark:text-slate-500">
          © {currentYear}{' '}
          <span className="text-slate-900 transition-colors duration-300 dark:text-slate-200">
            Memo.Space
          </span>{' '}
          — Hệ thống học tập thông minh
        </p>
      </div>

      <div className="flex items-center gap-8">
        {[
          { label: 'Facebook', path: 'https://web.facebook.com/adminpro21223' },
          { label: 'GitHub', path: 'https://github.com/HuyQuocNewBie/DACN' },
          { label: 'Zalo', path: 'https://zalo.me/0817095875' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.path}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary dark:hover:text-primary text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all duration-300 hover:-translate-y-px dark:text-slate-500"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
