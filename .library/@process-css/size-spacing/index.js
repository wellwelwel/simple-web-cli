function size_spacing(property) {

   'use strict';

   const default_props = { };
   
   /* ----------------------------- */

   function set_default_props(selector, prop) {

      const general_props = {
         
         [selector]: `${prop}:{v}{u}`,
      };
      const spacing_props = {

         [`${selector}t`]: `${prop}-top:{v}{u}`,
         [`${selector}b`]: `${prop}-bottom:{v}{u}`,
         [`${selector}l`]: `${prop}-left:{v}{u}`,
         [`${selector}r`]: `${prop}-right:{v}{u}`,
         [`${selector}v`]: `${prop}-top:{v}{u};${prop}-bottom:{v}{u}`,
         [`${selector}h`]: `${prop}-left:{v}{u};${prop}-right:{v}{u}`,
      };
      
      if (!/w|h/.test(selector)) Object.assign(general_props, spacing_props);

      return general_props;
   }

   function applyStyle(dinamic_style) {
      
      const array_dinamic_style = dinamic_style.split('-');
   
      const prop = array_dinamic_style[0];
      const val = array_dinamic_style[1];
      const un = array_dinamic_style[2]?.replace('pct', '%') || 'px';
      const selector = firstChar(prop);

      const isValid = default_props[selector][prop] || false;
      if (!isValid) return;

      const styles = default_props[selector][prop]?.replace(/{v}/g, val).replace(/{u}/g, un);
      const rules = `.${dinamic_style}{${styles}}`;

      if (!RegExp(rules).test(style.textContent)) style.textContent += rules;
   }

   /* ----------------------------- */

   try {

      const selector = firstChar(property);
      const valid_class = RegExp(`(^${selector}.?-\\d+)(-(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|pct))?`, 'g');
      const general_selectors = [ `[class*=${selector}-]` ];
      const spacing_selectors = [

         `[class*=${selector}t-]`,
         `[class*=${selector}b-]`,
         `[class*=${selector}l-]`,
         `[class*=${selector}r-]`,
         `[class*=${selector}v-]`,
         `[class*=${selector}h-]`
      ];

      if (!/w|h/.test(selector)) general_selectors.push(spacing_selectors);

      const elements = $(general_selectors.join(','), 1);
      if (elements.length === 0) return;

      default_props[selector] = set_default_props(selector, property);
      elements.forEach(e => e.classList.forEach(name => name.match(valid_class)?.forEach(dinamic_style => applyStyle(dinamic_style))));
   }
   catch (err) {
      
      console.error(err);
   }
}