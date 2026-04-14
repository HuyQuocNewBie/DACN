const Flashcard = ({ card, isFlipped, onFlip }) => {
  return (
    <div className="perspective-1000 w-full max-w-2xl px-4 group">
      <div
        onClick={() => !isFlipped && onFlip()}
        className={`relative h-96 w-full cursor-pointer transition-all duration-800 preserve-3d shadow-2xl rounded-[2.5rem] ${
          isFlipped ? 'rotate-y-180' : 'hover:scale-[1.02] hover:-translate-y-2'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-12 text-center border-b-4 border-slate-200 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="absolute top-10 flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-primary/30"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              CÂU HỎI
            </span>
            <span className="h-1 w-6 rounded-full bg-primary/30"></span>
          </div>

          <div className="relative z-10 w-full wrap-break-word">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
              {card.front_content}
            </h2>
          </div>

          <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Chạm hoặc nhấn <span className="font-mono bg-slate-100 px-1 rounded">Space</span> để lật thẻ
            </p>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></div>
          </div>
        </div>

        <div 
          className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center rounded-[2.5rem] bg-slate-900 p-12 text-center text-white shadow-inner overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
          
          <div className="absolute top-10">
            <span className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-[10px] font-bold uppercase tracking-[0.4em] text-primary-light">
              ĐÁP ÁN
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center w-full wrap-break-word">
            <p className="text-lg md:text-xl leading-relaxed font-medium bg-linear-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
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