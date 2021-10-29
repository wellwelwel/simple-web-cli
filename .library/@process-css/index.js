const processCSS = options => {

   'use strict';

   if (!/object|undefined/.test(typeof options)) throw('An array was expected');

   /* ----------------------------- */

   const $ = require('web/selector');
   require('web/first-char');

   /* ----------------------------- */

   const head = $('head');
   const style = document.createElement('style');
   
   style.id = 'dinamic-styles';

   /* ----------------------------- */

   require('web/process-css/size-spacing');
   require('web/process-css/grid');
   require('web/process-css/border');

   /* ----------------------------- */

   const allowed = {

      height: property => size_spacing(property),
      width: property => size_spacing(property),
      padding: property => size_spacing(property),
      margin: property => size_spacing(property),
      grid: property => grid(property),
      border: property => border(property)
   };

   const properties = /undefined/.test(typeof options) ? Object.keys(allowed) : options;

   properties.forEach(property => {
      
      if (allowed[property]) allowed[property](property);
   });

   if (style.textContent.length > 0) head.appendChild(style);
};

module.exports = processCSS;