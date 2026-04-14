import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import adminApi from '../../api/admin.api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllUsers();
        setUsers(
          data.map((user) => ({
            ...user,
            name: user.username || user.name || 'Người dùng',
            avatar: user.username ? user.username.charAt(0).toUpperCase() : 'U',
          }))
        );
      } catch {
        toast.error('Không thể tải người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    if (!users.length) return { total: 0, activeRate: 0, adminCount: 0 };

    const activeCount = users.filter((u) => u.status === 'active').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;

    return {
      total: users.length,
      activeRate: Math.round((activeCount / users.length) * 100),
      adminCount: adminCount,
    };
  }, [users]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await adminApi.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      if (newStatus === 'banned') {
        toast.error('Đã khóa tài khoản');
      } else {
        toast.success('Đã mở khóa tài khoản');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Không thể cập nhật trạng thái'
      );
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="relative flex flex-col justify-between gap-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-indigo-50 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Người dùng
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Quản lý và phân quyền thành viên hệ thống
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-96">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 opacity-40">
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            placeholder="Tìm theo tên, email..."
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pr-4 pl-12 text-sm font-medium shadow-inner transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white pb-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                <th className="px-8 py-5 text-left">Thành viên</th>
                <th className="px-6 py-5 text-center">Vai trò</th>
                <th className="px-6 py-5 text-center">Ngày gia nhập</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-all duration-300 hover:bg-slate-50/80"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 font-black text-white shadow-sm transition-transform group-hover:scale-110">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {user.name}
                        </div>
                        <div className="text-xs font-medium text-slate-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className={`rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-bold text-slate-500">
                      {user.createdAt?.split('T')[0] || 'Chưa cập nhật'}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      <span
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'animate-pulse bg-emerald-500' : 'bg-rose-500'}`}
                        ></span>
                        {user.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`rounded-xl px-5 py-2 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all active:scale-95 ${
                        user.status === 'active'
                          ? 'bg-slate-900 text-white hover:bg-rose-600'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > itemsPerPage && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 font-bold transition-all hover:bg-slate-50 disabled:opacity-20"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'border border-slate-100 bg-white text-slate-400 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 font-bold transition-all hover:bg-slate-50 disabled:opacity-20"
            >
              →
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 text-6xl opacity-20 grayscale">🔍</div>
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Không tìm thấy thành viên
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative flex items-center justify-between overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-sm">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
              Tổng thành viên
            </p>
            <h4 className="mt-1 text-3xl font-black">{stats.total}</h4>
          </div>
          <div className="text-4xl opacity-20 transition-transform duration-500 group-hover:scale-125">
            👥
          </div>
        </div>

        <div className="group flex items-center justify-between rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Đang hoạt động
            </p>
            <h4 className="mt-1 text-3xl font-black text-slate-900">
              {stats.activeRate}%
            </h4>
          </div>
          <div className="h-12 w-12 animate-[spin_3s_linear_infinite] rounded-full border-[6px] border-emerald-500 border-t-transparent"></div>
        </div>

        <div className="group flex items-center justify-between rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Quản trị viên
            </p>
            <h4 className="mt-1 text-3xl font-black text-slate-900">
              {stats.adminCount}
            </h4>
          </div>
          <div className="animate-bounce-slow text-4xl transition-transform duration-500 group-hover:scale-125">
            🛡️
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
