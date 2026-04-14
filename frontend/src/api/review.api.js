import axiosClient from './axiosClient';

const reviewApi = {
  getDueCards: (deckId) => {
    return axiosClient.get(`/review/get_due_cards.php?deck_id=${deckId}`);
  },
  updateCardProgress: (cardId, data) => {
    return axiosClient.post(`/review/update_progress.php`, {
      card_id: cardId,
      quality: data.quality
    });
  }
};

export default reviewApi;