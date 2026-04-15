import axiosClient from './axiosClient';

const userApi = {
  getStatistics: () => axiosClient.get('/user/statistics.php'),

  getProfile: () => axiosClient.get('/user/profile.php'),

  updateProfile: (data) => axiosClient.post('/user/update_profile.php', data),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosClient.post('/user/upload_avatar.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default userApi;
