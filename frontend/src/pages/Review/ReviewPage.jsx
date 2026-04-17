import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import reviewApi from '../../api/review.api';
import Loading from '../../components/common/Loading';
import Flashcard from '../../components/review/Flashcard';

const QUALITY = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
};

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchCards = async () => {
      try {
        setLoading(true);
        const data = await reviewApi.getDueCards(id);
        if (mounted) {
          setCards(data || []);
        }
      } catch {
        toast.error("Không thể lấy dữ liệu ôn tập.");
        if (mounted) setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCards();
    return () => (mounted = false);
  }, [id]);

  const handleReview = useCallback(async (quality) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await reviewApi.updateCardProgress(currentCard.id, { quality });

      setIsFlipped(false);

      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          toast.success('🎉 Tuyệt vời! Bạn đã hoàn thành mục tiêu hôm nay.');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }, 250);
    } catch {
      toast.error('Lỗi khi lưu tiến trình học');
    }
  }, [cards, currentIndex, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || cards.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) {
          setIsFlipped(true);
        }
      }

      if (isFlipped) {
        switch (e.key) {
          case '1':
            handleReview(QUALITY.AGAIN);
            break;
          case '2':
            handleReview(QUALITY.HARD);
            break;
          case '3':
            handleReview(QUALITY.GOOD);
            break;
          case '4':
            handleReview(QUALITY.EASY);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, loading, cards.length, handleReview]);

  if (loading) return <Loading />;

  if (cards.length === 0) return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl">🏆</div>
      <h2 className="text-2xl font-bold text-slate-800">Không còn thẻ nào cần ôn!</h2>
      <p className="text-slate-500 mt-2">
        Bạn đã hoàn thành hết các thẻ đến hạn. Hãy quay lại sau nhé.
      </p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-8 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        Về Dashboard
      </button>
    </div>
  );

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center py-4">
      
      <div className="mb-10 w-full max-w-2xl px-4">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-slate-400 uppercase tracking-widest text-[10px]">
            Tiến độ ôn tập
          </span>
          <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Flashcard 
        card={currentCard} 
        isFlipped={isFlipped} 
        onFlip={() => setIsFlipped(true)} 
      />

      <div className="mt-10 w-full max-w-2xl px-4 min-h-20">
        {isFlipped ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => handleReview(QUALITY.AGAIN)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl bg-red-50 p-4 transition-all hover:bg-red-100 border border-red-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 text-[9px] font-mono text-red-300 bg-red-100/50 px-1.5 rounded">[1]</span>
              <span className="text-xs font-black uppercase text-red-600">Lặp lại</span>
              <span className="text-[10px] text-red-400">&lt; 1 phút</span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.HARD)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl bg-orange-50 p-4 transition-all hover:bg-orange-100 border border-orange-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 text-[9px] font-mono text-orange-300 bg-orange-100/50 px-1.5 rounded">[2]</span>
              <span className="text-xs font-black uppercase text-orange-600">Khó</span>
              <span className="text-[10px] text-orange-400">2 ngày</span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.GOOD)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl bg-indigo-50 p-4 transition-all hover:bg-indigo-100 border border-indigo-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 text-[9px] font-mono text-indigo-300 bg-indigo-100/50 px-1.5 rounded">[3]</span>
              <span className="text-xs font-black uppercase text-indigo-600">Tốt</span>
              <span className="text-[10px] text-indigo-400">4 ngày</span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.EASY)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 p-4 transition-all hover:bg-emerald-100 border border-emerald-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 text-[9px] font-mono text-emerald-300 bg-emerald-100/50 px-1.5 rounded">[4]</span>
              <span className="text-xs font-black uppercase text-emerald-600">Dễ</span>
              <span className="text-[10px] text-emerald-400">7 ngày</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="rounded-2xl bg-slate-900 px-12 py-4 font-black text-white shadow-xl transition-all hover:bg-primary active:scale-95 text-sm uppercase tracking-widest flex items-center gap-3"
            >
              Hiển thị đáp án
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono hidden sm:inline-block">Space</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;