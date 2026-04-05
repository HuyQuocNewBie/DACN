import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'public', label: 'Công khai' },
  { key: 'private', label: 'Riêng tư' },
];

const ManageDecks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setDecks([
          {
            id: 101,
            title: 'Tiếng Anh Giao Tiếp cơ bản',
            creator: 'Nguyễn Văn A',
            cardCount: 50,
            isPublic: true,
            createdAt: '2026-03-01',
          },
          {
            id: 102,
            title: 'Từ vựng N3 Nhật Ngữ',
            creator: 'Trần Thị B',
            cardCount: 120,
            isPublic: false,
            createdAt: '2026-03-05',
          },
        ]);
      } catch {
        toast.error('Không thể tải bộ thẻ');
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleDeleteDeck = (id) => {
    if (!window.confirm('Xóa bộ thẻ này?')) return;

    setDecks((prev) => prev.filter((d) => d.id !== id));
    toast.success('Đã xóa bộ thẻ');
  };

  const filteredDecks = decks.filter((deck) => {
    if (filter === 'public') return deck.isPublic;
    if (filter === 'private') return !deck.isPublic;
    return true;
  });

  if (loading) {
    return <div className="p-10 text-center">Đang tải...</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            Bộ thẻ
          </h1>
          <p className="text-on-surface-variant text-sm">
            Kiểm duyệt nội dung học tập
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                filter === f.key
                  ? 'bg-primary text-white shadow'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-4 text-left">Bộ thẻ</th>
              <th className="px-6 py-4">Người tạo</th>
              <th className="px-6 py-4 text-center">Số thẻ</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredDecks.map((deck) => (
              <tr
                key={deck.id}
                className="hover:bg-surface-container-low transition"
              >
                {/* TITLE */}
                <td className="px-6 py-4 font-semibold">
                  {deck.title}
                </td>

                {/* CREATOR */}
                <td className="px-6 py-4 text-on-surface-variant">
                  {deck.creator}
                </td>

                {/* COUNT */}
                <td className="px-6 py-4 text-center font-bold text-primary">
                  {deck.cardCount}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      deck.isPublic
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {deck.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="px-3 py-1 text-sm rounded-lg hover:bg-surface-container transition">
                    Xem
                  </button>

                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="px-3 py-1 text-sm font-semibold text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDecks.length === 0 && (
          <div className="p-10 text-center text-on-surface-variant">
            Không có bộ thẻ
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDecks;