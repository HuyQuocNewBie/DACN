const Flashcard = ({ card, isFlipped, onFlip }) => {
  if (!card) return null;
  
  return (
    <div className="perspective-1000 group w-full max-w-2xl px-4">
      <div
        onClick={() => !isFlipped && onFlip()}
        className={`preserve-3d relative min-h-100 w-full cursor-pointer rounded-[2.5rem] shadow-2xl transition-all duration-800 ${
          isFlipped ? 'rotate-y-180' : 'hover:-translate-y-2 hover:scale-[1.02]'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-b-4 border-slate-200 bg-white p-8 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-primary/5 absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" />

          <div className="absolute top-10 flex items-center gap-2">
            <span className="bg-primary/30 h-1 w-6 rounded-full"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              CÂU HỎI
            </span>
            <span className="bg-primary/30 h-1 w-6 rounded-full"></span>
          </div>

          <div className="relative z-10 flex w-full flex-col items-center gap-6">
            {card.front_image_url && (
              <div className="max-h-48 w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                <img
                  src={card.front_image_url}
                  alt="Front illustration"
                  className="h-full w-full bg-slate-50 object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
            
            <h2 
              className="line-clamp-5 break-all w-full text-2xl leading-tight font-black text-slate-800 md:text-3xl"
              title={card.front_content}
            >
              {card.front_content}
            </h2>
          </div>

          <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-60">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Chạm hoặc nhấn{' '}
              <span className="rounded bg-slate-100 px-1 font-mono">Space</span>{' '}
              để lật
            </p>
          </div>
        </div>

        <div
          className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-center text-white shadow-inner"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="via-primary absolute top-0 left-1/2 h-1 w-full -translate-x-1/2 bg-linear-to-r from-transparent to-transparent"></div>

          <div className="absolute top-10">
            <span className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-[10px] font-bold tracking-[0.4em] text-blue-400 uppercase">
              ĐÁP ÁN
            </span>
          </div>

          <div className="z-10 flex w-full flex-col items-center gap-6">
            {card.back_image_url && (
              <div className="max-h-48 w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <img
                  src={card.back_image_url}
                  alt="Back illustration"
                  className="h-full w-full bg-slate-800 object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}

            <p 
              className="line-clamp-8 break-all w-full bg-linear-to-br from-white to-slate-400 bg-clip-text text-lg leading-relaxed font-medium text-transparent md:text-xl"
              title={card.back_content}
            >
              {card.back_content}
            </p>
          </div>

          <div className="absolute right-8 bottom-6 opacity-10">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
