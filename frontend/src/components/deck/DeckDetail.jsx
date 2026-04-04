import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import CardItem from '../../components/card/CardItem';
import Modal from '../../components/common/Modal';
import CardForm from '../../components/card/CardForm';
import EmptyState from '../../components/common/EmptyState';

const DeckDetail = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, front: "Hello", back: "Xin chào" },
    { id: 2, front: "World", back: "Thế giới" }
  ]);

  const handleAddCard = (data) => {
    setCards([...cards, { ...data, id: Date.now() }]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/decks')} className="text-slate-400 hover:text-primary">← Quay lại</button>
        <h1 className="text-2xl font-bold text-slate-800">Chi tiết bộ thẻ #{deckId}</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border flex justify-between items-center">
        <div>
          <p className="text-slate-500">Số lượng thẻ: <strong>{cards.length}</strong></p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/review/${deckId}`)} variant="outline">Học ngay</Button>
          <Button onClick={() => setIsModalOpen(true)}>+ Thêm thẻ</Button>
        </div>
      </div>

      <div className="space-y-3">
        {cards.length > 0 ? (
          cards.map(card => (
            <CardItem key={card.id} card={card} onDelete={(id) => setCards(cards.filter(c => c.id !== id))} />
          ))
        ) : (
          <EmptyState message="Bộ thẻ này đang trống" />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm thẻ mới">
        <CardForm onSubmit={handleAddCard} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DeckDetail;