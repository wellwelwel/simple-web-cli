function border() {

   'use strict';

   const default_borders = {
      
      b: 'border:{v}{u} {s}',
      bt: 'border-top:{v}{u} {s}',
      bb: 'border-bottom:{v}{u} {s}',
      bl: 'border-left:{v}{u} {s}',
      br: 'border-right:{v}{u} {s}',
      bv: 'border-top:{v}{u} {s};border-bottom:{v}{u} {s}',
      bh: 'border-left:{v}{u} {s};border-right:{v}{u} {s}',
   };

   try {
   
      const elements = $('[class*="b-"],[class*="bt-"],[class*="bb-"],[class*="bl-"],[class*="br-"],[class*="bv-"],[class*="bh-"]', 1);
      elements.forEach(element => {
         
         element.classList.forEach(valid_class => {

            if (!/(^b.?-\d+)((-([a-z]+))?){1,2}/.test(valid_class)) return;

            const border_units = /cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|pct/;
            const border_styles = /dashed|dotted|double|groove|hidden|outset|ridge|solid/;
            
            const array_style = valid_class.split('-');
            
            const border_direction = array_style[0];
            const border_width = array_style[1];
            const border_unit = array_style[2] ? border_units.test(array_style[2]) ? array_style[2] : 'px' : 'px';
            const border_style = border_styles.test(array_style[3]) ? array_style[3] : !!border_styles.test(array_style[2]) ? array_style[2] : 'solid' || 'solid';            

            console.log(valid_class+':', border_direction, border_width, border_unit, border_style);

            const isValid = default_borders[border_direction] || false;
            if (!isValid) return;

            const styles = default_borders[border_direction].replace(/{v}/g, border_width).replace(/{u}/g, border_unit).replace(/{s}/g, border_style);
            const rules = `.${valid_class}{${styles}}`;

            if (!RegExp(rules).test(style.textContent)) style.textContent += rules;
         });
      });
   }
   catch (err) {
      
      console.error(err);
   }
}