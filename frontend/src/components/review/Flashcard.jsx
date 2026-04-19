const Flashcard = ({ card, isFlipped, onFlip }) => {
  return (
    <div className="perspective-1000 w-full max-w-2xl px-4 group">
      <div
        onClick={() => !isFlipped && onFlip()}
        className={`relative min-h-[400px] w-full cursor-pointer transition-all duration-800 preserve-3d shadow-2xl rounded-[2.5rem] ${
          isFlipped ? 'rotate-y-180' : 'hover:scale-[1.02] hover:-translate-y-2'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* MẶT TRƯỚC (CÂU HỎI) */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center border-b-4 border-slate-200 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          
          <div className="absolute top-10 flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-primary/30"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">CÂU HỎI</span>
            <span className="h-1 w-6 rounded-full bg-primary/30"></span>
          </div>

          <div className="relative z-10 w-full flex flex-col items-center gap-6">
            {/* Hiển thị ảnh mặt trước nếu có */}
            {card.front_image_url && (
              <div className="max-h-48 w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                <img 
                  src={card.front_image_url} 
                  alt="Front illustration" 
                  className="h-full w-full object-contain bg-slate-50"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight break-words">
              {card.front_content}
            </h2>
          </div>

          <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-60">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Chạm hoặc nhấn <span className="font-mono bg-slate-100 px-1 rounded">Space</span> để lật
            </p>
          </div>
        </div>

        {/* MẶT SAU (ĐÁP ÁN) */}
        <div 
          className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center rounded-[2.5rem] bg-slate-900 p-8 text-center text-white shadow-inner overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <div className="absolute top-10">
            <span className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">
              ĐÁP ÁN
            </span>
          </div>

          <div className="z-10 flex flex-col items-center gap-6 w-full">
            {/* Hiển thị ảnh mặt sau nếu có */}
            {card.back_image_url && (
              <div className="max-h-48 w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <img 
                  src={card.back_image_url} 
                  alt="Back illustration" 
                  className="h-full w-full object-contain bg-slate-800"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
            <p className="text-lg md:text-xl leading-relaxed font-medium bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent break-words">
              {card.back_content}
            </p>
          </div>

          <div className="absolute bottom-6 right-8 opacity-10">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Flashcard;