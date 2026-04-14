import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import userApi from '../../api/user.api';
import { handleError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

  const paginatedActivities = useMemo(() => {
    if (!stats?.recent_activities) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return stats.recent_activities.slice(startIndex, startIndex + itemsPerPage);
  }, [stats?.recent_activities, currentPage]);

  const totalPages = Math.ceil(
    (stats?.recent_activities?.length || 0) / itemsPerPage
  );

  if (loading) return <Loading />;

  const chartData = [
    { name: 'Mới (New)', value: stats?.new_cards || 0, color: '#94a3b8' },
    {
      name: 'Đang học (Learning)',
      value: stats?.learning_cards || 0,
      color: '#4F46E5',
    },
    {
      name: 'Đã thuộc (Mastered)',
      value: stats?.mastered_cards || 0,
      color: '#10b981',
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Tiến độ học tập
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Theo dõi quá trình rèn luyện trí nhớ của bạn mỗi ngày
          </p>
        </div>

        <button
          onClick={() => navigate('/decks')}
          className="group flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-black tracking-widest text-indigo-600 uppercase transition-all hover:text-indigo-700"
        >
          Xem tất cả bộ thẻ
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          onClick={() => navigate('/decks')}
          className="group relative cursor-pointer overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
        >
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors group-hover:text-indigo-600">
              Tổng bộ thẻ
            </p>
            <span className="rounded-2xl bg-slate-50 p-3 text-2xl transition-colors group-hover:bg-indigo-50">
              📚
            </span>
          </div>
          <p className="relative z-10 mt-6 text-5xl font-black text-slate-900">
            {stats?.total_decks || 0}
          </p>
          <div className="absolute -right-6 -bottom-6 rotate-12 text-[120px] font-black text-indigo-500/5 transition-all duration-500 group-hover:rotate-0">
            #
          </div>
        </div>

        <div
          onClick={() => navigate('/review')}
          className="group relative cursor-pointer overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
        >
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors group-hover:text-orange-500">
              Thẻ cần ôn tập
            </p>
            <span className="rounded-2xl bg-orange-50 p-3 text-2xl transition-colors group-hover:bg-orange-100">
              ⏳
            </span>
          </div>
          <div className="relative z-10 mt-6 flex items-baseline gap-3">
            <p className="text-5xl font-black text-orange-500">
              {stats?.due_today || 0}
            </p>
            {stats?.due_today > 0 && (
              <span className="animate-bounce rounded-lg bg-orange-100 px-2 py-1 text-[10px] font-black text-orange-600 uppercase">
                Học ngay!
              </span>
            )}
          </div>
          <div className="absolute -right-6 -bottom-6 -rotate-12 text-[120px] font-black text-orange-500/5 transition-all duration-500 group-hover:rotate-0">
            !
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5">
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors group-hover:text-green-600">
              Tỷ lệ ghi nhớ
            </p>
            <span className="rounded-2xl bg-green-50 p-3 text-2xl transition-colors group-hover:bg-green-100">
              🎯
            </span>
          </div>
          <p className="relative z-10 mt-6 text-5xl font-black text-green-600">
            {stats?.retention_rate || 0}%
          </p>
          <div className="absolute -right-6 -bottom-6 rotate-45 text-[120px] font-black text-green-500/5 transition-all duration-500 group-hover:rotate-0">
            %
          </div>
        </div>
      </div>

      {stats?.due_today > 0 && (
        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200 md:flex-row">
          <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]"></div>

          <div className="relative z-10 flex items-center gap-6 text-center md:text-left">
            <div className="animate-pulse rounded-3xl bg-white/10 p-4 text-5xl backdrop-blur-sm">
              🔥
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">
                Sẵn sàng bứt phá hôm nay?
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-400">
                Bạn có{' '}
                <span className="font-bold text-white underline decoration-indigo-500 decoration-2 underline-offset-4">
                  {stats.due_today} thẻ
                </span>{' '}
                cần xử lý.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/review')}
            className="relative z-10 rounded-2xl bg-indigo-600 px-10 py-4 text-sm font-black tracking-[0.15em] whitespace-nowrap text-white uppercase shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.05] active:scale-95"
          >
            Bắt đầu ôn tập ngay
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex min-h-112.5 flex-col rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm lg:col-span-5">
          <div className="mb-8">
            <h3 className="text-xl font-black tracking-tight text-slate-900">
              Trạng thái thẻ học
            </h3>
            <p className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
              Phân bổ trí nhớ
            </p>
          </div>

          <div className="h-75 w-full flex-1">
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
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 20px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="ml-2 text-xs font-black tracking-widest text-slate-500 uppercase">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm lg:col-span-7">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">
                Hoạt động gần đây
              </h3>
              <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Hành trình học tập
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-xl shadow-inner">
              ⚡
            </div>
          </div>

          <div className="relative flex-1 space-y-10 before:absolute before:top-2 before:bottom-2 before:left-2.75 before:w-0.5 before:bg-slate-50">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity, index) => (
                <div
                  key={index}
                  className="group relative flex items-start gap-8"
                >
                  <div className="z-10 h-6 w-6 shrink-0 rounded-full border-[6px] border-slate-100 bg-white shadow-sm transition-colors group-hover:border-indigo-600"></div>

                  <div className="-mt-1.5 flex-1 rounded-2xl p-4 transition-colors group-hover:bg-slate-50">
                    <p className="text-base leading-snug font-bold text-slate-800">
                      {activity.content}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                      <span className="leading-none text-indigo-600/40">●</span>
                      {formatDate(activity.time)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
                <div className="text-5xl opacity-20 grayscale">🏜️</div>
                <div>
                  <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
                    Nhật ký trống
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Mọi hành trình vạn dặm đều bắt đầu từ một tấm thẻ.
                  </p>
                </div>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-slate-50">
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Trang {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-xl border border-slate-100 p-3 transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-xl border border-slate-100 p-3 transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
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
