"use strict";

const { process_files } = require('../config');

const processPHP = content => {

   if (!content || content?.trim().length === 0) return '';
   else if (!process_files?.php?.minify) return content;

   try {

      /* Gera uma cópia do conteúdo original a ser processado */
      let new_content = content;

      /* Guarda strings do conteúdo na memória */
      const strings_PHP = new_content.match(/(('.*?')|(".*?")|(`.*?`))/gim);
      const backup_strings_PHP = { };

      /* Gera e substitui cada string por um ID */
      for (const key in strings_PHP) {

         const id = `"${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}"`;

         backup_strings_PHP[id] = strings_PHP[key];
         new_content = new_content.replace(strings_PHP[key], id);
      }

      /* Compacta o conteúdo */
      new_content = new_content
         .replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)|(\<!--[^\[][\w\W]*?-->)/gim, '') // remove comentários PHP e HTML
         .replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, ' ') // remove quebras de linhas
         .replace(/(<\?\s)|(<\?\n)|(<\?\r)|(<\?\t)/gim, '<?php ') // transcreve <? para <?php
         .replace(/\s{\s|\s{|{\s/gim, '{') // remove espaços entre {
         .replace(/\s}\s|\s}|}\s/gim, '}') // remove espaços entre }
         .replace(/\s\(\s|\s\(|\(\s/gim, '(') // remove espaços entre (
         .replace(/\s\)\s|\s\)|\)\s/gim, ')') // remove espaços entre )
         .replace(/\s\[\s|\s\[|\[\s/gim, '[') // remove espaços entre [
         .replace(/\s\]\s|\s\]|\]\s/gim, ']') // remove espaços entre ]
         .replace(/\s;\s|\s;|;\s/gim, ';') // remove espaços entre ;
         .replace(/\s:\s|\s:|:\s/gim, ':') // remove espaços entre :
         .replace(/\s-\s|\s-|-\s/gim, '-') // remove espaços entre -
         .replace(/\s\+\s|\s\+|\+\s/gim, '+') // remove espaços entre +
         .replace(/\s\*\s|\s\*|\*\s/gim, '*') // remove espaços entre *
         .replace(/\s\/\s|\s\/|\/\s/gim, '/') // remove espaços entre /
         .replace(/\s%\s|\s%|%\s/gim, '%') // remove espaços entre %
         .replace(/\s!\s|\s!|!\s/gim, '!') // remove espaços entre !
         .replace(/\s\?\s|\s\?|\?\s/gim, '?') // remove espaços entre ?
         .replace(/\s=\s|\s=|=\s/gim, '=') // remove espaços entre =
         .replace(/\s<\s|\s<|<\s/gim, '<') // remove espaços entre <
         .replace(/\s>\s|\s>|>\s/gim, '>') // remove espaços entre >
         .replace(/\s\^\s|\s\^|\^\s/gim, '^') // remove espaços entre ^
         .replace(/\sAND\s|\sAND|AND\s/gim, 'AND') // remove espaços entre AND, And ou and
         .replace(/\sOR\s|\sOR|OR\s/gim, 'OR') // remove espaços entre OR, Or ou or
         .replace(/\sXOR\s|\sXOR|XOR\s/gim, 'XOR') // remove espaços entre XOR, Xor ou xor
         .replace(/\s&\s|\s&|&\s/gim, '&') // remove espaços entre &
         .replace(/\s\|\s|\s\||\|\s/gim, '|') // remove espaços entre |
         .replace(/\s\.\s|\s\.|\.\s/gim, '.') // remove espaços entre .
         .replace(/\s,\s|\s,|,\s/gim, ',') // remove espaços entre ,
         .replace(/\s'\s|\s'|'\s/gim, '\'') // remove espaços entre '
         .replace(/\s"\s|\s"|"\s/gim, '"') // remove espaços entre "
         .replace(/\s`\s|\s`|`\s/gim, '`') // remove espaços entre `
         .replace(/<\?=\s/gim, '<?=') // remove espaço após <?=
         .replace(/ \?>/gim, '?>') // remove espaço antes de ?>
         .replace(/<\?php/gim, '<?php ') // corrige espaço após <?php
         .replace(/(?:\s)\s/gim, ' ') // remove espaços duplicados
         .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
      ;

      /* Recupera os dados das strings */
      for (const id in backup_strings_PHP) new_content = new_content.replace(id, backup_strings_PHP[id]);

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

module.exports = processPHP;