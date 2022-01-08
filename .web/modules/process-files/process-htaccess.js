"use strict";

const { process_files } = require('../config');

const processHTACCESS = content => {

   if (!content || content?.trim().length === 0) return '';
   else if (!process_files?.htaccess?.minify) return content;

   try {

      /* Gera uma cópia do conteúdo original a ser processado */
      let new_content = content;

      /* Compacta o conteúdo */
      new_content = content
         .replace(/#.*/gim, '') // remove comentários
         .replace(/^\s+|\s+$/gim, '\r\n') // remove espaços desnecessários
         .replace(/(\t{2,})|(\r{2,})|(\n{2,})/gim, '') // remove linhas e espaços vazios
         .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
      ;

      /* Recupera novo conteúdo se tudo ocorreu corretamente */
      if (!!new_content) content = new_content.trim();
   }
   catch(e) {

      /* Em caso de erro, será retornado o conteúdo original */
   }
   finally {

      return content;
   }

}

module.exports = processHTACCESS;