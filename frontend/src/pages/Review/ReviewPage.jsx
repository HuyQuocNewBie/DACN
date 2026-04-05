import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import reviewApi from '../../api/review.api';
import { calculateSM2 } from '../../utils/sm2';

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

  // ================= FETCH =================
  useEffect(() => {
    let mounted = true;

    const fetchCards = async () => {
      try {
        const data = await reviewApi.getDueCards(id);
        if (mounted) setCards(data);
      } catch {
        toast.error('Không thể tải thẻ!', {
          id: 'fetch-review-error',
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCards();
    return () => (mounted = false);
  }, [id]);

  // ================= REVIEW =================
  const handleReview = async (quality) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    const result = calculateSM2(
      quality,
      currentCard.repetitions,
      currentCard.interval_days,
      currentCard.ease_factor
    );

    try {
      await reviewApi.updateCardProgress(currentCard.card_id, result);

      setIsFlipped(false);

      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          toast.success('🎉 Hoàn thành!');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }, 300);
    } catch {
      toast.error('Lỗi lưu dữ liệu');
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (cards.length === 0)
    return <div className="p-10 text-center">Không có thẻ 🎉</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {/* Progress */}
      <div className="mb-6 text-sm text-slate-400">
        {currentIndex + 1} / {cards.length}
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="group perspective relative w-full max-w-2xl cursor-pointer"
      >
        <div
          className={`transform-style preserve-3d relative h-80 w-full rounded-4xl transition-all duration-500 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 flex items-center justify-center rounded-4xl bg-white p-10 shadow-xl backface-hidden">
            <h2 className="text-center text-3xl font-bold">
              {currentCard.front_text}
            </h2>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 flex rotate-y-180 items-center justify-center rounded-4xl bg-blue-50 p-10 shadow-xl backface-hidden">
            <p className="text-center text-xl">{currentCard.back_text}</p>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      {!isFlipped && (
        <button
          onClick={() => setIsFlipped(true)}
          className="mt-10 rounded-xl bg-blue-600 px-10 py-4 font-bold text-white shadow-lg transition hover:scale-105"
        >
          Hiển thị đáp án
        </button>
      )}

      {/* RATING */}
      {isFlipped && (
        <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <button
            onClick={() => handleReview(QUALITY.AGAIN)}
            className="rounded-xl bg-red-100 p-4 font-bold text-red-600 hover:bg-red-200"
          >
            Lặp lại
          </button>

          <button
            onClick={() => handleReview(QUALITY.HARD)}
            className="rounded-xl bg-orange-100 p-4 font-bold text-orange-600 hover:bg-orange-200"
          >
            Khó
          </button>

          <button
            onClick={() => handleReview(QUALITY.GOOD)}
            className="rounded-xl bg-blue-100 p-4 font-bold text-blue-600 hover:bg-blue-200"
          >
            Tốt
          </button>

          <button
            onClick={() => handleReview(QUALITY.EASY)}
            className="rounded-xl bg-green-100 p-4 font-bold text-green-600 hover:bg-green-200"
          >
            Dễ
          </button>
        </div>
      )}

      {/* Hint */}
      {!isFlipped && (
        <p className="mt-6 animate-pulse text-slate-400">Click để lật thẻ</p>
      )}
    </div>
  );
};

export default ReviewPage;
