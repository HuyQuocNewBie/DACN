import axiosClient from './axiosClient';

const adminApi = {
  getStats: () => axiosClient.get('/admin/stats.php'),
  getLogs: () => axiosClient.get('/admin/logs.php'),

  getAllUsers: () => axiosClient.get('/admin/users.php'),

  updateUserStatus: (userId, status) =>
    axiosClient.put('/admin/user_status.php', { userId, status }),

  deleteUser: (userId) =>
    axiosClient.delete(`/admin/users.php?id=${userId}`),

  getAllDecks: () => axiosClient.get('/admin/decks.php'),

  getDeckDetail: (id) =>
    axiosClient.get(`/admin/decks.php?id=${id}`),

  deleteDeck: (deckId) =>
    axiosClient.delete(`/admin/decks.php?id=${deckId}`),

  toggleDeckStatus: (id, isPublic) =>
    axiosClient.put('/admin/decks.php', {
      id,
      is_public: Number(isPublic),
    }),
};

export default adminApi;