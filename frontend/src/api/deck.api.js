import axiosClient from './axiosClient';

const deckApi = {
  // Giả lập lấy danh sách bộ thẻ
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 600)); // Giả lập độ trễ mạng
    
    return [
      { id: 1, title: 'Tiếng Anh Giao Tiếp', description: 'Các mẫu câu thông dụng hàng ngày', cards_count: 50, color: '#4F46E5' },
      { id: 2, title: 'ReactJS Hooks', description: 'Ghi nhớ cách dùng useEffect, memo...', cards_count: 12, color: '#0EA5E9' },
      { id: 3, title: 'Từ vựng JLPT N3', description: 'Danh sách Kanji và Từ vựng', cards_count: 120, color: '#EF4444' },
      { id: 4, title: 'Cấu trúc dữ liệu', description: 'Array, Linked List, Tree...', cards_count: 25, color: '#10B981' },
    ];

    // Khi có backend thật, dùng dòng này:
    // return axiosClient.get('/decks');
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { id, title: 'Bộ thẻ mẫu', description: 'Mô tả chi tiết', cards: [] };
  },

  create: (data) => axiosClient.post('/decks', data),
};

export default deckApi;