// src/components/review/Flashcard.jsx

const Flashcard = ({ card, isFlipped, onFlip }) => {
  return (
    <div 
      className="relative w-full max-w-xl h-80 cursor-pointer perspective-1000 mx-auto"
      onClick={onFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Mặt trước: Câu hỏi */}
        <div className="absolute inset-0 bg-white border-2 border-primary/20 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden">
          <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Câu hỏi</span>
          <h2 className="text-2xl font-medium text-slate-800 text-center">{card.front}</h2>
          <p className="mt-8 text-slate-400 text-sm italic">Chạm vào thẻ để xem đáp án</p>
        </div>

        {/* Mặt sau: Câu trả lời */}
        <div className="absolute inset-0 bg-slate-800 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180">
          <span className="text-xs font-bold text-primary-light uppercase tracking-widest mb-4">Đáp án</span>
          <h2 className="text-2xl font-medium text-center">{card.back}</h2>
        </div>

      </div>
    </div>
  );
};

export default Flashcard;