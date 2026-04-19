import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const CardForm = ({ initialData, onSubmit, onCancel }) => {
  // Đồng bộ key với Backend: front_content, back_content, front_image_url, back_image_url
  const [formData, setFormData] = useState(initialData || { 
    front_content: '', 
    back_content: '',
    front_image_url: '',
    back_image_url: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* MẶT TRƯỚC */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
        <Input 
          label="Nội dung mặt trước" 
          value={formData.front_content}
          onChange={(e) => setFormData({...formData, front_content: e.target.value})}
          required
          placeholder="Ví dụ: Apple là gì?"
        />
        <Input 
          label="Link ảnh mặt trước (tùy chọn)" 
          value={formData.front_image_url}
          onChange={(e) => setFormData({...formData, front_image_url: e.target.value})}
          placeholder="https://example.com/image.png"
        />
      </div>

      {/* MẶT SAU */}
      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">Nội dung mặt sau</label>
          <textarea 
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-25"
            value={formData.back_content}
            onChange={(e) => setFormData({...formData, back_content: e.target.value})}
            required
            placeholder="Ví dụ: Quả táo"
          />
        </div>
        <Input 
          label="Link ảnh mặt sau (tùy chọn)" 
          value={formData.back_image_url}
          onChange={(e) => setFormData({...formData, back_image_url: e.target.value})}
          placeholder="https://example.com/image.png"
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