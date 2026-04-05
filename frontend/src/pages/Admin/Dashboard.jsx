import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDecks: 0,
    totalCards: 0,
    activeToday: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fake data
        setStats({
          totalUsers: 1250,
          totalDecks: 450,
          totalCards: 8900,
          activeToday: 85,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Người dùng',
      value: stats.totalUsers,
      icon: 'group',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Bộ thẻ',
      value: stats.totalDecks,
      icon: 'style',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Thẻ học',
      value: stats.totalCards,
      icon: 'layers',
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
    },
    {
      label: 'Hoạt động hôm nay',
      value: stats.activeToday,
      icon: 'whatshot',
      color: 'text-error',
      bg: 'bg-error/10',
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center text-on-surface-variant">
        Đang tải thống kê...
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
          Thống kê hệ thống
        </h1>
        <p className="text-on-surface-variant mt-1">
          Tổng quan hoạt động của ứng dụng
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <div
            key={index}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}
            >
              <span
                className={`material-symbols-outlined ${item.color}`}
              >
                {item.icon}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-outline">
                {item.label}
              </p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1">
                {item.value.toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVITY */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
            insights
          </span>
          <h3 className="text-lg font-bold text-on-surface">
            Hoạt động gần đây
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-40">
            monitoring
          </span>
          <p className="text-sm">
            Hệ thống đang theo dõi dữ liệu thời gian thực...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;