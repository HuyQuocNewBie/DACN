import axiosClient from './axiosClient';

const authApi = {
  // ================= LOGIN =================
  login: async (data) => {
    // -------- BACKDOOR LOGIN --------
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ADMIN_EMAIL = "test@gmail.com";
    const ADMIN_PASS = "123456";

    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASS) {
      console.log("🔥 Login backdoor thành công");

      const fakeResponse = {
        user: {
          id: 99,
          name: "Nguyễn Hoàng Phi Hùng",
          email: ADMIN_EMAIL,
        },
        token: "fake-jwt-token-2026-backdoor",
      };

      // Lưu để dùng cho PrivateRoute
      localStorage.setItem('token', fakeResponse.token);
      localStorage.setItem('user', JSON.stringify(fakeResponse.user));

      return fakeResponse;
    }

    // -------- LOGIN THẬT (fallback) --------
    return axiosClient.post('/auth/login', data);
  },

  // ================= REGISTER =================
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  // ================= PROFILE =================
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  },
};

export default authApi;