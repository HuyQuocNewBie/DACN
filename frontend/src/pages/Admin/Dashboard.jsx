import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Loading from '../../components/common/Loading';
import adminApi from '../../api/admin.api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDecks: 0,
    totalCards: 0,
    activeToday: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, logsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getLogs(),
        ]);

        setStats({
          totalUsers: statsRes.totalUsers || 0,
          totalDecks: statsRes.totalDecks || 0,
          totalCards: statsRes.totalCards || 0,
          activeToday: statsRes.activeToday || 0,
        });

        setLogs(logsRes || []);
      } catch {
        toast.error('Không thể tải dữ liệu hệ thống');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

  const getQualityLabel = (q) => {
    const labels = {
      5: 'Hoàn hảo 🌟',
      4: 'Chính xác ✅',
      3: 'Tạm ổn 👌',
      2: 'Khó khăn 🧠',
      1: 'Quên rồi ❌',
      0: 'Chưa biết ❓',
    };
    return labels[q] || 'Đã học';
  };

  const handleExportExcel = () => {
    try {
      const statsData = [
        {
          'Hạng mục': 'Tổng người dùng',
          'Giá trị': stats.totalUsers,
          'Đơn vị': 'Người dùng',
        },
        {
          'Hạng mục': 'Bộ thẻ hiện có',
          'Giá trị': stats.totalDecks,
          'Đơn vị': 'Bộ thẻ',
        },
        {
          'Hạng mục': 'Tổng số thẻ học',
          'Giá trị': stats.totalCards,
          'Đơn vị': 'Thẻ',
        },
        {
          'Hạng mục': 'Bộ thẻ mới hôm nay',
          'Giá trị': stats.activeToday,
          'Đơn vị': 'Bộ thẻ',
        },
        {
          'Hạng mục': 'Ngày xuất báo cáo',
          'Giá trị': new Date().toLocaleString('vi-VN'),
          'Đơn vị': '',
        },
      ];

      const logsData = logs.map((log) => ({
        'Tài khoản': `@${log.username}`,
        'Bộ thẻ': log.deck_name,
        'Nội dung thẻ': log.card_name,
        'Đánh giá': getQualityLabel(log.quality),
        'Thời gian': new Date(log.created_at).toLocaleString('vi-VN'),
      }));

      const workbook = XLSX.utils.book_new();
      const statsSheet = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Thong_Ke_Tong_Quan');

      if (logsData.length > 0) {
        const logsSheet = XLSX.utils.json_to_sheet(logsData);
        XLSX.utils.book_append_sheet(workbook, logsSheet, 'Nhat_Ky_Chi_Tiet');
      }

      const fileName = `Bao_Cao_He_Thong_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success('Đã xuất báo cáo Excel thành công!');
    } catch {
      toast.error('Lỗi khi tạo file báo cáo');
    }
  };

  const statCards = [
    {
      label: 'Tổng người dùng',
      value: stats.totalUsers,
      emoji: '👥',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      symbol: 'U',
    },
    {
      label: 'Bộ thẻ hiện có',
      value: stats.totalDecks,
      emoji: '🗂️',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      symbol: 'D',
    },
    {
      label: 'Tổng số thẻ học',
      value: stats.totalCards,
      emoji: '🃏',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      symbol: 'C',
    },
    {
      label: 'Bộ thẻ mới hôm nay',
      value: stats.activeToday,
      emoji: '✨',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      symbol: 'N',
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="animate-in fade-in space-y-10 duration-500">
      <header className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-colors duration-300 md:flex-row md:items-end md:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl dark:bg-indigo-500/10"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 transition-colors duration-300 md:text-4xl dark:text-white">
            Quản trị hệ thống
          </h1>
          <p className="mt-2 font-medium text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Dữ liệu thống kê và nhật ký ôn tập thời gian thực
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            onClick={handleExportExcel}
            className="rounded-2xl bg-slate-900 px-7 py-3 text-xs font-black tracking-[0.15em] text-white uppercase shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 active:scale-95 dark:bg-indigo-600 dark:shadow-none dark:hover:bg-indigo-500"
          >
            Xuất báo cáo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item, index) => (
          <div
            key={index}
            className="group relative cursor-default overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30"
          >
            <div className="relative z-10 flex items-center justify-between">
              <p
                className={`text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors group-hover:${item.color.split(' ')[0]} dark:group-hover:${item.color.split(' ')[1]}`}
              >
                {item.label}
              </p>
              <span
                className={`rounded-2xl p-3 text-2xl transition-colors ${item.bg}`}
              >
                {item.emoji}
              </span>
            </div>
            <h3 className="relative z-10 mt-6 text-4xl font-black text-slate-900 transition-colors duration-300 dark:text-white">
              {item.value.toLocaleString()}
            </h3>
            <div className="pointer-events-none absolute -right-4 -bottom-6 rotate-12 text-[100px] font-black text-slate-500/5 transition-all duration-500 group-hover:rotate-0 dark:text-white/5">
              {item.symbol}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex h-fit flex-col rounded-[2.5rem] border border-slate-100 bg-white p-9 shadow-sm transition-colors duration-300 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 transition-colors duration-300 dark:text-white">
                Nhật ký hệ thống
              </h3>
              <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Giám sát thời gian thực
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 transition-colors duration-300 dark:bg-emerald-500/10">
              🛰️
            </div>
          </div>

          <div className="grow">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    <th className="px-4 py-2">Người dùng</th>
                    <th className="px-4 py-2">Thẻ học</th>
                    <th className="px-4 py-2">Đánh giá</th>
                    <th className="px-4 py-2 text-right">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="group bg-slate-50/50 transition-all hover:bg-slate-100 dark:bg-slate-800/30 dark:hover:bg-slate-800/80"
                    >
                      <td className="rounded-l-2xl px-4 py-5 text-sm font-bold text-indigo-600 transition-colors duration-300 dark:text-indigo-400">
                        @{log.username}
                      </td>
                      <td className="px-4 py-5 text-sm text-slate-700 transition-colors duration-300 dark:text-slate-300">
                        <div className="max-w-50 truncate font-black">
                          {log.card_name}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase dark:text-slate-500">
                          {log.deck_name}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-[10px] font-black text-slate-700 uppercase transition-colors duration-300 dark:text-slate-300">
                        {getQualityLabel(log.quality)}
                      </td>
                      <td className="rounded-r-2xl px-4 py-5 text-right text-[10px] font-bold text-slate-400 uppercase dark:text-slate-500">
                        {new Date(log.created_at).toLocaleTimeString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {logs.length === 0 && (
              <div className="py-20 text-center text-sm font-bold tracking-widest text-slate-400 uppercase italic dark:text-slate-600">
                Chưa có hoạt động nào
              </div>
            )}
          </div>

          {logs.length > itemsPerPage && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white font-black transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ←
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                      currentPage === i + 1
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 dark:bg-indigo-500 dark:text-white dark:shadow-none'
                        : 'border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white font-black transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="sticky top-8 flex h-fit flex-col rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm transition-colors duration-300 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 transition-colors duration-300 dark:text-white">
                Cấu trúc dữ liệu
              </h3>
              <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Phân bổ dữ liệu
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 transition-colors duration-300 dark:bg-indigo-500/10">
              📊
            </div>
          </div>

          <div className="h-80 w-full grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Người dùng',
                      value: stats.totalUsers,
                      color: '#4F46E5',
                    },
                    {
                      name: 'Bộ thẻ',
                      value: stats.totalDecks,
                      color: '#10B981',
                    },
                    {
                      name: 'Thẻ học',
                      value: stats.totalCards,
                      color: '#F59E0B',
                    },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {['#4F46E5', '#10B981', '#F59E0B'].map((color, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="ml-1 text-[10px] font-black text-slate-500 uppercase transition-colors dark:text-slate-400">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                <span className="text-xs font-black text-slate-600 uppercase transition-colors dark:text-slate-300">
                  Server Status
                </span>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600 transition-colors dark:bg-emerald-500/10 dark:text-emerald-400">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
