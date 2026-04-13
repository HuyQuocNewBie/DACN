import { useEffect, useState } from 'react';
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

  const fetchDecks = async () => {
    try {
      const data = await deckApi.getAll();
      setDecks(data);
    } catch {
      toast.error('Không thể tải danh sách bộ thẻ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeck.title.trim()) return toast.error('Vui lòng nhập tên bộ thẻ');

    setSubmitting(true);
    try {
      await deckApi.create(newDeck);
      toast.success('Tạo bộ thẻ thành công! 🎉');
      setIsModalOpen(false);
      setNewDeck({ title: '', description: '', is_public: false });
      fetchDecks();
    } catch {
      toast.error('Không thể tạo bộ thẻ!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && decks.length === 0) return <Loading />;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Trang trí nhẹ ở góc */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Bộ thẻ của tôi
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Nơi lưu trữ và quản lý kho tàng kiến thức của bạn.
          </p>
        </div>

        <div className="relative w-full lg:w-112.5 z-10">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm bộ thẻ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* ADD NEW DECK BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center rounded-4xl p-10 min-h-62.5 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="bg-slate-50 group-hover:bg-primary group-hover:scale-110 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-500 shadow-sm relative z-10">
            <span className="text-4xl text-slate-400 group-hover:text-white transition-colors">+</span>
          </div>
          <span className="text-slate-400 group-hover:text-primary mt-6 font-black uppercase tracking-widest text-xs relative z-10">
            Tạo bộ thẻ mới
          </span>
        </button>

        {/* LIST DECKS */}
        {filteredDecks.map((deck) => (
          <div
            key={deck.id}
            className="group bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 p-8 flex flex-col h-full relative overflow-hidden"
          >
            {/* Trang trí background card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-500"></div>

            <div className="flex-1 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border-2 ${
                  deck.is_public 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                    : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {deck.is_public ? 'Công khai' : 'Riêng tư'}
                </span>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                  {deck.cards_count || 0} Cards
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                {deck.title}
              </h3>

              <p className="text-sm text-slate-400 font-medium line-clamp-2 italic leading-relaxed">
                {deck.description || 'Chưa có mô tả cho nội dung này.'}
              </p>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50 relative z-10">
              <Link
                to={`/decks/${deck.id}`}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-primary transition-colors"
              >
                Chi tiết bộ thẻ
                <span className="text-xl leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors group-hover:animate-ping"></div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredDecks.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center">
          <div className="text-6xl mb-6 grayscale opacity-20">🗂️</div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Không tìm thấy kết quả</p>
          <p className="text-slate-300 text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc tạo bộ thẻ mới nhé!</p>
        </div>
      )}

      {/* MODAL CREATE DECK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            {/* Modal Decor */}
            <div className="h-3 bg-primary w-full"></div>
            
            <div className="p-10 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tạo bộ thẻ mới</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Bắt đầu hành trình chinh phục kiến thức</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-all active:scale-90"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDeck} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên bộ thẻ học</label>
                  <input
                    autoFocus
                    className="w-full bg-slate-50 rounded-2xl py-4 px-6 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"
                    placeholder="vd: 3000 từ vựng Oxford..."
                    value={newDeck.title}
                    onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả bộ thẻ</label>
                  <textarea
                    rows="3"
                    className="w-full bg-slate-50 rounded-2xl py-4 px-6 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium text-slate-600"
                    placeholder="Bộ thẻ này dùng để ôn tập..."
                    value={newDeck.description}
                    onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  />
                </div>

                <div 
                    className="group flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-all"
                    onClick={() => setNewDeck({...newDeck, is_public: !newDeck.is_public})}
                >
                   <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${newDeck.is_public ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'}`}>
                        {newDeck.is_public && <span className="text-white text-xs font-bold">✓</span>}
                   </div>
                   <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">Công khai bộ thẻ</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider group-hover:text-emerald-500 transition-colors">Chia sẻ kiến thức với mọi người</p>
                   </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-200 hover:bg-primary hover:shadow-primary/30 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                  >
                    {submitting ? "Đang xử lý..." : "Xác nhận tạo"}
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