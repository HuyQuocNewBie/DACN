import { useEffect, useState, useCallback } from 'react';
import deckApi from '../../api/deck.api';
import DeckItem from '../../components/deck/DeckItem';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { toast } from 'react-hot-toast';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeck, setNewDeck] = useState({ title: '', description: '', color: '#4F46E5' });

  const fetchDecks = useCallback(async () => {
    try {
      const data = await deckApi.getAll();
      setDecks(data);
    } catch (error) {
      // Sử dụng biến error để log ra console, giúp fix lỗi nhanh hơn
      console.error("Lỗi khi tải bộ thẻ:", error);
      toast.error("Không thể tải danh sách bộ thẻ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const createdDeck = { 
      ...newDeck, 
      id: Date.now(), 
      cards_count: 0 
    };
    setDecks([createdDeck, ...decks]);
    setIsModalOpen(false);
    setNewDeck({ title: '', description: '', color: '#4F46E5' });
    toast.success('Đã tạo bộ thẻ mới!');
  };

  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc muốn xóa bộ thẻ này?")) {
      setDecks(decks.filter(d => d.id !== id));
      toast.success('Đã xóa bộ thẻ');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bộ thẻ của tôi</h1>
          <p className="text-slate-500 text-sm">Quản lý và tạo mới các chủ đề học tập</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Thêm bộ thẻ</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map(deck => (
          <DeckItem key={deck.id} deck={deck} onDelete={handleDelete} />
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tạo bộ thẻ mới"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input 
            label="Tên bộ thẻ" 
            placeholder="Ví dụ: Tiếng Anh chuyên ngành" 
            required 
            value={newDeck.title}
            onChange={e => setNewDeck({...newDeck, title: e.target.value})}
          />
          <Input 
            label="Mô tả" 
            placeholder="Nhập mô tả ngắn gọn..." 
            value={newDeck.description}
            onChange={e => setNewDeck({...newDeck, description: e.target.value})}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Màu chủ đề</label>
            <input 
              type="color" 
              className="w-full h-10 rounded-lg cursor-pointer border-none"
              value={newDeck.color}
              onChange={e => setNewDeck({...newDeck, color: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full mt-4 shadow-lg shadow-primary/30">
            Xác nhận tạo
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DeckList;