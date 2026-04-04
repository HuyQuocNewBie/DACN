import axiosClient from './axiosClient';

const reviewApi = {
  // Lấy danh sách thẻ cần ôn tập hôm nay của 1 bộ thẻ
  getDueCards: (deckId) => {
    return axiosClient.get(`/decks/${deckId}/review`);
  },
  // Cập nhật trạng thái thẻ sau khi học
  updateCardProgress: (cardId, data) => {
    return axiosClient.put(`/cards/${cardId}/review`, data);
  }
};

export default reviewApi;