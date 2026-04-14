import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DeckItem = ({ deck, onDelete }) => {
  const [isPublic, setIsPublic] = useState(deck.is_public === 1);
  const [isChanging, setIsChanging] = useState(false);

  const handleTogglePublic = async (e) => {
    e.preventDefault();
    setIsChanging(true);
    
    try {
      const newStatus = !isPublic;
      setIsPublic(newStatus);
      toast.success(newStatus ? "Đã công khai bộ thẻ" : "Đã chuyển về riêng tư");
    } catch {
      toast.error("Không thể thay đổi trạng thái chia sẻ");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner"
          style={{ backgroundColor: `${deck.color}20`, color: deck.color }}
        >
          📁
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleTogglePublic}
            disabled={isChanging}
            title={isPublic ? "Đang công khai" : "Đang riêng tư"}
            className={`text-lg p-1 rounded-lg transition-all transform hover:scale-110 ${
              isChanging ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {isPublic ? '🌎' : '🔒'}
          </button>

          <button 
            onClick={() => onDelete(deck.id)}
            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <Link to={`/decks/${deck.id}`}>
        <h3 className="font-bold text-slate-800 text-lg mb-1 hover:text-primary transition-colors">
          {deck.title}
        </h3>
      </Link>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{deck.description}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex gap-2 items-center">
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
            {deck.cards_count} thẻ
          </span>
          {isPublic && (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
              PUBLIC
            </span>
          )}
        </div>

        <Link 
          to={`/review/${deck.id}`} 
          className="text-primary text-sm font-bold hover:underline"
        >
          Học ngay →
        </Link>
      </div>
    </div>
  );
};

export default DeckItem;