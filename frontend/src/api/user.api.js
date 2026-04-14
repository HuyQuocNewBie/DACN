import axiosClient from './axiosClient';

const userApi = {
  getStatistics: () => axiosClient.get('/user/statistics.php'),

  getProfile: () => axiosClient.get('/user/profile.php'),

  updateProfile: (data) => axiosClient.post('/user/update_profile.php', data),
};

export default userApi;
