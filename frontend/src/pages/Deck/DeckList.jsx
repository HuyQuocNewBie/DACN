import { useEffect, useState } from 'react';
import deckApi from '../../api/deck.api';
import { Link } from 'react-router-dom';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const data = await deckApi.getAll();
        setDecks(data);
      } catch (error) {
        console.error("Không thể tải danh sách bộ thẻ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bộ thẻ của tôi</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          + Tạo bộ thẻ mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div key={deck.deck_id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">{deck.title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{deck.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
                {deck.card_count || 0} thẻ
              </span>
              <Link 
                to={`/decks/${deck.deck_id}`}
                className="text-primary font-medium text-sm hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {decks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <p className="text-slate-400">Bạn chưa có bộ thẻ nào. Hãy tạo cái đầu tiên nhé!</p>
        </div>
      )}
    </div>
  );
};

export default DeckList;