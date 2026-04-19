const CardItem = ({ card, onEdit, onDelete }) => {
  // Hàm hiển thị thumbnail ảnh nếu có
  const renderThumbnail = (url) => {
    if (!url) return null;
    return (
      <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
        <img 
          src={url} 
          alt="Preview" 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error'; }} 
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preview Mặt trước */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mặt trước</span>
            <p className="text-slate-800 font-medium">{card.front_content}</p>
            {renderThumbnail(card.front_image_url)}
          </div>
          
          {/* Preview Mặt sau */}
          <div className="border-l md:pl-4 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mặt sau</span>
            <p className="text-slate-600">{card.back_content}</p>
            {renderThumbnail(card.back_image_url)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
        <button onClick={() => onEdit(card)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">✏️</button>
        <button onClick={() => onDelete(card.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">🗑️</button>
      </div>
    </div>
  );
};

export default CardItem;