import { useEffect, useState } from 'react';
import deckApi from '../../api/deck.api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeck, setNewDeck] = useState({
    title: '',
    description: '',
    is_public: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDecks = async () => {
    try {
      const data = await deckApi.getAll();
      setDecks(data);
    } catch (error) {
      console.error('Không thể tải danh sách bộ thẻ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeck.title.trim()) return toast.error('Vui lòng nhập tên bộ thẻ');

    setSubmitting(true);
    try {
      await deckApi.create(newDeck);
      toast.success('Tạo bộ thẻ thành công!');
      setIsModalOpen(false);
      setNewDeck({ title: '', description: '', is_public: false });
      fetchDecks();
    } catch {
      toast.error('Không thể tạo bộ thẻ!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline text-on-surface text-4xl font-extrabold">
            Bộ thẻ của tôi
          </h1>
          <p className="text-on-surface-variant mt-1">
            Khám phá và chinh phục kiến thức mỗi ngày 🚀
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary shadow-primary/20 flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1"
        >
          <span className="material-symbols-outlined">add</span>
          Tạo bộ thẻ
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ADD CARD */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="group border-outline-variant hover:border-primary hover:bg-primary/5 flex min-h-55t cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition"
        >
          <div className="bg-surface-container group-hover:bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full transition">
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-4xl">
              add_circle
            </span>
          </div>
          <span className="text-on-surface-variant group-hover:text-primary mt-4 font-bold">
            Thêm bộ thẻ mới
          </span>
        </div>

        {/* DECK LIST */}
        {decks.map((deck) => (
          <div
            key={deck.deck_id}
            className="bg-surface-container-lowest flex flex-col justify-between rounded-xl p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-primary-fixed text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined">style</span>
                </div>

                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-bold">
                  {deck.card_count || 0} thẻ
                </span>
              </div>

              <h3 className="font-headline text-on-surface mb-1 text-xl font-bold">
                {deck.title}
              </h3>

              <p className="text-on-surface-variant mb-6 line-clamp-2 text-sm">
                {deck.description || 'Không có mô tả'}
              </p>
            </div>

            {/* ACTION */}
            <div className="border-outline-variant/30 border-t pt-4">
              <Link
                to={`/decks/${deck.deck_id}`}
                className="text-primary flex items-center gap-1 text-sm font-bold hover:underline"
              >
                Quản lý thẻ →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {decks.length === 0 && (
        <div className="border-outline-variant mt-10 rounded-xl border-2 border-dashed py-20 text-center">
          <p className="text-on-surface-variant">Bạn chưa có bộ thẻ nào 😢</p>
        </div>
      )}

      {/* MODAL */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
    
    <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-on-surface font-headline">
            Thêm bộ thẻ mới
          </h2>

          <button
            onClick={() => setIsModalOpen(false)}
            className="text-on-surface-variant hover:text-error"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateDeck} className="space-y-6">

          <div>
            <label className="text-sm font-bold text-on-surface">
              Tên bộ thẻ *
            </label>
            <input
              className="w-full bg-surface-container-low rounded-xl py-4 px-5 mt-1 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="vd: 1000 từ TOEIC"
              value={newDeck.title}
              onChange={(e) =>
                setNewDeck({ ...newDeck, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface">
              Mô tả
            </label>
            <textarea
              rows="4"
              className="w-full bg-surface-container-low rounded-xl py-4 px-5 mt-1 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Mô tả ngắn..."
              value={newDeck.description}
              onChange={(e) =>
                setNewDeck({ ...newDeck, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-4 rounded-xl bg-surface-container font-bold text-on-surface-variant"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-2 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20"
            >
              {submitting ? "Đang tạo..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>

      {/* Gradient footer */}
      <div className="h-1 w-full bg-linear-to-r from-primary to-primary-container"></div>
    </div>
  </div>
)}
    </div>
  );
};

export default DeckList;
