const EmptyState = ({ message = "Chưa có dữ liệu nào ở đây.", subMessage = "Hãy bắt đầu bằng cách thêm mới nhé!" }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-xl font-bold text-slate-800">{message}</h3>
    <p className="text-slate-500 mt-1">{subMessage}</p>
  </div>
);

export default EmptyState;