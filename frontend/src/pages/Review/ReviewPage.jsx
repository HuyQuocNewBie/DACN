import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import reviewApi from '../../api/review.api';
import { calculateSM2 } from '../../utils/sm2';

// ================= CONSTANTS =================
const QUALITY = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
};

const MESSAGES = {
  DONE: '🎉 Bạn đã hoàn thành mục tiêu hôm nay!',
  ERROR_FETCH: 'Không thể tải thẻ ôn tập!',
  ERROR_SAVE: 'Không thể lưu kết quả. Vui lòng thử lại!',
};

// ================= HELPERS =================
const showToastByQuality = (quality) => {
  if (quality >= 4) {
    return toast.success('Làm tốt lắm!', { duration: 1000 });
  }
  if (quality === 0) {
    return toast.error('Sẽ ôn lại thẻ này sớm!', { duration: 1000 });
  }
};

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    let isMounted = true;

    const fetchCards = async () => {
      try {
        const data = await reviewApi.getDueCards(id);
        if (isMounted) {
          setCards(data);
        }
      } catch {
        toast.error(MESSAGES.ERROR_FETCH);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCards();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ================= HANDLE REVIEW =================
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

      showToastByQuality(quality);

      setIsFlipped(false);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        toast(MESSAGES.DONE, { icon: '👏' });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch {
      toast.error(MESSAGES.ERROR_SAVE);
    }
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="p-10 text-center">
        Hôm nay không có thẻ nào cần ôn tập! 🎉
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  if (!currentCard) return null;

  // ================= RENDER =================
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      
      {/* Progress */}
      <div className="mb-4 text-slate-400">
        Thẻ {currentIndex + 1} / {cards.length}
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full max-w-md h-64 cursor-pointer transition-all duration-500 transform-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white border-2 border-primary rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl backface-hidden">
          {currentCard.front_text}
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-slate-50 border-2 border-secondary rounded-2xl flex items-center justify-center text-xl p-6 text-center shadow-xl backface-hidden rotate-y-180">
          {currentCard.back_text}
        </div>
      </div>

      {/* Controls */}
      {isFlipped && (
        <div className="mt-10 grid grid-cols-4 gap-3 w-full max-w-md">
          <button
            onClick={() => handleReview(QUALITY.AGAIN)}
            className="bg-red-100 text-red-600 p-3 rounded-lg font-bold hover:bg-red-200"
          >
            Again
          </button>

          <button
            onClick={() => handleReview(QUALITY.HARD)}
            className="bg-orange-100 text-orange-600 p-3 rounded-lg font-bold hover:bg-orange-200"
          >
            Hard
          </button>

          <button
            onClick={() => handleReview(QUALITY.GOOD)}
            className="bg-blue-100 text-blue-600 p-3 rounded-lg font-bold hover:bg-blue-200"
          >
            Good
          </button>

          <button
            onClick={() => handleReview(QUALITY.EASY)}
            className="bg-green-100 text-green-600 p-3 rounded-lg font-bold hover:bg-green-200"
          >
            Easy
          </button>
        </div>
      )}

      {/* Hint */}
      {!isFlipped && (
        <p className="mt-6 text-slate-400 animate-bounce">
          Chạm vào thẻ để xem đáp án
        </p>
      )}
    </div>
  );
};

export default ReviewPage;