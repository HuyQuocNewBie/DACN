import axiosClient from './axiosClient';

const adminApi = {
  // Stats
  getStats: () => axiosClient.get('/admin/stats.php'),

  // Users
  getAllUsers: () => {
    return axiosClient.get('/admin/users.php');
  },

  updateUserStatus: (userId, status) => {
    return axiosClient.put('/admin/user_status.php', { userId, status });
  },

  deleteUser: (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  // Decks
  getAllDecks: () => {
    return axiosClient.get('/admin/decks');
  },

  deleteDeck: (deckId) => {
    return axiosClient.delete(`/admin/decks/${deckId}`);
  },

  toggleDeckVisibility: (deckId, isPublic) => {
    return axiosClient.put(`/admin/decks/${deckId}/visibility`, {
      is_public: isPublic,
    });
  },
};

export default adminApi;
