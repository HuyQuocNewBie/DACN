import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Thẻ Card mô phỏng Flashcard */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105">
        <div className="p-8 text-center">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <span className="text-3xl">🚀</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            DACN: Spaced Repetition
          </h1>

          <p className="text-slate-600 mb-6">
            Chào <span className="font-bold text-blue-600">Quốc</span> &{" "}
            <span className="font-bold text-blue-600">Hùng</span>!<br />
            Nếu bạn thấy giao diện này có màu xanh và bo góc đẹp, nghĩa là
            Tailwind v4 đã chạy ngon lành.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors">
              Đã thuộc bài
            </button>
            <button className="py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition-colors">
              Chưa thuộc
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-sm text-slate-400 font-mono">
          Status: Ready to Code SM-2 Algorithm
        </div>
      </div>

      <p className="mt-8 text-slate-500 text-sm italic">
        Trường Đại học Thủ Dầu Một - Viện Công nghệ số
      </p>
    </div>
  );
}

export default App;
