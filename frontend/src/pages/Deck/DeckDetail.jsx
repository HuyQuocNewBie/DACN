import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import reviewApi from '../../api/review.api';
import { useParams, useNavigate } from 'react-router-dom';
import cardApi from '../../api/card.api';
import deckApi from '../../api/deck.api';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

const DeckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [cardsError, setCardsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [checkingReview, setCheckingReview] = useState(false);

  const [isEditDeckOpen, setIsEditDeckOpen] = useState(false);
  const [editDeckData, setEditDeckData] = useState({
    title: '',
    description: '',
    is_public: false,
  });

  const [newCard, setNewCard] = useState({
    front_content: '',
    back_content: '',
  });

  const isComponentMounted = useRef(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [deckRes, cardsRes] = await Promise.all([
        deckApi.getById(id),
        cardApi.getByDeckId(id),
      ]);

      if (isComponentMounted.current) {
        setDeck(deckRes || null);
        setCards(Array.isArray(cardsRes) ? cardsRes : []);
        setCardsError(false);
      }
    } catch {
      if (isComponentMounted.current) {
        toast.error('Không thể tải dữ liệu bộ thẻ', {
          id: 'fetch-detail-error',
        });
        setCardsError(true);
      }
    } finally {
      if (isComponentMounted.current) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    isComponentMounted.current = true;
    fetchData();

    return () => {
      isComponentMounted.current = false;
    };
  }, [fetchData]);

  useEffect(() => {
    if (deck) {
      setEditDeckData({
        title: deck.title || '',
        description: deck.description || '',
        is_public: deck.is_public || false,
      });
    }
  }, [deck]);

  const handleUpdateDeck = async (e) => {
    e.preventDefault();
    if (!editDeckData.title.trim())
      return toast.error('Vui lòng nhập tên bộ thẻ');
    setSubmitting(true);
    try {
      await deckApi.update(id, editDeckData);
      toast.success('Đã cập nhật bộ thẻ!');
      setIsEditDeckOpen(false);
      fetchData();
    } catch {
      toast.error('Lỗi khi cập nhật bộ thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (
      !window.confirm(
        'BẠN CÓ CHẮC KHÔNG? Toàn bộ thẻ bên trong sẽ bị xóa vĩnh viễn và không thể khôi phục!'
      )
    )
      return;
    try {
      await deckApi.delete(id);
      toast.success('Đã xóa bộ thẻ!');
      navigate('/decks');
    } catch {
      toast.error('Không thể xóa bộ thẻ');
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front_content.trim() || !newCard.back_content.trim()) {
      return toast.error('Vui lòng nhập đầy đủ hai mặt của thẻ');
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await cardApi.update(editingId, {
          front_content: newCard.front_content,
          back_content: newCard.back_content,
        });
        toast.success('Đã cập nhật thẻ!');
      } else {
        await cardApi.create({ ...newCard, deck_id: id });
        toast.success('Đã thêm thẻ mới thành công!');
      }
      setNewCard({ front_content: '', back_content: '' });
      setEditingId(null);
      fetchData();
    } catch {
      toast.error(editingId ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (card) => {
    setNewCard({
      front_content: card.front_content,
      back_content: card.back_content,
    });
    setEditingId(card.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewCard({ front_content: '', back_content: '' });
    setEditingId(null);
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Bạn có chắc muốn xóa thẻ này?')) return;
    try {
      await cardApi.delete(cardId);
      toast.success('Đã xóa thẻ');
      setCards((prev) => prev.filter((c) => c.id !== cardId));

      if (paginatedCards.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch {
      toast.error('Không thể xóa thẻ');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCards = useMemo(() => {
    if (!Array.isArray(cards)) return [];

    const query = searchQuery.toLowerCase();
    return cards.filter((card) => {
      const front = String(card.front_content || '').toLowerCase();
      const back = String(card.back_content || '').toLowerCase();
      return front.includes(query) || back.includes(query);
    });
  }, [cards, searchQuery]);

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCards.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCards, currentPage]);

  const handleStartReview = async () => {
    if (cards.length === 0) {
      return toast.error('Bộ thẻ này chưa có thẻ nào để ôn tập!');
    }

    setCheckingReview(true);
    try {
      const dueCards = await reviewApi.getDueCards(id);

      if (dueCards && dueCards.length > 0) {
        navigate(`/review/${id}`);
      } else {
        toast(
          'Tuyệt vời! Bạn đã hoàn thành hết các thẻ cần ôn tập cho hôm nay.',
          {
            icon: '🎉',
            style: {
              borderRadius: '16px',
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              padding: '16px',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }
        );
      }
    } catch {
      toast.error('Không thể kiểm tra lịch ôn tập');
    } finally {
      setCheckingReview(false);
    }
  };

  if (loading) return <Loading />;

  if (!deck) {
    return (
      <div className="animate-in fade-in space-y-8 duration-500">
        <button
          onClick={() => navigate('/decks')}
          className="flex w-fit items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
        >
          <span>←</span> Quay lại kho thẻ
        </button>

        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-rose-700">
            Không tìm thấy bộ thẻ
          </h2>
          <p className="mt-3 text-slate-600">
            Không thể tải bộ thẻ này. Vui lòng kiểm tra lại liên kết hoặc quay
            lại danh sách bộ thẻ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/decks')}
          className="flex w-fit items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
        >
          <span>←</span> Quay lại kho thẻ
        </button>

        <div className="relative flex flex-col gap-6 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl"></div>
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                {deck?.title}
              </h1>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black tracking-wider text-indigo-600 uppercase">
                {Array.isArray(cards) ? cards.length : deck?.cards_count || 0}{' '}
                thẻ
              </span>

              <div className="ml-4 flex gap-1 border-l border-slate-100 pl-4">
                <button
                  onClick={() => setIsEditDeckOpen(true)}
                  className="rounded-xl p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                  title="Sửa tên bộ thẻ"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteDeck}
                  className="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                  title="Xóa bộ thẻ"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p className="max-w-2xl leading-relaxed font-medium text-slate-500">
              {deck?.description || 'Bộ thẻ này chưa có mô tả.'}
            </p>
          </div>
          <button
            onClick={handleStartReview}
            disabled={cards.length === 0 || checkingReview}
            className="relative z-10 flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-10 py-4 font-black text-white shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {checkingReview ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang kiểm tra...
              </span>
            ) : (
              <>
                <span className="text-xl">▶</span>
                Bắt đầu ôn tập
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? 'Cập nhật thẻ' : 'Thêm thẻ nhanh'}
              </h3>
            </div>

            <form onSubmit={handleAddCard} className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Mặt trước (Câu hỏi)
                </label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Hello có nghĩa là gì?"
                  className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={newCard.front_content}
                  onChange={(e) =>
                    setNewCard({ ...newCard, front_content: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Mặt sau (Đáp án)
                </label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Xin chào"
                  className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={newCard.back_content}
                  onChange={(e) =>
                    setNewCard({ ...newCard, back_content: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl bg-slate-900 py-4 text-sm font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50"
                >
                  {submitting
                    ? 'Đang lưu...'
                    : editingId
                      ? 'Lưu cập nhật'
                      : 'Lưu vào bộ thẻ'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-2xl bg-slate-100 px-6 py-4 text-sm font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 active:scale-95"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-50 p-6 md:flex-row md:items-center">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                Danh sách thẻ
                <span className="font-normal text-slate-300">
                  ({filteredCards.length})
                </span>
              </h3>

              <div className="group relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-4 pl-11 text-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 md:w-64"
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    <th className="w-[30%] px-6 py-4 text-left">Mặt trước</th>
                    <th className="w-[30%] px-6 py-4 text-left">Mặt sau</th>
                    <th className="w-[20%] px-6 py-4 text-left">
                      Thời gian ôn
                    </th>
                    <th className="w-[20%] px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedCards.map((card) => (
                    <tr
                      key={card.id}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm leading-snug font-bold text-slate-700">
                          {card.front_content}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm leading-snug font-medium text-slate-500 italic">
                          {card.back_content}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span
                            className={`text-xs font-bold ${
                              new Date(card.next_review_date) <= new Date()
                                ? 'text-rose-500'
                                : 'text-emerald-500'
                            }`}
                          >
                            {new Date(card.next_review_date).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {card.review_interval > 0
                              ? `Khoảng cách: ${card.review_interval} ngày`
                              : 'Thẻ mới'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleEditClick(card)}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {cardsError ? (
              <div className="space-y-3 py-20 text-center">
                <div className="text-4xl text-rose-400">⚠️</div>
                <p className="text-sm font-medium text-rose-500">
                  Không thể tải nội dung thẻ. Vui lòng thử lại hoặc kiểm tra kết
                  nối API.
                </p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="space-y-3 py-20 text-center">
                <div className="text-4xl opacity-20 grayscale">📭</div>
                <p className="text-sm font-medium text-slate-400 italic">
                  Không tìm thấy nội dung yêu cầu
                </p>
              </div>
            ) : null}

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 p-6">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-xl border border-slate-100 bg-white p-3 transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-xl border border-slate-100 bg-white p-3 transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditDeckOpen && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-md duration-300">
          <div
            className="absolute inset-0"
            onClick={() => !submitting && setIsEditDeckOpen(false)}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-xl overflow-hidden rounded-[3rem] border border-white bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] duration-300">
            <div className="h-3 w-full bg-indigo-600"></div>

            <div className="p-10 md:p-12">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Cập nhật bộ thẻ
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditDeckOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:bg-red-50 hover:text-red-400 active:scale-90"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateDeck} className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Tên bộ thẻ học
                  </label>
                  <input
                    autoFocus
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10"
                    value={editDeckData.title}
                    onChange={(e) =>
                      setEditDeckData({
                        ...editDeckData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Mô tả bộ thẻ
                  </label>
                  <textarea
                    rows="3"
                    className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10"
                    value={editDeckData.description}
                    onChange={(e) =>
                      setEditDeckData({
                        ...editDeckData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-emerald-100 hover:bg-emerald-50"
                  onClick={() =>
                    setEditDeckData({
                      ...editDeckData,
                      is_public: !editDeckData.is_public,
                    })
                  }
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${editDeckData.is_public ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200 bg-white'}`}
                  >
                    {editDeckData.is_public && (
                      <span className="text-xs font-bold text-white">✓</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                      Công khai bộ thẻ
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-2xl bg-slate-900 py-5 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {submitting ? 'Đang xử lý...' : 'Lưu cập nhật'}
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

export default DeckDetail;
