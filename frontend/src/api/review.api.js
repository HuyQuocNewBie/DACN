import axiosClient from './axiosClient';

const reviewApi = {
  getDueCards: (deckId) => {
    const url = deckId
      ? `/review/get_due_cards.php?deck_id=${deckId}`
      : `/review/get_due_cards.php`;
    return axiosClient.get(url);
  },
  updateCardProgress: (cardId, data) => {
    return axiosClient.post(`/review/update_progress.php`, {
      card_id: cardId,
      quality: data.quality,
    });
  },
};

export default reviewApi;
