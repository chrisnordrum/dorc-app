// use for search bar
export const sanitizeText = (value) => {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trimStart();
};

// use for names
export const sanitizeName = (value) => {
  return value
    .replace(/[^a-zA-ZÀ-ÿ' -]/g, "") // allow letters, accents, ' -
    .replace(/\s+/g, " ")
    .trimStart();
};

// Username
export const sanitizeUsername = (value) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "") // only letters, numbers, underscore
    .slice(0, 20);
};

// Email
export const sanitizeEmail = (value) => {
  return value.replace(/\s/g, "").toLowerCase();
};

// Password (minimal touch)
export const sanitizePassword = (value) => {
  return value.trim();
};
