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
        if (mounted) setCards(data || []);
      } catch {
        toast.error('Không thể lấy dữ liệu ôn tập.');
        if (mounted) setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCards();
    return () => (mounted = false);
  }, [id]);

  const handleReview = useCallback(
    async (quality) => {
      const currentCard = cards[currentIndex];
      if (!currentCard) return;

      try {
        await reviewApi.updateCardProgress(currentCard.id, { quality });

        setIsFlipped(false);

        setTimeout(() => {
          if (currentIndex < cards.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            toast.success('Tuyệt vời! Bạn đã hoàn thành mục tiêu hôm nay', {
              icon: '🎉',
              className:
                'bg-white text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-xl rounded-2xl font-semibold',
            });

            setTimeout(() => navigate('/dashboard'), 2000);
          }
        }, 250);
      } catch {
        toast.error('Lỗi khi lưu tiến trình học');
      }
    },
    [cards, currentIndex, navigate]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || cards.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) setIsFlipped(true);
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

  if (cards.length === 0)
    return (
      <div className="animate-in fade-in flex h-[60vh] flex-col items-center justify-center text-center duration-500">
        <div className="mb-6 text-6xl">🏆</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Không còn thẻ nào cần ôn!
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Bạn đã hoàn thành hết các thẻ đến hạn. Hãy quay lại sau nhé.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary mt-8 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:shadow-none"
        >
          Về Dashboard
        </button>
      </div>
    );

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="animate-in fade-in mx-auto flex max-w-4xl flex-col items-center py-4 duration-500">
      {/* PROGRESS */}
      <div className="mb-10 w-full max-w-2xl px-4">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-[10px] tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Tiến độ ôn tập
          </span>
          <span className="text-primary bg-primary/10 dark:bg-primary/20 rounded-md px-2 py-0.5 font-mono">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50">
          <div
            className="bg-primary h-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out dark:shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* FLASHCARD */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(true)}
      />

      <div className="mt-10 min-h-20 w-full max-w-2xl px-4">
        {isFlipped ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-2 gap-3 duration-300 md:grid-cols-4">
            {/* AGAIN */}
            <button
              onClick={() => handleReview(QUALITY.AGAIN)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-red-100 bg-red-50 p-4 transition-all hover:bg-red-100 active:scale-95 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <span className="absolute top-2 left-2 rounded bg-red-100/50 px-1.5 font-mono text-[9px] text-red-300 dark:bg-red-500/20 dark:text-red-400">
                [1]
              </span>
              <span className="text-xs font-black text-red-600 uppercase dark:text-red-400">
                Lặp lại
              </span>
              <span className="text-[10px] text-red-400 dark:text-red-500">
                Chưa nhớ
              </span>
            </button>

            {/* HARD */}
            <button
              onClick={() => handleReview(QUALITY.HARD)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-orange-100 bg-orange-50 p-4 transition-all hover:bg-orange-100 active:scale-95 dark:border-orange-500/20 dark:bg-orange-500/10 dark:hover:bg-orange-500/20"
            >
              <span className="absolute top-2 left-2 rounded bg-orange-100/50 px-1.5 font-mono text-[9px] text-orange-300 dark:bg-orange-500/20 dark:text-orange-400">
                [2]
              </span>
              <span className="text-xs font-black text-orange-600 uppercase dark:text-orange-400">
                Khó
              </span>
              <span className="text-[10px] text-orange-400 dark:text-orange-500">
                Mơ hồ
              </span>
            </button>

            {/* GOOD */}
            <button
              onClick={() => handleReview(QUALITY.GOOD)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 transition-all hover:bg-indigo-100 active:scale-95 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20"
            >
              <span className="absolute top-2 left-2 rounded bg-indigo-100/50 px-1.5 font-mono text-[9px] text-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-400">
                [3]
              </span>
              <span className="text-xs font-black text-indigo-600 uppercase dark:text-indigo-400">
                Tốt
              </span>
              <span className="text-[10px] text-indigo-400 dark:text-indigo-500">
                Đã nhớ
              </span>
            </button>

            {/* EASY */}
            <button
              onClick={() => handleReview(QUALITY.EASY)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
            >
              <span className="absolute top-2 left-2 rounded bg-emerald-100/50 px-1.5 font-mono text-[9px] text-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400">
                [4]
              </span>
              <span className="text-xs font-black text-emerald-600 uppercase dark:text-emerald-400">
                Dễ
              </span>
              <span className="text-[10px] text-emerald-400 dark:text-emerald-500">
                Thuộc lòng
              </span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="hover:bg-primary dark:hover:bg-primary flex items-center gap-3 rounded-2xl bg-slate-900 px-12 py-4 text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 dark:bg-slate-800"
            >
              Hiển thị đáp án
              <span className="hidden rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] sm:inline-block dark:bg-white/10">
                Space
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
