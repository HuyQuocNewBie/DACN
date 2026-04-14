import { toast } from 'react-hot-toast';

export const handleError = (error) => {
  const message = error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại!";
  
  if (error.response?.status === 401) {
    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  } else if (error.response?.status === 403) {
    toast.error("Bạn không có quyền thực hiện hành động này.");
  } else {
    toast.error(message);
  }

  console.error("[API Error]:", error);
  return message;
};