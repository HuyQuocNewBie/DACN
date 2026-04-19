export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: "Vui lòng nhập Email" };
  if (/\s/.test(email)) return { isValid: false, message: "Email không được chứa khoảng trắng!" };
  if (!email.endsWith("@gmail.com")) return { isValid: false, message: "Email phải là @gmail.com!" };
  
  const localPart = email.split('@')[0];
  
  if (localPart.length < 5 || localPart.length > 64) {
    return { isValid: false, message: "Tên Gmail (trước @) phải từ 5 đến 64 ký tự!" };
  }
  
  return { isValid: true };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: "Vui lòng nhập mật khẩu" };
  
  if (password.length < 8 || password.length > 64) {
    return { isValid: false, message: "Mật khẩu phải từ 8 đến 64 ký tự!" };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumOrSpec = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLetter || !hasNumOrSpec) {
    return { isValid: false, message: "Mật khẩu bao gồm chữ cái và ít nhất một số hoặc ký tự đặc biệt!" };
  }

  return { isValid: true };
};