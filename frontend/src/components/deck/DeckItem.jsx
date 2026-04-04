import { Link } from 'react-router-dom';

const DeckItem = ({ deck, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner"
          style={{ backgroundColor: `${deck.color}20`, color: deck.color }}
        >
          📁
        </div>
        <button 
          onClick={() => onDelete(deck.id)}
          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          🗑️
        </button>
      </div>
      
      <Link to={`/decks/${deck.id}`}>
        <h3 className="font-bold text-slate-800 text-lg mb-1 hover:text-primary transition-colors">
          {deck.title}
        </h3>
      </Link>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{deck.description}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
          {deck.cards_count} thẻ
        </span>
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