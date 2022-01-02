/**
 * @param {string} str
 * @return {boolean}
**/

const isEmpty = str => str?.trim().length === 0;
const notEmpty = str => str?.trim().length > 0;

module.exports = { isEmpty, notEmpty };