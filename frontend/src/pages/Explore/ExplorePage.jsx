import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import deckApi from '../../api/deck.api';

const ExplorePage = () => {
  const [allDecks, setAllDecks] = useState([]);
  const [cloningId, setCloningId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isInitialMount = useRef(true);

  const fetchPublicDecks = useCallback(async (isMounted) => {
    setLoading(true);
    try {
      const data = await deckApi.getPublic();
      if (isMounted) {
        setAllDecks(data);
      }
    } catch {
      if (isMounted) {
        toast.error('Không thể tải danh sách bộ thẻ công khai', {
          id: 'fetch-decks-error',
        });
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchPublicDecks(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchPublicDecks]);

  const filteredDecks = useMemo(() => {
    return allDecks.filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allDecks]);

  const paginatedDecks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDecks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDecks, currentPage]);

  const totalPages = Math.ceil(filteredDecks.length / itemsPerPage);

  useEffect(() => {
    if (!isInitialMount.current) {
      setCurrentPage(1);
    } else {
      isInitialMount.current = false;
    }
  }, [searchQuery]);

  const handleDownload = async (deckId) => {
    if (cloningId) return;
    setCloningId(deckId);

    const clonePromise = deckApi.clone(deckId);

    toast.promise(
      clonePromise,
      {
        loading: 'Đang tải bộ thẻ về kho...',
        success: '🎉 Tải về thành công!',
        error: 'Tải bộ thẻ thất bại. Vui lòng thử lại.',
      },
      { id: 'clone-toast' }
    );

    try {
      const response = await clonePromise;

      if (response && response.was_incremented) {
        setAllDecks((prevDecks) =>
          prevDecks.map((deck) =>
            deck.id === deckId
              ? { ...deck, clones_count: parseInt(deck.clones_count || 0) + 1 }
              : deck
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCloningId(null);
    }
  };

  if (loading && allDecks.length === 0) {
    return <Loading />;
  }

  return (
    <div className="animate-in fade-in space-y-10 duration-500">
      {/* --- HEADER & SEARCH --- */}
      <div className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-colors duration-300 md:p-10 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl dark:bg-indigo-500/10"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 transition-colors duration-300 md:text-4xl dark:text-white">
            Khám phá cộng đồng
          </h1>
          <p className="mt-2 font-medium text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Tìm kiếm và học hỏi từ các bộ thẻ được chia sẻ
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-112.5">
          <span className="absolute top-1/2 left-5 -translate-y-1/2 text-xl opacity-40 dark:text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm bộ thẻ, chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-6 pl-14 font-medium text-slate-900 shadow-inner transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* --- GRID DECKS --- */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
{paginatedDecks.map((deck) => (
          <div
            key={deck.id}
            className="group hover:shadow-primary/10 dark:hover:border-primary/50 dark:hover:shadow-primary/20 relative flex h-full flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Decoration Blur */}
            <div className="group-hover:bg-primary/10 dark:group-hover:bg-primary/20 absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-slate-100 blur-2xl transition-colors duration-500 dark:bg-slate-800"></div>

            {/* Thêm min-w-0 vào thẻ div này */}
            <div className="relative z-10 min-w-0 flex-1">
              <div className="mb-6 flex items-start justify-between gap-2">
                
                {/* TÊN TÁC GIẢ (Gộp chung lên đầu, thay thế chữ Cộng Đồng) */}
                <span
                  className="flex max-w-[60%] items-center gap-1.5 rounded-xl border-2 border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black tracking-widest text-emerald-600 uppercase transition-colors duration-300 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  title={`Tác giả: ${deck.author_name || 'Ẩn danh'}`}
                >
                  <span className="shrink-0 text-xs">👤</span>
                  <span className="truncate">{deck.author_name || 'Ẩn danh'}</span>
                </span>

                <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-colors duration-300">
                  {deck.cards_count || 0} Thẻ
                </span>
              </div>

              {/* TIÊU ĐỀ: Cắt 1 dòng, break-all và hiện tooltip */}
              <h3
                className="group-hover:text-primary dark:group-hover:text-primary mb-3 line-clamp-1 text-2xl leading-tight font-black break-all text-slate-900 transition-colors duration-300 dark:text-white"
                title={deck.title}
              >
                {deck.title}
              </h3>

              {/* MÔ TẢ: Cắt 3 dòng, break-all và hiện tooltip (đã xóa mb-4 để sát phần Divider) */}
              <p
                className="line-clamp-3 text-sm leading-relaxed font-medium break-all text-slate-400 italic transition-colors duration-300"
                title={deck.description || 'Chưa có mô tả cho nội dung này.'}
              >
                {deck.description || 'Chưa có mô tả cho nội dung này.'}
              </p>
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-50 transition-colors duration-300 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-800 transition-colors duration-300 dark:text-slate-200">
                  {deck.clones_count || 0}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase transition-colors duration-300 dark:text-slate-500">
                  Lượt tải
                </span>
              </div>

              <button
                onClick={() => handleDownload(deck.id)}
                disabled={cloningId !== null}
                className="hover:bg-primary hover:shadow-primary/30 dark:hover:bg-primary rounded-2xl bg-slate-900 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 dark:bg-slate-800 dark:shadow-none dark:hover:shadow-none"
              >
                {cloningId === deck.id ? 'Đang sao chép' : 'Tải về'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
                    ? 'dark:bg-primary bg-slate-900 text-white shadow-lg shadow-slate-200 dark:text-white dark:shadow-none'
                    : 'border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {filteredDecks.length === 0 && !loading && (
        <div className="flex flex-col items-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white py-24 text-center transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 text-6xl opacity-20 grayscale">🏜️</div>
          <p className="text-sm font-black tracking-widest text-slate-400 uppercase transition-colors dark:text-slate-500">
            Không tìm thấy kết quả
          </p>
          <p className="mt-2 text-sm text-slate-300 transition-colors dark:text-slate-600">
            Thử thay đổi từ khóa tìm kiếm nhé!
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-primary dark:text-primary mt-6 font-medium hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
