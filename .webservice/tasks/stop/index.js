"use strict";

const fs = require('fs-extra');
const { sh } = require('../../modules/sh');
const { source } = require('../../modules/config');
const watchClose = require('../../modules/watch-close');

(async () => {

   console.clear();

   try {
      
      watchClose();
      
      console.log(`🛏️  ${sh.yellow}Finalizando processos${sh.reset}...`);
   }
   catch(e) {
            
      console.log(`${sh.red}${e}`);
   }
   finally {

      console.log(`🛏️  ${sh.yellow}Excluindo arquivos temporários${sh.reset}...`);

      if (fs.existsSync(`${source}/exit`)) fs.unlinkSync(`${source}/exit`);
      
      console.log();
   }
})();