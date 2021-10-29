const firstChar = str => /string|number/.test(typeof str) && `${str}`?.trim().length > 0 ? `${str}`.charAt(0) : false;

module.exports = firstChar;