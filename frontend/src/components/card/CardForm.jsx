import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const CardForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || { front: '', back: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Câu hỏi (Mặt trước)" 
        value={formData.front}
        onChange={(e) => setFormData({...formData, front: e.target.value})}
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-700">Câu trả lời (Mặt sau)</label>
        <textarea 
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-100px"
          value={formData.back}
          onChange={(e) => setFormData({...formData, back: e.target.value})}
          required
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">Lưu thẻ</Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">Hủy</Button>
      </div>
    </form>
  );
};

export default CardForm;