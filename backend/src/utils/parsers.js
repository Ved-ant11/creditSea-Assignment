const toNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
};

const cleanText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\s+/g, " ").trim();
};

const asArray = (value) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

module.exports = {
  toNumber,
  cleanText,
  asArray,
};
