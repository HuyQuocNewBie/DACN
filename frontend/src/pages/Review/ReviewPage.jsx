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

// 1. Hàm format hiển thị ngày cho đẹp
const formatInterval = (days) => {
  if (days <= 0) return '< 1 phút';
  if (days === 1) return '1 ngày';
  if (days < 30) return `${days} ngày`;
  if (days < 365) return `${Math.floor(days / 30)} tháng`;
  return `${Math.floor(days / 365)} năm`;
};

// 2. Hàm mô phỏng chính xác thuật toán SM-2 từ Backend
const getNextInterval = (quality, card) => {
  if (!card) return '';

  // Lấy dữ liệu hiện tại của thẻ (Hỗ trợ cả snake_case và camelCase đề phòng API mapping)
  let reps = Number(card.repetitions || 0);
  let interval = Number(card.review_interval || card.reviewInterval || 1);
  let ef = Number(card.ease_factor || card.easeFactor || 2.5); // Default EF của SM-2 thường là 2.5

  if (quality < 3) {
    // Trả lời sai (AGAIN): Reset về 1 ngày
    return formatInterval(1);
  } else {
    // Trả lời đúng (HARD, GOOD, EASY): Tăng tiến trình
    reps += 1;
    if (reps === 1) {
      return formatInterval(1);
    } else if (reps === 2) {
      return formatInterval(6);
    } else {
      return formatInterval(Math.round(interval * ef));
    }
  }
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
            toast('Tuyệt vời! Bạn đã hoàn thành mục tiêu hôm nay.', {
              icon: '🎉',
              style: {
                borderRadius: '16px',
                background: '#ffffff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                padding: '16px',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
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

  if (cards.length === 0)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 text-6xl">🏆</div>
        <h2 className="text-2xl font-bold text-slate-800">
          Không còn thẻ nào cần ôn!
        </h2>
        <p className="mt-2 text-slate-500">
          Bạn đã hoàn thành hết các thẻ đến hạn. Hãy quay lại sau nhé.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary mt-8 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
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
          <span className="text-[10px] tracking-widest text-slate-400 uppercase">
            Tiến độ ôn tập
          </span>
          <span className="text-primary bg-primary/10 rounded-md px-2 py-0.5 font-mono">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <div
            className="bg-primary h-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(true)}
      />

      <div className="mt-10 min-h-20 w-full max-w-2xl px-4">
        {isFlipped ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-2 gap-3 duration-300 md:grid-cols-4">
            <button
              onClick={() => handleReview(QUALITY.AGAIN)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-red-100 bg-red-50 p-4 transition-all hover:bg-red-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 rounded bg-red-100/50 px-1.5 font-mono text-[9px] text-red-300">
                [1]
              </span>
              <span className="text-xs font-black text-red-600 uppercase">
                Lặp lại
              </span>
              <span className="text-[10px] text-red-400">
                {getNextInterval(QUALITY.AGAIN, currentCard)}
              </span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.HARD)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-orange-100 bg-orange-50 p-4 transition-all hover:bg-orange-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 rounded bg-orange-100/50 px-1.5 font-mono text-[9px] text-orange-300">
                [2]
              </span>
              <span className="text-xs font-black text-orange-600 uppercase">
                Khó
              </span>
              <span className="text-[10px] text-orange-400">
                {getNextInterval(QUALITY.HARD, currentCard)}
              </span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.GOOD)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 transition-all hover:bg-indigo-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 rounded bg-indigo-100/50 px-1.5 font-mono text-[9px] text-indigo-300">
                [3]
              </span>
              <span className="text-xs font-black text-indigo-600 uppercase">
                Tốt
              </span>
              <span className="text-[10px] text-indigo-400">
                {getNextInterval(QUALITY.GOOD, currentCard)}
              </span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.EASY)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 transition-all hover:bg-emerald-100 active:scale-95"
            >
              <span className="absolute top-2 left-2 rounded bg-emerald-100/50 px-1.5 font-mono text-[9px] text-emerald-300">
                [4]
              </span>
              <span className="text-xs font-black text-emerald-600 uppercase">
                Dễ
              </span>
              <span className="text-[10px] text-emerald-400">
                {getNextInterval(QUALITY.EASY, currentCard)}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="hover:bg-primary flex items-center gap-3 rounded-2xl bg-slate-900 px-12 py-4 text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95"
            >
              Hiển thị đáp án
              <span className="hidden rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] sm:inline-block">
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