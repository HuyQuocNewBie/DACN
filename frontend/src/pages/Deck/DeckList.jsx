import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import deckApi from '../../api/deck.api';
import Loading from '../../components/common/Loading';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDeck, setNewDeck] = useState({
    title: '',
    description: '',
    is_public: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDecks = useCallback(async (isMounted = true) => {
    try {
      const data = await deckApi.getAll();
      if (isMounted) {
        setDecks(data);
      }
    } catch {
      if (isMounted) {
        toast.error('Không thể tải danh sách bộ thẻ', {
          id: 'fetch-decks-error',
        });
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchDecks(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchDecks]);

  const filteredDecks = useMemo(() => {
    return decks.filter(
      (deck) =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deck.description || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [decks, searchQuery]);

  const paginatedDecks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDecks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDecks, currentPage]);

  const totalPages = Math.ceil(filteredDecks.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeck.title.trim()) return toast.error('Vui lòng nhập tên bộ thẻ');

    setSubmitting(true);
    try {
      await deckApi.create(newDeck);
      toast.success('Tạo bộ thẻ thành công! 🎉');
      setIsModalOpen(false);
      setNewDeck({ title: '', description: '', is_public: false });
      fetchDecks(true);
    } catch {
      toast.error('Không thể tạo bộ thẻ!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && decks.length === 0) return <Loading />;

  return (
    <div className="animate-in fade-in space-y-10 duration-500">
      {/* --- HEADER & SEARCH --- */}
      <div className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-colors duration-300 md:p-10 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl dark:bg-indigo-500/10"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 transition-colors duration-300 md:text-4xl dark:text-white">
            Bộ thẻ của tôi
          </h1>
          <p className="mt-2 font-medium text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Nơi lưu trữ và quản lý kho tàng kiến thức của bạn.
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-112.5">
          <span className="absolute top-1/2 left-5 -translate-y-1/2 text-xl opacity-40 dark:text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm bộ thẻ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-6 pl-14 font-medium text-slate-900 shadow-inner transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {/* --- NÚT TẠO BỘ THẺ MỚI --- */}
        {currentPage === 1 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex min-h-62.5 flex-col items-center justify-center overflow-hidden rounded-4xl border-2 border-dashed border-slate-200 p-10 transition-all duration-500 hover:border-indigo-500 hover:bg-indigo-50/30 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10"
          >
            <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-indigo-500/10"></div>
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-500 dark:bg-slate-800 dark:group-hover:bg-indigo-500">
              <span className="text-4xl text-slate-400 transition-colors group-hover:text-white dark:text-slate-500">
                +
              </span>
            </div>
            <span className="relative z-10 mt-6 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400">
              Tạo bộ thẻ mới
            </span>
          </button>
        )}

        {/* --- DANH SÁCH BỘ THẺ --- */}
        {paginatedDecks.map((deck) => (
          <div
            key={deck.id}
            className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-indigo-500/20"
          >
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-slate-100 blur-2xl transition-colors duration-500 group-hover:bg-indigo-500/10 dark:bg-slate-800 dark:group-hover:bg-indigo-500/20"></div>

            <div className="relative z-10 flex-1">
              <div className="mb-6 flex items-start justify-between">
                <span
                  className={`rounded-xl border-2 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase transition-colors duration-300 ${
                    deck.is_public
                      ? 'border-emerald-100/50 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {deck.is_public ? 'Công khai' : 'Riêng tư'}
                </span>
                <span className="rounded-xl bg-indigo-50 px-3 py-1.5 text-[10px] font-black tracking-widest text-indigo-600 uppercase transition-colors duration-300 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {deck.cards_count || 0} Thẻ
                </span>
              </div>

              <h3 className="mb-3 line-clamp-1 text-2xl leading-tight font-black text-slate-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {deck.title}
              </h3>

              <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-400 italic transition-colors duration-300">
                {deck.description || 'Chưa có mô tả cho nội dung này.'}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between border-t border-slate-50 pt-6 transition-colors duration-300 dark:border-slate-800">
              <Link
                to={`/decks/${deck.id}`}
                className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-900 uppercase transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
              >
                Chi tiết bộ thẻ
                <span className="text-xl leading-none transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <div className="h-2 w-2 rounded-full bg-slate-200 transition-colors group-hover:animate-ping group-hover:bg-indigo-500 dark:bg-slate-700"></div>
            </div>
          </div>
        ))}
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ←
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-12 w-12 rounded-2xl text-xs font-black transition-all ${
                  currentPage === i + 1
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 dark:bg-primary dark:text-white dark:shadow-none'
                    : 'border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!loading && filteredDecks.length === 0 && (
        <div className="flex flex-col items-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white py-24 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-6 text-6xl opacity-20 grayscale">🗂️</div>
          <p className="text-sm font-black tracking-widest text-slate-400 uppercase transition-colors dark:text-slate-500">
            Không tìm thấy kết quả
          </p>
          <p className="mt-2 text-sm text-slate-300 transition-colors dark:text-slate-400">
            Thử thay đổi từ khóa tìm kiếm hoặc tạo bộ thẻ mới nhé!
          </p>
        </div>
      )}

      {/* --- MODAL TẠO BỘ THẺ --- */}
      {isModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-md duration-300 dark:bg-slate-900/60">
          <div
            className="absolute inset-0"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-xl overflow-hidden rounded-[3rem] border border-white bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="h-3 w-full bg-indigo-600 dark:bg-indigo-500"></div>
            <div className="p-10 md:p-12">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Tạo bộ thẻ mới
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-400 dark:text-slate-400">
                    Bắt đầu hành trình chinh phục kiến thức
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:bg-red-50 hover:text-red-400 active:scale-90 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateDeck} className="space-y-6">
                
                {/* Input Tên bộ thẻ */}
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Tên bộ thẻ học
                  </label>
                  <input
                    autoFocus
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold text-slate-700 transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                    placeholder="vd: 3000 từ vựng Oxford..."
                    value={newDeck.title}
                    onChange={(e) =>
                      setNewDeck({ ...newDeck, title: e.target.value })
                    }
                  />
                </div>

                {/* Textarea Mô tả */}
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Mô tả bộ thẻ
                  </label>
                  <textarea
                    rows="3"
                    className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-medium text-slate-600 transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                    placeholder="Bộ thẻ này dùng để ôn tập..."
                    value={newDeck.description}
                    onChange={(e) =>
                      setNewDeck({ ...newDeck, description: e.target.value })
                    }
                  />
                </div>

                {/* Toggle Trạng thái Công khai/Riêng tư */}
                <div
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-emerald-100 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-emerald-500/20 dark:hover:bg-emerald-500/10"
                  onClick={() =>
                    setNewDeck({ ...newDeck, is_public: !newDeck.is_public })
                  }
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${
                      newDeck.is_public 
                        ? 'border-emerald-500 bg-emerald-500' 
                        : 'border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900'
                    }`}
                  >
                    {newDeck.is_public && (
                      <span className="text-xs font-bold text-white">✓</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 transition-colors group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-400">
                      Công khai bộ thẻ
                    </p>
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase transition-colors group-hover:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-500">
                      Chia sẻ kiến thức với mọi người
                    </p>
                  </div>
                </div>

                {/* Nút Submit */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-2xl bg-slate-900 py-5 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-slate-200 transition-all hover:bg-indigo-600 hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-50 dark:bg-indigo-600 dark:shadow-none dark:hover:bg-indigo-500"
                  >
                    {submitting ? 'Đang xử lý...' : 'Xác nhận tạo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckList;