export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Ít nhất 6 ký tự
  return password && password.length >= 6;
};

export const getFormErrors = (values) => {
  const errors = {};
  if (values.email && !validateEmail(values.email)) {
    errors.email = "Email không đúng định dạng.";
  }
  if (values.password && !validatePassword(values.password)) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  return errors;
};