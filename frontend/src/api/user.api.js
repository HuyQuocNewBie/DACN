import axiosClient from './axiosClient';

const userApi = {
  getStatistics: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));

    return {
      total_decks: 4,
      cards_learned: 156,
      mastered_count: 89,
      streak: 5, // 5 ngày liên tiếp
      chart_data: [12, 19, 3, 5, 2, 3, 9], // Số thẻ học mỗi ngày trong tuần
      upcoming_reviews: 15, // Số thẻ cần học hôm nay
    };

    // Khi có backend thật:
    // return axiosClient.get('/user/statistics');
  },

  getProfile: () => axiosClient.get('/user/profile'),
};

export default userApi;