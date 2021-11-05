/**
 * @param {Event} type
 * @param {HTMLElement} element
 * @param {NodeList} this
 * @param {Function} listener - Callback Function
 * @param {Boolean} useCapture
**/

(() => {

   function addEventListener(type, listener, useCapture = false) {
   
      this.forEach(element => {
         
         element instanceof Node && element.addEventListener(type, listener, useCapture);
      });
   }
   
   NodeList.prototype.addEventListener = addEventListener;
   Array.prototype.addEventListener = addEventListener;
})();