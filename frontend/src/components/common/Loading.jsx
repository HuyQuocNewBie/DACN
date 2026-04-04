// src/components/common/Loading.jsx
const Loading = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      <p className="text-sm text-slate-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  );

  if (fullPage) {
    return <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">{spinner}</div>;
  }

  return <div className="p-4 flex justify-center">{spinner}</div>;
};

export default Loading;