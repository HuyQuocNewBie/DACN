import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ thêm
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import userApi from '../../api/user.api';
import { handleError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ thêm

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loading />;

  const chartData = [
    { name: 'Mới (New)', value: stats?.new_cards || 0, color: '#94a3b8' },
    { name: 'Đang học (Learning)', value: stats?.learning_cards || 0, color: '#4F46E5' },
    { name: 'Đã thuộc (Mastered)', value: stats?.mastered_cards || 0, color: '#10b981' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-2">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 italic">Tiến độ học tập</h1>
          <p className="text-slate-500 text-sm">Theo dõi quá trình rèn luyện trí nhớ của bạn</p>
        </div>

        {/* Nút đi đến Deck */}
        <button
          onClick={() => navigate('/decks')}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Xem tất cả bộ thẻ →
        </button>
      </header>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tổng bộ thẻ */}
        <div
          onClick={() => navigate('/decks')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider group-hover:text-primary">
              Tổng bộ thẻ
            </p>
            <span className="text-xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {stats?.total_decks || 0}
          </p>
        </div>

        {/* Thẻ cần học */}
        <div
          onClick={() => navigate('/review')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider group-hover:text-orange-500">
              Thẻ cần học
            </p>
            <span className="text-xl">⏳</span>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {stats?.due_today || 0}
            </p>

            {stats?.due_today > 0 && (
              <span className="text-xs font-bold text-orange-400 animate-pulse underline">
                Học ngay!
              </span>
            )}
          </div>
        </div>

        {/* Tỷ lệ ghi nhớ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-green-200 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
              Tỷ lệ ghi nhớ
            </p>
            <span className="text-xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats?.retention_rate || 0}%
          </p>
        </div>
      </div>

      {/* BANNER HỌC NGAY */}
      {stats?.due_today > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-bold text-slate-800">Bạn đã sẵn sàng ôn tập?</p>
              <p className="text-sm text-slate-500">
                Đang có {stats.due_today} thẻ chờ bạn xử lý theo SM-2.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/review')}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
          >
            Bắt đầu học
          </button>
        </div>
      )}

      {/* CHART + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-2">Trạng thái thẻ học</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            ⚡ Hoạt động gần đây
          </h3>

          <div className="space-y-6 relative before:absolute before:left-1.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {stats?.recent_activities?.length > 0 ? (
              stats.recent_activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-6 relative">
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10 z-10 mt-1"></div>
                  <div>
                    <p className="text-slate-700 font-medium">{activity.content}</p>
                    <p className="text-slate-400 text-xs mt-2 italic font-mono">
                      {formatDate(activity.time)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic">
                Chưa có hoạt động nào được ghi nhận.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;