import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import adminApi from '../../api/admin.api';

const FILTERS = [
  { key: 'all', label: 'Tất cả', emoji: '📚' },
  { key: 'public', label: 'Công khai', emoji: '🌍' },
  { key: 'private', label: 'Riêng tư', emoji: '🔒' },
];

const ManageDecks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllDecks();
      setDecks(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Không thể tải danh sách bộ thẻ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const stats = useMemo(() => {
    if (!decks.length) return { avgCards: 0, publicRate: 0, newThisWeek: 0 };

    const totalCards = decks.reduce(
      (sum, d) => sum + (Number(d.cards_count) || 0),
      0
    );
    const publicCount = decks.filter((d) => Number(d.is_public) === 1).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newCount = decks.filter(
      (d) => d.createdAt && new Date(d.createdAt) > sevenDaysAgo
    ).length;

    return {
      avgCards: Math.round(totalCards / decks.length),
      publicRate: Math.round((publicCount / decks.length) * 100),
      newThisWeek: newCount || decks.length,
    };
  }, [decks]);

  const handleToggleStatus = async (deck) => {
    const newStatus = Number(deck.is_public) === 1 ? 0 : 1;
    try {
      await adminApi.toggleDeckStatus(deck.id, newStatus);
      setDecks((prev) =>
        prev.map((d) => (d.id === deck.id ? { ...d, is_public: newStatus } : d))
      );
      toast.success(newStatus ? 'Đã công khai bộ thẻ' : 'Đã khóa bộ thẻ');
    } catch {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setSelectedDeck(null);
      setIsModalOpen(true);
      setModalLoading(true);
      const response = await adminApi.getDeckDetail(id);
      if (response && response.id) {
        setSelectedDeck(response);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch {
      toast.error('Không thể tải chi tiết thẻ.');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteDeck = async (id) => {
    if (
      !window.confirm(
        'Xóa vĩnh viễn bộ thẻ này? Thao tác này không thể hoàn tác.'
      )
    )
      return;
    try {
      await adminApi.deleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
      toast.success('Đã xóa bộ thẻ');
    } catch {
      toast.error('Lỗi khi xóa bộ thẻ');
    }
  };

  const filteredDecks = decks.filter((deck) => {
    const matchSearch =
      deck.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.creator?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filter === 'public') return Number(deck.is_public) === 1;
    if (filter === 'private') return Number(deck.is_public) === 0;
    return true;
  });

  const totalPages = Math.ceil(filteredDecks.length / itemsPerPage);
  const currentDecks = filteredDecks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key) => {
    setFilter(key);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const activeFilter = FILTERS.find((f) => f.key === filter);

  if (loading) return <Loading />;

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="relative flex flex-col justify-between gap-8 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-colors duration-300 md:p-10 xl:flex-row xl:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl dark:bg-indigo-500/10"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 transition-colors duration-300 md:text-4xl dark:text-white">
            Kho bộ thẻ
          </h1>
          <p className="mt-1 font-medium text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Kiểm duyệt và điều phối nội dung học tập cộng đồng
          </p>
        </div>

        <div className="relative z-20 flex w-full flex-col items-center gap-4 sm:flex-row xl:w-auto">
          <div className="relative w-full sm:w-72">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 opacity-40 dark:text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm tên, tác giả..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pr-4 pl-12 text-sm font-medium text-slate-900 shadow-inner transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-xs font-black tracking-widest text-slate-700 uppercase shadow-sm transition-all hover:bg-slate-50 active:scale-95 sm:w-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span className="flex items-center gap-2">
                <span>{activeFilter?.emoji}</span> {activeFilter?.label}
              </span>
              <span
                className={`text-[10px] text-slate-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsFilterOpen(false)}
                ></div>

                <div className="animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-xl duration-200 sm:w-45 dark:border-slate-700 dark:bg-slate-800">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => handleFilterChange(f.key)}
                      className={`flex w-full items-center gap-3 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all ${
                        filter === f.key
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{f.emoji}</span> {f.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white pb-8 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors duration-300 dark:bg-slate-800/50 dark:text-slate-500">
                <th className="px-8 py-5 text-left">Thông tin bộ thẻ</th>
                <th className="px-6 py-5 text-left">Tác giả</th>
                <th className="px-6 py-5 text-center">Số lượng</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {currentDecks.map((deck) => (
                <tr
                  key={deck.id}
                  className="group rounded-2xl border border-transparent bg-white transition-all hover:border-slate-100 hover:bg-slate-50/50 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  <td className="rounded-l-2xl border-y border-l border-transparent px-6 py-5 group-hover:border-slate-100 dark:group-hover:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-black text-white transition-colors duration-300 dark:bg-slate-700">
                        {deck.title?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="line-clamp-1 text-sm font-black text-slate-900 transition-colors duration-300 dark:text-white">
                          {deck.title}
                        </div>
                        <div className="text-[10px] font-bold tracking-tight text-slate-400 transition-colors duration-300 dark:text-slate-500">
                          ID: #{deck.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-y border-transparent px-6 py-5 group-hover:border-slate-100 dark:group-hover:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 transition-colors duration-300 dark:text-slate-400">
                      {deck.creator || 'Ẩn danh'}
                    </span>
                  </td>
                  <td className="border-y border-transparent px-6 py-5 text-center group-hover:border-slate-100 dark:group-hover:border-slate-700">
                    <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600 transition-colors duration-300 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {deck.cards_count} thẻ
                    </span>
                  </td>
                  <td className="border-y border-transparent px-6 py-5 text-center group-hover:border-slate-100 dark:group-hover:border-slate-700">
                    <button
                      onClick={() => handleToggleStatus(deck)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all ${
                        Number(deck.is_public) === 1
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                          : 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
                      }`}
                    >
                      {Number(deck.is_public) === 1
                        ? '🌍 Public'
                        : '🔒 Private'}
                    </button>
                  </td>
                  <td className="rounded-r-2xl border-y border-r border-transparent px-6 py-5 text-right group-hover:border-slate-100 dark:group-hover:border-slate-700">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(deck.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shadow-sm transition-all hover:bg-slate-900 hover:text-white active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-sm transition-all hover:bg-rose-600 hover:text-white active:scale-95 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDecks.length > itemsPerPage && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 font-bold transition-all hover:bg-slate-50 disabled:opacity-20 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1
                    ? 'dark:bg-primary bg-slate-900 text-white shadow-lg shadow-slate-200 dark:text-white dark:shadow-none'
                    : 'border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 font-bold transition-all hover:bg-slate-50 disabled:opacity-20 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              →
            </button>
          </div>
        )}

        {filteredDecks.length === 0 && (
          <div className="py-24 text-center">
            <div className="mb-4 text-6xl opacity-20 grayscale">🔍</div>
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors dark:text-slate-500">
              Không tìm thấy dữ liệu
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300 transition-colors dark:text-slate-600">
              Hãy thử thay đổi từ khóa hoặc bộ lọc xem sao!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative flex items-center justify-between overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white transition-colors duration-300 dark:bg-slate-800">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
              Quy mô trung bình
            </p>
            <h4 className="mt-1 text-3xl font-black">
              {stats.avgCards} thẻ/bộ
            </h4>
          </div>
          <div className="text-4xl opacity-20 transition-transform duration-500 group-hover:scale-125">
            📈
          </div>
        </div>
        <div className="group flex items-center justify-between rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors dark:text-slate-500">
              Tỉ lệ công khai
            </p>
            <h4 className="mt-1 text-3xl font-black text-slate-900 transition-colors dark:text-white">
              {stats.publicRate}%
            </h4>
          </div>
          <div className="text-4xl opacity-30 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
            🌍
          </div>
        </div>
        <div className="group flex items-center justify-between rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors dark:text-slate-500">
              Hoạt động tuần này
            </p>
            <h4 className="mt-1 text-3xl font-black text-slate-900 transition-colors dark:text-white">
              +{stats.newThisWeek}
            </h4>
          </div>
          <div className="animate-bounce-slow text-4xl transition-transform duration-500 group-hover:scale-125">
            ✨
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="animate-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl duration-300 dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 p-8 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Chi tiết bộ thẻ
                </h2>
                <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  ID: #{selectedDeck?.id}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-400"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-8">
              {modalLoading ? (
                <div className="flex flex-col items-center py-10">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500"></div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Đang tải...
                  </p>
                </div>
              ) : selectedDeck ? (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="mb-2 text-lg font-black text-slate-900 dark:text-white">
                      {selectedDeck.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {selectedDeck.description || 'Không có mô tả.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="px-2 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                      Danh sách thẻ ({selectedDeck.cards?.length})
                    </p>
                    {selectedDeck.cards?.map((card) => (
                      <div
                        key={card.id}
                        className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-5 md:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-indigo-400 uppercase dark:text-indigo-500">
                            Mặt trước
                          </span>
                          <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                            {card.front_content}
                          </p>
                          {card.front_image_url && (
                            <div className="mt-3 h-20 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                              <img
                                src={card.front_image_url}
                                alt="Front"
                                className="h-full w-full object-cover"
                                onError={(e) =>
                                  (e.target.style.display = 'none')
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col border-slate-100 md:border-l md:pl-4 dark:border-slate-700">
                          <span className="text-[9px] font-black text-emerald-400 uppercase dark:text-emerald-500">
                            Mặt sau
                          </span>
                          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                            {card.back_content}
                          </p>
                          {card.back_image_url && (
                            <div className="mt-3 h-20 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                              <img
                                src={card.back_image_url}
                                alt="Back"
                                className="h-full w-full object-cover"
                                onError={(e) =>
                                  (e.target.style.display = 'none')
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDecks;
