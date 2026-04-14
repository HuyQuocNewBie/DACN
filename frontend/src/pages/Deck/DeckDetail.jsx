import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [isEditDeckOpen, setIsEditDeckOpen] = useState(false);
  const [editDeckData, setEditDeckData] = useState({ title: '', description: '', is_public: false });

  const [newCard, setNewCard] = useState({
    front_content: '',
    back_content: '',
  });

  const hasFetched = useRef({});
  const isComponentMounted = useRef(true); // Dùng ref để theo dõi trạng thái mount xuyên suốt

  // ================= FETCH DATA (Dùng để refresh danh sách) =================
  const fetchData = useCallback(async () => {
    try {
      const [deckRes, cardsRes] = await Promise.all([
        deckApi.getById(id),
        cardApi.getByDeckId(id),
      ]);
      if (isComponentMounted.current) {
        setDeck(deckRes);
        setCards(cardsRes);
      }
    } catch {
      if (isComponentMounted.current) {
        // Thêm ID để tránh lặp thông báo khi refresh
        toast.error('Không thể tải lại dữ liệu', { id: 'fetch-detail-error' });
      }
    }
  }, [id]);

  // ================= INITIAL LOAD (Xử lý Strict Mode & Mount/Unmount) =================
  useEffect(() => {
    isComponentMounted.current = true;
    
    const loadData = async () => {
      // Chống lặp do Strict Mode bằng ref
      if (hasFetched.current[id]) return;
      hasFetched.current[id] = true;

      try {
        setLoading(true);
        const [deckRes, cardsRes] = await Promise.all([
          deckApi.getById(id),
          cardApi.getByDeckId(id),
        ]);
        
        if (isComponentMounted.current) {
          setDeck(deckRes);
          setCards(cardsRes);
        }
      } catch {
        if (isComponentMounted.current) {
          toast.error('Không thể tải dữ liệu bộ thẻ', { id: 'fetch-detail-error' });
        }
        hasFetched.current[id] = false; // Cho phép thử lại nếu lỗi
      } finally {
        if (isComponentMounted.current) setLoading(false);
      }
    };

    loadData();

    return () => {
      isComponentMounted.current = false;
    };
  }, [id]);

  useEffect(() => {
    if (deck) {
       setEditDeckData({ 
         title: deck.title || '', 
         description: deck.description || '', 
         is_public: deck.is_public || false 
       });
    }
  }, [deck]);

  // ================= DECK ACTIONS =================
  const handleUpdateDeck = async (e) => {
    e.preventDefault();
    if (!editDeckData.title.trim()) return toast.error('Vui lòng nhập tên bộ thẻ');
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
    if (!window.confirm("BẠN CÓ CHẮC KHÔNG? Toàn bộ thẻ bên trong sẽ bị xóa vĩnh viễn và không thể khôi phục!")) return;
    try {
       await deckApi.delete(id);
       toast.success('Đã xóa bộ thẻ!');
       navigate('/decks');
    } catch {
       toast.error('Không thể xóa bộ thẻ');
    }
  };

  // ================= ACTIONS =================
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
           back_content: newCard.back_content 
         });
         toast.success('Đã cập nhật thẻ!');
      } else {
         await cardApi.create({ ...newCard, deck_id: id });
         toast.success('Đã thêm thẻ mới thành công!');
      }
      setNewCard({ front_content: '', back_content: '' });
      setEditingId(null);
      fetchData(); // Gọi hàm refresh đã tối ưu
    } catch {
      toast.error(editingId ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (card) => {
    setNewCard({ front_content: card.front_content, back_content: card.back_content });
    setEditingId(card.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên để người dùng thấy form edit
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
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch {
      toast.error('Không thể xóa thẻ');
    }
  };

  // ================= FILTER =================
  const filteredCards = cards.filter((card) =>
    card.front_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back_content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BACK BUTTON & HEADER */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/decks')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors w-fit"
        >
          <span>←</span> Quay lại kho thẻ
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {deck?.title}
              </h1>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                {cards.length} thẻ
              </span>
              <div className="flex gap-1 ml-4 border-l border-slate-100 pl-4">
                  <button onClick={() => setIsEditDeckOpen(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Sửa tên bộ thẻ">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                       </svg>
                  </button>
                  <button onClick={handleDeleteDeck} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa bộ thẻ">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                  </button>
              </div>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              {deck?.description || 'Bộ thẻ này chưa có mô tả.'}
            </p>
          </div>

          <button 
            onClick={() => navigate(`/review/${id}`)}
            disabled={cards.length === 0}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale cursor-pointer"
          >
            <span className="text-xl">▶</span>
            Bắt đầu ôn tập
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: ADD NEW CARD FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Cập nhật thẻ' : 'Thêm thẻ nhanh'}</h3>
            </div>

            <form onSubmit={handleAddCard} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mặt trước (Câu hỏi)</label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Hello có nghĩa là gì?"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm font-medium"
                  value={newCard.front_content}
                  onChange={(e) => setNewCard({ ...newCard, front_content: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mặt sau (Đáp án)</label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Xin chào"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm font-medium"
                  value={newCard.back_content}
                  onChange={(e) => setNewCard({ ...newCard, back_content: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 rounded-2xl font-black text-white bg-slate-900 shadow-lg hover:bg-primary transition-all disabled:opacity-50 active:scale-95 text-sm uppercase tracking-widest"
                >
                  {submitting ? 'Đang lưu...' : (editingId ? 'Lưu cập nhật' : 'Lưu vào bộ thẻ')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-4 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 text-sm uppercase tracking-widest"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: CARD LIST TABLE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* SEARCH & TITLE */}
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Danh sách thẻ
                <span className="text-slate-300 font-normal">({filteredCards.length})</span>
              </h3>

              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4 text-left">Mặt trước</th>
                    <th className="px-6 py-4 text-left">Mặt sau</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCards.map((card) => (
                    <tr key={card.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700 leading-snug">{card.front_content}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-500 font-medium italic leading-snug">{card.back_content}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(card)}
                            className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY STATE */}
            {filteredCards.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <div className="text-4xl grayscale opacity-20">📭</div>
                <p className="text-slate-400 text-sm font-medium italic">Không tìm thấy nội dung yêu cầu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EDIT DECK */}
      {isEditDeckOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0"
            onClick={() => !submitting && setIsEditDeckOpen(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            <div className="h-3 bg-primary w-full"></div>
            
            <div className="p-10 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cập nhật bộ thẻ</h2>
                </div>
                <button
                  onClick={() => setIsEditDeckOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-all active:scale-90"
                >✕</button>
              </div>

              <form onSubmit={handleUpdateDeck} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên bộ thẻ học</label>
                  <input
                    autoFocus
                    className="w-full bg-slate-50 rounded-2xl py-4 px-6 border border-slate-100 focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-700"
                    value={editDeckData.title}
                    onChange={(e) => setEditDeckData({ ...editDeckData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả bộ thẻ</label>
                  <textarea
                    rows="3"
                    className="w-full bg-slate-50 rounded-2xl py-4 px-6 border border-slate-100 focus:ring-4 focus:ring-primary/10 outline-none resize-none font-medium text-slate-600"
                    value={editDeckData.description}
                    onChange={(e) => setEditDeckData({ ...editDeckData, description: e.target.value })}
                  />
                </div>

                <div 
                    className="group flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-all"
                    onClick={() => setEditDeckData({...editDeckData, is_public: !editDeckData.is_public})}
                >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${editDeckData.is_public ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'}`}>
                        {editDeckData.is_public && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">Công khai bộ thẻ</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl hover:bg-primary disabled:opacity-50 transition-all uppercase tracking-[0.2em] text-xs"
                  >
                    {submitting ? "Đang xử lý..." : "Lưu cập nhật"}
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