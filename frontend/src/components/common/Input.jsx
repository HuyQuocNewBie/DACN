const Input = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input
        className={`border-2 p-2 rounded-lg outline-none transition-all focus:border-primary ${
          error ? 'border-red-500' : 'border-slate-200'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;