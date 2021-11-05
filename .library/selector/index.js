/**
 * @param {string} element
 * @param {*} baseElement - HTML | Node Element
 * @return {HTMLElement} s - HTMLElement
 * @return {HTMLElement} sEl - HTMLElement
 * @return {NodeListOf} sAll - NodeListOf
 * @return {NodeListOf} sElAll - NodeListOf
**/

const s = element => document.querySelector(element);
const sEl = (baseElement, element) => baseElement.querySelector(element);
const sAll = element => document.querySelectorAll(element);
const sElAll = (baseElement, element) => baseElement.querySelectorAll(element);