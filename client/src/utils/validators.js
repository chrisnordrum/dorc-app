export const validateName = (value) => {
  return /^[a-zA-ZÀ-ÿ' -]{2,50}$/.test(value.trim());
};

export const validateUsername = (value) => {
  return /^[a-z0-9_]{3,20}$/.test(value);
};

export const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const validatePassword = (value) => {
  return value.length >= 8;
};
