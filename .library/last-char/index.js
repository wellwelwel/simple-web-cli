const lastChar = str => /string|number/.test(typeof str) && `${str}`?.trim().length > 0 ? `${str}`.trim().slice(-1) : false;

module.exports = lastChar;