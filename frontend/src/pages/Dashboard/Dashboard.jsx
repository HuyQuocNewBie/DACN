import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  const itemsPerPage = 4;

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

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const todayIndex = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  }, []);

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

  const weeklyProgress = stats?.weekly_progress || [0, 0, 0, 0, 0, 0, 0];

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              onClick={() => navigate('/decks')}
              className="group relative flex h-40 cursor-pointer flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-indigo-600">
                  Tổng bộ thẻ
                </span>
                <span className="text-xl transition-transform group-hover:scale-110">
                  📚
                </span>
              </div>
              <p className="relative z-10 text-4xl font-black text-slate-900">
                {stats?.total_decks || 0}
              </p>
              <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl font-black text-slate-50 transition-all duration-500 group-hover:rotate-0 group-hover:text-indigo-50/80">
                #
              </div>
            </div>

            <div
              onClick={() => {
                if (stats?.due_today > 0) navigate('/review');
                else toast('Chưa có thẻ nào cần ôn tập hôm nay.');
              }}
              className="group relative flex h-40 cursor-pointer flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-orange-500">
                    Thẻ cần ôn
                  </span>
                  {stats?.due_today > 0 && (
                    <span className="w-fit animate-pulse rounded-full bg-orange-100 px-2 py-0.5 text-[8px] font-black text-orange-600 uppercase">
                      Học ngay
                    </span>
                  )}
                </div>
                <span className="text-xl transition-transform group-hover:scale-110">
                  ⏳
                </span>
              </div>
              <p className="relative z-10 text-4xl font-black text-orange-500">
                {stats?.due_today || 0}
              </p>
              <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl font-black text-slate-50 transition-all duration-500 group-hover:rotate-0 group-hover:text-orange-50/80">
                !
              </div>
            </div>

            <div className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-green-200 hover:shadow-md">
              <div className="relative z-10 flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-green-600">
                  Ghi nhớ
                </span>
                <span className="text-xl transition-transform group-hover:scale-110">
                  🎯
                </span>
              </div>
              <p className="relative z-10 text-4xl font-black text-green-600">
                {stats?.retention_rate || 0}%
              </p>
              <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl font-black text-slate-50 transition-all duration-500 group-hover:rotate-0 group-hover:text-green-50/80">
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
                onClick={() => {
                  if (stats?.due_today > 0) {
                    navigate('/review');
                  } else {
                    toast('Chưa có thẻ nào cần ôn tập hôm nay.');
                  }
                }}
                className="relative z-10 rounded-2xl bg-indigo-600 px-10 py-4 text-sm font-black tracking-[0.15em] whitespace-nowrap text-white uppercase shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.05] active:scale-95"
              >
                Bắt đầu ôn tập ngay
              </button>
            </div>
          )}

          <div className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
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

            <div className="relative flex-1 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-2.75 before:w-0.5 before:bg-slate-50">
              {paginatedActivities.length > 0 ? (
                paginatedActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="group relative flex items-start gap-4"
                  >
                    <div className="z-10 h-6 w-6 shrink-0 rounded-full border-[6px] border-slate-100 bg-white shadow-sm transition-colors group-hover:border-indigo-600"></div>

                    <div className="-mt-1.5 flex flex-1 items-start justify-between rounded-2xl p-4 transition-colors group-hover:bg-slate-50">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                          <span className="font-medium text-slate-500">
                            Học thẻ
                          </span>
                          <span className="font-bold text-slate-800 italic">
                            "{activity.card_content}"
                          </span>
                          <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
                            {activity.deck_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                          <span className="leading-none text-indigo-600/40">
                            ●
                          </span>
                          {formatDate(activity.time)}
                        </div>
                      </div>

                      <div className="ml-4 flex shrink-0">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase shadow-sm ${
                            activity.quality_score >= 4
                              ? 'bg-emerald-100 text-emerald-700'
                              : activity.quality_score === 3
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {activity.quality_text}
                        </span>
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

        <div className="space-y-8 lg:col-span-4">
          <div className="flex h-40 flex-col justify-between rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Tiến độ 7 ngày
              </h3>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">
                Thẻ đã học
              </span>
            </div>

            <div className="mt-2 flex h-16 items-end justify-between gap-1.5">
              {weeklyProgress.map((h, i) => (
                <div
                  key={i}
                  className="relative h-full w-full rounded-t-md bg-slate-50/50"
                >
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md transition-all duration-700 ${
                      i === todayIndex
                        ? 'bg-indigo-600 shadow-[0_-4px_10px_rgba(79,70,229,0.2)]'
                        : 'bg-indigo-200'
                    }`}
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-between px-1 text-[8px] font-black text-slate-400 uppercase">
              {daysOfWeek.map((d, i) => (
                <span
                  key={i}
                  className={i === todayIndex ? 'text-indigo-600' : ''}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="flex h-40 flex-col justify-center rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600"></span>
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Mục tiêu ngày
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-500">Ôn tập thẻ</span>
                  <span className="text-indigo-600">
                    {stats?.daily_cards_goal?.current || 0}/
                    {stats?.daily_cards_goal?.target || 50}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-1000"
                    style={{
                      width: `${Math.min(((stats?.daily_cards_goal?.current || 0) / (stats?.daily_cards_goal?.target || 50)) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-500">Thời gian học</span>
                  <span className="text-emerald-600">
                    {stats?.daily_time_goal?.current || 0}/
                    {stats?.daily_time_goal?.target || 45} phút
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000"
                    style={{
                      width: `${Math.min(((stats?.daily_time_goal?.current || 0) / (stats?.daily_time_goal?.target || 45)) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-100 flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Trạng thái thẻ
              </h3>
              <span className="text-xl">📊</span>
            </div>

            <div className="h-75 w-full">
              {' '}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {chartData.map((e, i) => (
                      <Cell
                        key={i}
                        fill={e.color}
                        className="transition-opacity outline-none hover:opacity-80"
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: '900',
                      padding: '12px',
                    }}
                    cursor={{ fill: 'transparent' }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    height={40}
                    formatter={(val) => (
                      <span className="ml-1 text-[10px] font-black tracking-tighter text-slate-500 uppercase">
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
