import axiosClient from './axiosClient';

const authApi = {
  // ================= LOGIN =================
  login: async (data) => {
    // -------- BACKDOOR LOGIN (Dùng cho môi trường dev) --------
    const ADMIN_EMAIL = 'test@gmail.com';
    const ADMIN_PASS = '123456';

    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASS) {
      const fakeResponse = {
        user: {
          id: 99,
          fullname: 'Nguyễn Hoàng Phi Hùng',
          email: ADMIN_EMAIL,
          role: 'admin',
        },
        token: 'fake-jwt-token-2026-backdoor',
      };
      localStorage.setItem('sr_token', fakeResponse.token);
      localStorage.setItem('sr_user', JSON.stringify(fakeResponse.user));
      return fakeResponse;
    }

    // -------- LOGIN THẬT --------
    const res = await axiosClient.post('/auth/login.php', data);
    if (res?.token) {
      localStorage.setItem('sr_token', res.token);
      localStorage.setItem(
        'sr_user',
        JSON.stringify({
          role: res.role,
          username: res.username,
          email: data.email, // Lưu email để dùng cho profile
        })
      );
    }
    return res;
  },

  // ================= REGISTER =================
  register: (data) => {
    // data: { fullname, email, password }
    return axiosClient.post('/auth/register.php', data);
  },

  // ================= UPDATE PROFILE =================
  updateProfile: (data) => {
    // data: { username, password }
    return axiosClient.post('/user/update_profile.php', data);
  },

  // ================= LOGOUT =================
  logout: () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    window.location.href = '/'; // Điều hướng về landing page
  },
};

export default authApi;
