const { process_files } = require('../config');
const vReg = require('../vReg');

function no_process(file) {

   const exclude_files = process_files?.exclude || false;
   let result = false;

   if (exclude_files) {

      for (const exclude of exclude_files) {

         if (vReg(exclude).test(file)) {

            result = true;
            break;
         }
      }
   }

   return result;
}

module.exports = no_process;