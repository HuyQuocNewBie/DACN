const CardItem = ({ card, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mặt trước</span>
            <p className="text-slate-800 font-medium">{card.front}</p>
          </div>
          <div className="border-l md:pl-4 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mặt sau</span>
            <p className="text-slate-600">{card.back}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(card)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">✏️</button>
        <button onClick={() => onDelete(card.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">🗑️</button>
      </div>
    </div>
  );
};

export default CardItem;