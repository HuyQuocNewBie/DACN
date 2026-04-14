import axiosClient from './axiosClient';

const exploreApi = {
  getPublicDecks: (params) => {
    return axiosClient.get('/explore/decks', { params });
  },

  getPublicDeckDetail: (deckId) => {
    return axiosClient.get(`/explore/decks/${deckId}`);
  },

  downloadDeck: (deckId) => {
    return axiosClient.post(`/explore/decks/${deckId}/clone`);
  }
};

export default exploreApi;