import axiosClient from './axiosClient';

const reviewApi = {
  // Lấy danh sách thẻ cần ôn tập hôm nay của 1 bộ thẻ
  getDueCards: (deckId) => {
    return axiosClient.get(`/review/get_due_cards.php?deck_id=${deckId}`);
  },
  // Cập nhật tiến độ SM2 thẻ sau khi chấm điểm não bộ
  updateCardProgress: (cardId, data) => {
    return axiosClient.post(`/review/update_progress.php`, {
      card_id: cardId,
      quality: data.quality
    });
  }
};

export default reviewApi;