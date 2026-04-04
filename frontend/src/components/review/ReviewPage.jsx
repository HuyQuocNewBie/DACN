import { useState } from 'react'; // Đã xóa useEffect vì không dùng
import { useNavigate } from 'react-router-dom'; // Đã xóa useParams vì không dùng deckId
import Flashcard from '../../components/review/Flashcard';
import { toast } from 'react-hot-toast';

const ReviewPage = () => {
  const navigate = useNavigate();
  
  // Đã xóa setCards vì danh sách thẻ đang là dữ liệu tĩnh để test
  const [cards] = useState([
    { id: 1, front: "React là gì?", back: "Một thư viện JavaScript để xây dựng giao diện người dùng." },
    { id: 2, front: "JSX là gì?", back: "Cú pháp mở rộng của JavaScript giúp viết HTML trong React." },
    { id: 3, front: "Hook là gì?", back: "Các hàm cho phép dùng state và các tính năng khác của React mà không cần dùng class." }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAnswer = (quality) => {
    toast.success(`Đã đánh giá: ${quality}`, { duration: 800 });
    
    // Chuyển sang thẻ tiếp theo
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      // Đợi hiệu ứng lật thẻ quay về mặt trước rồi mới đổi nội dung
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    } else {
      toast('Chúc mừng! Bạn đã hoàn thành bài ôn tập hôm nay.', { icon: '🎉' });
      navigate('/dashboard');
    }
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Thanh tiến trình */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-bold text-slate-500">
          <span>Tiến độ học tập</span>
          <span>{currentIndex + 1} / {cards.length}</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Hiển thị Flashcard */}
      <Flashcard 
        card={cards[currentIndex]} 
        isFlipped={isFlipped} 
        onFlip={() => setIsFlipped(!isFlipped)} 
      />

      {/* Bộ điều khiển (Chỉ hiện khi đã lật thẻ để xem đáp án) */}
      <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-300 ${
        isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}>
        <button 
          onClick={() => handleAnswer('Again')} 
          className="flex flex-col items-center p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <span className="font-bold">Quá khó</span>
          <span className="text-xs">Dưới 1 phút</span>
        </button>
        <button 
          onClick={() => handleAnswer('Hard')} 
          className="flex flex-col items-center p-3 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
        >
          <span className="font-bold">Khó</span>
          <span className="text-xs">2 ngày</span>
        </button>
        <button 
          onClick={() => handleAnswer('Good')} 
          className="flex flex-col items-center p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
        >
          <span className="font-bold">Tốt</span>
          <span className="text-xs">4 ngày</span>
        </button>
        <button 
          onClick={() => handleAnswer('Easy')} 
          className="flex flex-col items-center p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <span className="font-bold">Dễ</span>
          <span className="text-xs">7 ngày</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;