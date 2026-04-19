import axiosClient from './axiosClient';

const cardApi = {
  // Lấy danh sách thẻ theo bộ (Sẽ nhận về thêm các trường image_url)
  getByDeckId: (deckId) => {
    return axiosClient.get(`/cards/read.php?deck_id=${deckId}`);
  },

  /**
   * Tạo thẻ mới
   * @param {Object} data 
   * @param {number} data.deck_id
   * @param {string} data.front_content
   * @param {string} data.back_content
   * @param {string|null} data.front_image_url
   * @param {string|null} data.back_image_url
   */
  create: (data) => {
    return axiosClient.post('/cards/create.php', data);
  },

  /**
   * Cập nhật thẻ
   * @param {number} id 
   * @param {Object} data (Tương tự như create)
   */
  update: (id, data) => {
    return axiosClient.put(`/cards/update.php?id=${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/cards/delete.php?id=${id}`);
  }
};

export default cardApi;