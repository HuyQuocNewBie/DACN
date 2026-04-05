import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import cardApi from '../../api/card.api';
import deckApi from '../../api/deck.api';
import toast from 'react-hot-toast';

const DeckDetail = () => {
  const { id } = useParams();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCard, setNewCard] = useState({
    front_text: '',
    back_text: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // ✅ chống gọi API 2 lần (StrictMode)
  const hasFetched = useRef({});

  // ================= FETCH =================
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [deckRes, cardsRes] = await Promise.all([
        deckApi.getById(id),
        cardApi.getByDeckId(id),
      ]);

      setDeck(deckRes);
      setCards(cardsRes);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu', { id: 'fetch-error' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (hasFetched.current[id]) return;

    hasFetched.current[id] = true;
    fetchData();
  }, [id, fetchData]);

  // ================= ADD CARD =================
  const handleAddCard = async (e) => {
    e.preventDefault();

    if (!newCard.front_text.trim() || !newCard.back_text.trim()) {
      return toast.error('Nhập đầy đủ nội dung');
    }

    setSubmitting(true);
    try {
      await cardApi.create({ ...newCard, deck_id: id });

      toast.success('Đã thêm thẻ!');
      setNewCard({ front_text: '', back_text: '' });

      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi thêm thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      
      {/* HEADER */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {deck?.title}
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            {deck?.description || 'Không có mô tả'}
          </p>
        </div>

        <button className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-linear-to-r from-blue-600 to-blue-500 shadow-lg hover:scale-[0.97] transition">
          <span className="material-symbols-outlined">play_arrow</span>
          Bắt đầu ôn tập
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Tổng thẻ</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {cards.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Đã tạo</p>
          <p className="text-3xl font-bold text-emerald-500 mt-1">
            {cards.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Trạng thái</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            Đang học
          </p>
        </div>
      </div>

      {/* QUICK ADD */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-2 rounded-lg">
            add_circle
          </span>
          <h3 className="text-xl font-bold text-slate-800">
            Thêm thẻ mới
          </h3>
        </div>

        <form onSubmit={handleAddCard} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mặt trước
            </label>
            <textarea
              rows="4"
              placeholder="Nhập câu hỏi..."
              className="mt-2 w-full rounded-xl bg-slate-50 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={newCard.front_text}
              onChange={(e) =>
                setNewCard({ ...newCard, front_text: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mặt sau
            </label>
            <textarea
              rows="4"
              placeholder="Nhập đáp án..."
              className="mt-2 w-full rounded-xl bg-slate-50 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={newCard.back_text}
              onChange={(e) =>
                setNewCard({ ...newCard, back_text: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu thẻ'}
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-slate-800">
            Danh sách thẻ ({cards.length})
          </h3>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Mặt trước</th>
              <th className="px-6 py-4">Mặt sau</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {cards.map((card) => (
              <tr key={card.card_id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-5 font-semibold text-slate-800">
                  {card.front_text}
                </td>
                <td className="px-6 py-5 italic text-slate-500">
                  {card.back_text}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition">
                      Sửa
                    </button>
                    <button className="px-3 py-1 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition">
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cards.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            Chưa có thẻ nào 😢
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckDetail;