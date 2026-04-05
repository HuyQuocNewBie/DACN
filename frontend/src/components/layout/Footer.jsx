const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-outline-variant/30 bg-surface/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">

        {/* LEFT */}
        <p className="text-xs text-on-surface-variant">
          © {currentYear} Spaced Repetition Website
        </p>

        {/* RIGHT */}
        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <button className="hover:text-primary transition">
            Privacy
          </button>
          <button className="hover:text-primary transition">
            Terms
          </button>
          <button className="hover:text-primary transition">
            Support
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;