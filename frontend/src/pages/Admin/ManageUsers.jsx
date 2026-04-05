import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsers([
          {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'vana@gmail.com',
            role: 'user',
            status: 'active',
            createdAt: '2026-01-10'
          },
          {
            id: 2,
            name: 'Trần Thị B',
            email: 'thib@gmail.com',
            role: 'user',
            status: 'banned',
            createdAt: '2026-02-15'
          }
        ]);
      } catch {
        toast.error('Không thể tải người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = (id, status) => {
    const newStatus = status === 'active' ? 'banned' : 'active';

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: newStatus } : u
      )
    );

    toast.success('Đã cập nhật trạng thái');
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-10 text-center">Đang tải...</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            Người dùng
          </h1>
          <p className="text-on-surface-variant text-sm">
            Quản lý tài khoản hệ thống
          </p>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>

          <input
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 py-2 rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/30 transition w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Người dùng</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low transition">
                <td className="px-6 py-4">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-on-surface-variant">
                    {user.email}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-center text-on-surface-variant">
                  {user.createdAt}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-red-100 text-red-500'
                  }`}>
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      handleToggleStatus(user.id, user.status)
                    }
                    className="px-3 py-1 rounded-lg text-sm font-semibold hover:bg-surface-container transition"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-on-surface-variant">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;