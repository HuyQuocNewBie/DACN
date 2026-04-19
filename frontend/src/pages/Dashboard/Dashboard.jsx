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
      {/* --- HEADER --- */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 transition-colors duration-300 md:text-4xl dark:text-white">
            Tiến độ học tập
          </h1>
          <p className="mt-1 font-medium text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Theo dõi quá trình rèn luyện trí nhớ của bạn mỗi ngày
          </p>
        </div>

        <button
          onClick={() => navigate('/decks')}
          className="group flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-black tracking-widest text-indigo-600 uppercase transition-all hover:text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
        >
          Xem tất cả bộ thẻ
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          
          {/* --- TOP STATS CARDS --- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              onClick={() => navigate('/decks')}
              className="group relative flex h-40 cursor-pointer flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30"
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400">
                  Tổng bộ thẻ
                </span>
                <span className="text-xl transition-transform group-hover:scale-110">
                  📚
                </span>
              </div>
              <p className="relative z-10 text-4xl font-black text-slate-900 transition-colors duration-300 dark:text-white">
                {stats?.total_decks || 0}
              </p>
              <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl font-black text-slate-50 transition-all duration-500 group-hover:rotate-0 group-hover:text-indigo-50/80 dark:text-slate-800/50 dark:group-hover:text-indigo-500/10">
                #
              </div>
            </div>

            <div
              onClick={() => {
                if (stats?.due_today > 0) navigate('/review');
                else toast('Chưa có thẻ nào cần ôn tập hôm nay.');
              }}
              className="group relative flex h-40 cursor-pointer flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-orange-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30"
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-orange-500 dark:text-slate-500 dark:group-hover:text-orange-400">
                    Thẻ cần ôn
                  </span>
                  {stats?.due_today > 0 && (
                    <span className="w-fit animate-pulse rounded-full bg-orange-100 px-2 py-0.5 text-[8px] font-black text-orange-600 uppercase dark:bg-orange-500/10 dark:text-orange-400">
                      Học ngay
                    </span>
                  )}
                </div>
                <span className="text-xl transition-transform group-hover:scale-110">
                  ⏳
                </span>
              </div>
              <p className="relative z-10 text-4xl font-black text-orange-500 transition-colors duration-300 dark:text-orange-400">
                {stats?.due_today || 0}
              </p>
              <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl font-black text-slate-50 transition-all duration-500 group-hover:rotate-0 group-hover:text-orange-50/80 dark:text-slate-800/50 dark:group-hover:text-orange-500/10">
                !
              </div>
            </div>

            <div className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-green-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/30">
              <div className="relative z-10 flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-green-600 dark:text-slate-500 dark:group-hover:text-emerald-400">
                  Ghi nhớ
                </span>
                <span className="text-xl transition-transform group-hover:scale-110">
                  🎯
                </span>
              </div>
              <p className="relative z-10 text-4xl font-black text-green-600 transition-colors duration-300 dark:text-emerald-400">
                {stats?.retention_rate || 0}%
              </p>
              <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl font-black text-slate-50 transition-all duration-500 group-hover:rotate-0 group-hover:text-green-50/80 dark:text-slate-800/50 dark:group-hover:text-emerald-500/10">
                %
              </div>
            </div>
          </div>

          {/* --- HERO CARD (Sẵn sàng bứt phá) --- */}
          {stats?.due_today > 0 && (
            <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200 transition-colors duration-300 md:flex-row dark:bg-slate-800 dark:shadow-none">
              <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]"></div>

              <div className="relative z-10 flex items-center gap-6 text-center md:text-left">
                <div className="animate-pulse rounded-3xl bg-white/10 p-4 text-5xl backdrop-blur-sm dark:bg-slate-700/50">
                  🔥
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    Sẵn sàng bứt phá hôm nay?
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-400 dark:text-slate-300">
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
                className="relative z-10 rounded-2xl bg-indigo-600 px-10 py-4 text-sm font-black tracking-[0.15em] whitespace-nowrap text-white uppercase shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.05] active:scale-95 dark:shadow-none dark:hover:bg-indigo-500"
              >
                Bắt đầu ôn tập ngay
              </button>
            </div>
          )}

          {/* --- RECENT ACTIVITIES --- */}
          <div className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 transition-colors duration-300 dark:text-white">
                  Hoạt động gần đây
                </h3>
                <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Hành trình học tập
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-xl shadow-inner transition-colors duration-300 dark:bg-slate-800/50">
                ⚡
              </div>
            </div>

            {/* Timeline Wrapper */}
            <div className="relative flex-1 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2.75 before:w-0.5 before:bg-slate-50 dark:before:bg-slate-800">
              {paginatedActivities.length > 0 ? (
                paginatedActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="group relative flex items-start gap-4"
                  >
                    {/* Timeline Dot */}
                    <div className="z-10 h-6 w-6 shrink-0 rounded-full border-[6px] border-slate-100 bg-white shadow-sm transition-colors group-hover:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-indigo-500"></div>

                    {/* Content Box */}
                    <div className="-mt-1.5 flex flex-1 items-start justify-between rounded-2xl p-4 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                          <span className="font-medium text-slate-500 dark:text-slate-400">
                            Học thẻ
                          </span>
                          <span className="font-bold text-slate-800 italic transition-colors duration-300 dark:text-slate-200">
                            "{activity.card_content}"
                          </span>
                          <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600 transition-colors duration-300 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {activity.deck_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-400 uppercase dark:text-slate-500">
                          <span className="leading-none text-indigo-600/40 dark:text-indigo-400/40">
                            ●
                          </span>
                          {formatDate(activity.time)}
                        </div>
                      </div>

                      <div className="ml-4 flex shrink-0">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase shadow-sm transition-colors duration-300 ${
                            activity.quality_score >= 4
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : activity.quality_score === 3
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
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
                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                      Nhật ký trống
                    </p>
                    <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">
                      Mọi hành trình vạn dặm đều bắt đầu từ một tấm thẻ.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-5 transition-colors duration-300 dark:border-slate-800">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-xl border border-slate-100 p-3 text-slate-500 transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    ←
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-xl border border-slate-100 p-3 text-slate-500 transition-all hover:bg-slate-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* --- 7 DAYS PROGRESS --- */}
          <div className="flex h-40 flex-col justify-between rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Tiến độ 7 ngày
              </h3>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600 transition-colors duration-300 dark:bg-indigo-500/10 dark:text-indigo-400">
                Thẻ đã học
              </span>
            </div>

            <div className="mt-2 flex h-16 items-end justify-between gap-1.5">
              {weeklyProgress.map((h, i) => (
                <div
                  key={i}
                  className="relative h-full w-full rounded-t-md bg-slate-50/50 transition-colors duration-300 dark:bg-slate-800/50"
                >
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md transition-all duration-700 ${
                      i === todayIndex
                        ? 'bg-indigo-600 shadow-[0_-4px_10px_rgba(79,70,229,0.2)] dark:bg-indigo-500 dark:shadow-none'
                        : 'bg-indigo-200 dark:bg-indigo-900/40'
                    }`}
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-between px-1 text-[8px] font-black text-slate-400 uppercase dark:text-slate-500">
              {daysOfWeek.map((d, i) => (
                <span
                  key={i}
                  className={i === todayIndex ? 'text-indigo-600 dark:text-indigo-400' : ''}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* --- DAILY GOALS --- */}
          <div className="flex h-40 flex-col justify-center rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Mục tiêu ngày
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-500 dark:text-slate-400">Ôn tập thẻ</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {stats?.daily_cards_goal?.current || 0}/
                    {stats?.daily_cards_goal?.target || 50}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 transition-colors duration-300 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-1000 dark:bg-indigo-500 dark:shadow-none"
                    style={{
                      width: `${Math.min(((stats?.daily_cards_goal?.current || 0) / (stats?.daily_cards_goal?.target || 50)) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-500 dark:text-slate-400">Thời gian học</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {stats?.daily_time_goal?.current || 0}/
                    {stats?.daily_time_goal?.target || 45} phút
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 transition-colors duration-300 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000 dark:bg-emerald-400 dark:shadow-none"
                    style={{
                      width: `${Math.min(((stats?.daily_time_goal?.current || 0) / (stats?.daily_time_goal?.target || 45)) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- PIE CHART --- */}
          <div className="flex min-h-100 flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Trạng thái thẻ
              </h3>
              <span className="text-xl">📊</span>
            </div>

            <div className="h-75 w-full">
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
                      <span className="ml-1 text-[10px] font-black tracking-tighter text-slate-500 uppercase transition-colors duration-300 dark:text-slate-400">
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