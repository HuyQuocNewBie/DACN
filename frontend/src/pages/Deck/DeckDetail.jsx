import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import cardApi from '../../api/card.api';
import deckApi from '../../api/deck.api';

const DeckDetail = () => {
  const { id } = useParams(); // Lấy deck_id từ URL
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deckRes, cardsRes] = await Promise.all([
          deckApi.getById(id),
          cardApi.getByDeckId(id)
        ]);
        setDeck(deckRes);
        setCards(cardsRes);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bộ thẻ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header: Thông tin bộ thẻ */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/decks" className="text-sm text-primary hover:underline mb-2 inline-block">← Quay lại danh sách</Link>
          <h1 className="text-3xl font-bold text-slate-800">{deck?.title}</h1>
          <p className="text-slate-500 mt-2">{deck?.description}</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/review/${id}`} 
            className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition shadow-lg shadow-emerald-100"
          >
            Bắt đầu học ngay
          </Link>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50">
            + Thêm thẻ mới
          </button>
        </div>
      </div>

      {/* Danh sách thẻ dưới dạng bảng hoặc grid nhỏ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">Danh sách thẻ ({cards.length})</h2>
        <div className="grid gap-3">
          {cards.map((card) => (
            <div key={card.card_id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center group hover:border-primary transition">
              <div className="grid grid-cols-2 gap-8 flex-1">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mặt trước</span>
                  <p className="text-slate-800 font-medium">{card.front_text}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mặt sau</span>
                  <p className="text-slate-600 italic">{card.back_text}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button className="p-2 text-slate-400 hover:text-blue-500">Sửa</button>
                <button className="p-2 text-slate-400 hover:text-red-500">Xóa</button>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Bộ thẻ này đang trống.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckDetail;