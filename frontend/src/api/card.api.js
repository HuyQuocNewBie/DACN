import axiosClient from './axiosClient';

const cardApi = {
  getByDeckId: (deckId) => {
    return axiosClient.get(`/cards/read.php?deck_id=${deckId}`);
  },
  create: (data) => {
    return axiosClient.post('/cards/create.php', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/cards/update.php?id=${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/cards/delete.php?id=${id}`);
  }
};

export default cardApi;