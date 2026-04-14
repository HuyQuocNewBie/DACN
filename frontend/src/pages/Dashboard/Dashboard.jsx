import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import userApi from '../../api/user.api';
import { handleError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Mỗi trang hiển thị 5 hoạt động

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userApi.getStatistics();
        setStats(data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const paginatedActivities = useMemo(() => {
    if (!stats?.recent_activities) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return stats.recent_activities.slice(startIndex, startIndex + itemsPerPage);
  }, [stats?.recent_activities, currentPage]);

  const totalPages = Math.ceil((stats?.recent_activities?.length || 0) / itemsPerPage);

  if (loading) return <Loading />;

  const chartData = [
    { name: 'Mới (New)', value: stats?.new_cards || 0, color: '#94a3b8' },
    { name: 'Đang học (Learning)', value: stats?.learning_cards || 0, color: '#4F46E5' },
    { name: 'Đã thuộc (Mastered)', value: stats?.mastered_cards || 0, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Tiến độ học tập
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Theo dõi quá trình rèn luyện trí nhớ của bạn mỗi ngày
          </p>
        </div>

        <button
          onClick={() => navigate('/decks')}
          className="text-xs font-black text-primary uppercase tracking-widest hover:text-indigo-700 flex items-center gap-2 transition-all group bg-primary/5 px-4 py-2 rounded-full"
        >
          Xem tất cả bộ thẻ 
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </button>
      </header>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tổng bộ thẻ */}
        <div
          onClick={() => navigate('/decks')}
          className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              Tổng bộ thẻ
            </p>
            <span className="p-3 bg-slate-50 rounded-2xl text-2xl group-hover:bg-primary/10 transition-colors">📚</span>
          </div>
          <p className="text-5xl font-black text-slate-900 mt-6 relative z-10">
            {stats?.total_decks || 0}
          </p>
          <div className="absolute -right-6 -bottom-6 text-primary/5 text-[120px] font-black rotate-12 group-hover:rotate-0 transition-all duration-500">
            #
          </div>
        </div>

        {/* Thẻ cần học */}
        <div
          onClick={() => navigate('/review')}
          className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-200 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-orange-500 transition-colors">
              Thẻ cần ôn tập
            </p>
            <span className="p-3 bg-orange-50 rounded-2xl text-2xl group-hover:bg-orange-100 transition-colors">⏳</span>
          </div>
          <div className="flex items-baseline gap-3 mt-6 relative z-10">
            <p className="text-5xl font-black text-orange-500">
              {stats?.due_today || 0}
            </p>
            {stats?.due_today > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-lg uppercase animate-bounce">
                Học ngay!
              </span>
            )}
          </div>
          <div className="absolute -right-6 -bottom-6 text-orange-500/5 text-[120px] font-black -rotate-12 group-hover:rotate-0 transition-all duration-500">
            !
          </div>
        </div>

        {/* Tỷ lệ ghi nhớ */}
        <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-green-500/5 hover:border-green-200 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-green-600 transition-colors">
              Tỷ lệ ghi nhớ
            </p>
            <span className="p-3 bg-green-50 rounded-2xl text-2xl group-hover:bg-green-100 transition-colors">🎯</span>
          </div>
          <p className="text-5xl font-black text-green-600 mt-6 relative z-10">
            {stats?.retention_rate || 0}%
          </p>
          <div className="absolute -right-6 -bottom-6 text-green-500/5 text-[120px] font-black rotate-45 group-hover:rotate-0 transition-all duration-500">
            %
          </div>
        </div>
      </div>

      {/* CALL TO ACTION BANNER */}
      {stats?.due_today > 0 && (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="flex items-center gap-6 text-center md:text-left relative z-10">
            <div className="text-5xl bg-white/10 p-4 rounded-3xl backdrop-blur-sm animate-pulse">🔥</div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Sẵn sàng bứt phá hôm nay?</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Bạn có <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-4">{stats.due_today} thẻ</span> cần xử lý.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/review')}
            className="whitespace-nowrap bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-[0.15em] relative z-10"
          >
            Bắt đầu ôn tập ngay
          </button>
        </div>
      )}

      {/* CHARTS & RECENT ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PIE CHART */}
        <div className="lg:col-span-5 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col min-h-112.5">
          <div className="mb-8">
             <h3 className="font-black text-slate-900 text-xl tracking-tight">Trạng thái thẻ học</h3>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Memory Distribution</p>
          </div>
          
          <div className="flex-1 w-full h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={12}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 20px'
                  }}
                />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-500 text-xs font-black uppercase tracking-widest ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIVITY LOG WITH PAGINATION */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">Hoạt động gần đây</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Your Learning Journey</p>
            </div>
            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">⚡</div>
          </div>

          <div className="relative flex-1 space-y-10 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-8 relative group">
                  <div className="w-6 h-6 rounded-full bg-white border-[6px] border-slate-100 group-hover:border-primary transition-colors shrink-0 z-10 shadow-sm"></div>
                  
                  <div className="flex-1 -mt-1.5 p-4 rounded-2xl group-hover:bg-slate-50 transition-colors">
                    <p className="text-slate-800 font-bold text-base leading-snug">{activity.content}</p>
                    <div className="text-slate-400 text-[11px] mt-2 flex items-center gap-2 font-black uppercase tracking-wider">
                        <span className="text-primary/40 leading-none">●</span>
                        {formatDate(activity.time)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="text-5xl opacity-20 grayscale">🏜️</div>
                <div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Nhật ký trống</p>
                  <p className="text-slate-300 text-xs mt-1">Mọi hành trình vạn dặm đều bắt đầu từ một tấm thẻ.</p>
                </div>
              </div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trang {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                  ←
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;