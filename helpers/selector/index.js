/**
 * @param {string} element
 * @param {*} baseElement - HTML | Node Element
 * @return {HTMLElement} s - HTMLElement
 * @return {HTMLElement} sEl - HTMLElement
 * @return {NodeListOf} sAll - NodeListOf
 * @return {NodeListOf} sElAll - NodeListOf
 **/

export const s = (element) => document.querySelector(element);
export const sEl = (baseElement, element) => baseElement.querySelector(element);
export const sAll = (element) => document.querySelectorAll(element);
export const sElAll = (baseElement, element) => baseElement.querySelectorAll(element);
