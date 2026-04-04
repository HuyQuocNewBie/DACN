import axiosClient from './axiosClient';

const cardApi = {
  // Lấy tất cả thẻ của một bộ thẻ cụ thể
  getByDeckId: (deckId) => {
    return axiosClient.get(`/decks/${deckId}/cards`);
  },
  // Tạo thẻ mới trong một bộ thẻ
  create: (data) => {
    return axiosClient.post('/cards', data);
  },
  // Cập nhật nội dung thẻ
  update: (id, data) => {
    return axiosClient.put(`/cards/${id}`, data);
  },
  // Xóa thẻ
  delete: (id) => {
    return axiosClient.delete(`/cards/${id}`);
  }
};

export default cardApi;