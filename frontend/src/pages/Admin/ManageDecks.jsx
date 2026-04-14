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
  
  // --- STATE TÌM KIẾM & LỌC ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State cho Modal chi tiết
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // 1. Lấy danh sách bộ thẻ
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

  // --- LOGIC TÍNH TOÁN THỐNG KÊ (DỰA TRÊN DATA THẬT) ---
  const stats = useMemo(() => {
    if (!decks.length) return { avgCards: 0, publicRate: 0, newThisWeek: 0 };
    
    const totalCards = decks.reduce((sum, d) => sum + (Number(d.cards_count) || 0), 0);
    const publicCount = decks.filter(d => Number(d.is_public) === 1).length;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newCount = decks.filter(d => d.createdAt && new Date(d.createdAt) > sevenDaysAgo).length;

    return {
      avgCards: Math.round(totalCards / decks.length),
      publicRate: Math.round((publicCount / decks.length) * 100),
      newThisWeek: newCount || decks.length
    };
  }, [decks]);

  // 2. Khóa / Mở khóa
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

  // 3. Xem chi tiết
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

  // 4. Xóa bộ thẻ
  const handleDeleteDeck = async (id) => {
    if (!window.confirm('Xóa vĩnh viễn bộ thẻ này? Thao tác này không thể hoàn tác.')) return;
    try {
      await adminApi.deleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
      toast.success('Đã xóa bộ thẻ');
    } catch {
      toast.error('Lỗi khi xóa bộ thẻ');
    }
  };

  // --- LOGIC LỌC, TÌM KIẾM VÀ PHÂN TRANG ---
  const filteredDecks = decks.filter((deck) => {
    // Tìm kiếm theo tên hoặc tác giả
    const matchSearch = 
      deck.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      deck.creator?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;

    // Lọc theo trạng thái
    if (filter === 'public') return Number(deck.is_public) === 1;
    if (filter === 'private') return Number(deck.is_public) === 0;
    return true;
  });

  const totalPages = Math.ceil(filteredDecks.length / itemsPerPage);
  const currentDecks = filteredDecks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (key) => {
    setFilter(key);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Lấy ra thông tin filter hiện tại để hiển thị lên nút
  const activeFilter = FILTERS.find(f => f.key === filter);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative">
        {/* Lớp nền chứa hiệu ứng mờ (tách riêng để không gài overflow-hidden vào khung cha gây cắt mép Dropdown) */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>

        {/* Tiêu đề */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Kho bộ thẻ</h1>
          <p className="text-slate-500 font-medium mt-1">
            Kiểm duyệt và điều phối nội dung học tập cộng đồng
          </p>
        </div>

        {/* Cụm công cụ: Tìm kiếm + Lọc Dropdown */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          
          {/* Thanh tìm kiếm */}
          <div className="relative w-full sm:w-72">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 opacity-40">🔍</span>
            <input
              type="text"
              placeholder="Tìm tên, tác giả..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="focus:ring-indigo-500/10 focus:border-indigo-500 w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pr-4 pl-12 text-sm font-medium shadow-inner transition-all outline-none focus:bg-white focus:ring-4"
            />
          </div>

          {/* Dropdown Lọc */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-3 px-6 py-3.5 w-full sm:w-40 text-xs font-black uppercase tracking-widest bg-white border border-slate-100 shadow-sm rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <span className="flex items-center gap-2">
                <span>{activeFilter?.emoji}</span> {activeFilter?.label}
              </span>
              <span className={`text-[10px] text-slate-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Menu Dropdown */}
            {isFilterOpen && (
              <>
                {/* Backdrop ẩn để click ra ngoài thì đóng */}
                <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)}></div>
                
                <div className="absolute right-0 top-full mt-2 w-full sm:w-45 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => handleFilterChange(f.key)}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                        filter === f.key 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-slate-600 hover:bg-slate-50'
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

      {/* 2. TABLE CONTENT */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden px-4 pb-8">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-6 text-left">Thông tin bộ thẻ</th>
                <th className="px-6 py-6 text-left">Tác giả</th>
                <th className="px-6 py-6 text-center">Số lượng</th>
                <th className="px-6 py-6 text-center">Trạng thái</th>
                <th className="px-6 py-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentDecks.map((deck) => (
                <tr key={deck.id} className="group bg-white hover:bg-slate-50/50 transition-all border border-transparent hover:border-slate-100 rounded-2xl">
                  <td className="px-6 py-5 rounded-l-2xl border-y border-l border-transparent group-hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                        {deck.title?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm line-clamp-1">{deck.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-tight">ID: #{deck.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 border-y border-transparent group-hover:border-slate-100">
                    <span className="text-xs text-slate-500 font-bold">{deck.creator || 'Ẩn danh'}</span>
                  </td>
                  <td className="px-6 py-5 text-center border-y border-transparent group-hover:border-slate-100">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black">{deck.cards_count} thẻ</span>
                  </td>
                  <td className="px-6 py-5 text-center border-y border-transparent group-hover:border-slate-100">
                    <button
                      onClick={() => handleToggleStatus(deck)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        Number(deck.is_public) === 1 
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                          : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`}
                    >
                      {Number(deck.is_public) === 1 ? '🌍 Public' : '🔒 Private'}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-100">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewDetails(deck.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
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

        {/* PAGINATION */}
        {filteredDecks.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 disabled:opacity-20 hover:bg-slate-50 transition-all font-bold"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 disabled:opacity-20 hover:bg-slate-50 transition-all font-bold"
            >
              →
            </button>
          </div>
        )}

        {filteredDecks.length === 0 && (
          <div className="py-24 text-center">
            <div className="mb-4 text-6xl opacity-20 grayscale">🔍</div>
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Không tìm thấy dữ liệu
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              Hãy thử thay đổi từ khóa hoặc bộ lọc xem sao!
            </p>
          </div>
        )}
      </div>

      {/* 3. DECORATIVE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Quy mô trung bình</p>
                <h4 className="text-3xl font-black mt-1">{stats.avgCards} thẻ/bộ</h4>
              </div>
              <div className="text-4xl opacity-20 group-hover:scale-125 transition-transform duration-500">📈</div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group shadow-sm">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỉ lệ công khai</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{stats.publicRate}%</h4>
              </div>
              <div className="w-12 h-12 rounded-full border-[6px] border-emerald-500 border-t-transparent animate-[spin_3s_linear_infinite]"></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group shadow-sm">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoạt động tuần này</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">+{stats.newThisWeek}</h4>
              </div>
              <div className="text-4xl animate-bounce-slow group-hover:scale-125 transition-transform duration-500">✨</div>
          </div>
      </div>

      {/* 4. MODAL CHI TIẾT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Chi tiết bộ thẻ</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">ID: #{selectedDeck?.id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors">✕</button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {modalLoading ? (
                <div className="flex flex-col items-center py-10">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Đang tải...</p>
                </div>
              ) : selectedDeck ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h3 className="font-black text-slate-900 text-lg mb-2">{selectedDeck.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{selectedDeck.description || 'Không có mô tả.'}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Danh sách thẻ ({selectedDeck.cards?.length})</p>
                    {selectedDeck.cards?.map((card) => (
                      <div key={card.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white border border-slate-100 rounded-2xl">
                        <div>
                          <span className="text-[9px] font-black text-indigo-400 uppercase">Mặt trước</span>
                          <p className="text-sm font-bold text-slate-700 mt-1">{card.front_content}</p>
                        </div>
                        <div className="md:border-l md:pl-4 border-slate-100">
                          <span className="text-[9px] font-black text-emerald-400 uppercase">Mặt sau</span>
                          <p className="text-sm font-medium text-slate-600 mt-1">{card.back_content}</p>
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