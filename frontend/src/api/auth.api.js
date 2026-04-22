import axiosClient from './axiosClient';

const authApi = {
  login: async (data) => {
    const res = await axiosClient.post('/auth/login.php', data);

    if (res?.token) {
      localStorage.setItem('sr_token', res.token);
      localStorage.setItem(
        'sr_user',
        JSON.stringify({
          role: res.role,
          username: res.username,
          email: data.email,
          avatar: res.avatar || null,
        })
      );
    }

    return res;
  },

  register: (data) => {
    return axiosClient.post('/auth/register.php', data);
  },

  updateProfile: (data) => {
    return axiosClient.post('/user/update_profile.php', data);
  },

  googleLogin: async (credential) => {
    const res = await axiosClient.post('/auth/google_login.php', { credential });
    if (res?.token) {
      localStorage.setItem('sr_token', res.token);
      localStorage.setItem(
        'sr_user',
        JSON.stringify({
          role:     res.role,
          username: res.username,
          email:    res.email,
          avatar:   res.avatar || null,
        })
      );
    }
    return res;
  },

  logout: () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    window.location.href = '/';
  },
};

export default authApi;
