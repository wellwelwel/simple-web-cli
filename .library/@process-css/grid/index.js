function grid() {

   'use strict';

   try {
   
      const elements = $('[class*="col-"],[class*="row-"]', 1);
      elements.forEach(element => {
         
         element.classList.forEach(valid_class => {
   
            if (!/^(col|row).?-\d+/.test(valid_class)) return;
   
            const array_style = valid_class.split('-');
            const direction = array_style[0] === 'col' ? 'column' : 'row';
            const value = array_style[1];
            const rules = `.${valid_class}{-ms-grid-${direction}-span:${value};grid-${direction}:span ${value}}`;
            if (!RegExp(rules).test(style.textContent)) style.textContent += rules;
         });
      });
   }
   catch (err) {
      
      console.error(err);
   }
}