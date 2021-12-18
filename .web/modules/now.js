'use strict';

module.exports = () => {

   const d = new Date();

   let n = '';

   n += d.getDate().toString().padStart(2, '0') + '/';
   n += (d.getMonth() + 1).toString().padStart(2, '0') + '/';
   n += d.getFullYear().toString() + ' ';
   n += d.getHours().toString().padStart(2, '0') + ':';
   n += d.getMinutes().toString().padStart(2, '0') + ':';
   n += d.getSeconds().toString().padStart(2, '0');

   return n;
};