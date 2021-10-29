"use strict";

const { process_files } = require('../config');

const processHTML = content => {

   if (!content || content?.trim().length === 0) return '';
   else if (!process_files.html) return content;

   const randomID = () => `{${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}}`;

   try {

      /* Gera uma cópia do conteúdo original a ser processado */
      let new_content = content;

      /* Guarda <style> e <script> do conteúdo na memória */
      const inline_styles = new_content.match(/(<style>|<style type="text\/css">)(.|\n)*?<\/style>/gim);
      const inline_scripts = new_content.match(/(<script>|<script type="application\/javascript">)(.|\n)*?<\/script>/gim);
      const backup_inline_styles = { };
      const backup_inline_scripts = { };
      const backup_styles = { };
      const backup_strings_JS = { };
      
      /* CSS */
      for (const key_inline_style in inline_styles) {
         
         /* Gera e substitui cada <style> por um ID */
         const id_inline_style = randomID();
         /* Transcreve o id de cada <style> */
         new_content = new_content.replace(inline_styles[key_inline_style], id_inline_style);
   
         /* Guarda o conteúdo interno de cada seletor css do <style> atual na memória */
         const styles = inline_styles[key_inline_style].match(/{(.|\n)*?}/gim);

         for (const key_style in styles) {
            
            /* Gera e substitui cada conteúdo interno dos selectores css por um ID */
            const id_style = randomID();
            /* Atribui o id no lugar do <style> */
            inline_styles[key_inline_style] = inline_styles[key_inline_style].replace(styles[key_style], id_style);
            /* Atribui o id no lugar do conteúdo do seletor css */
            backup_inline_styles[id_inline_style] = inline_styles[key_inline_style].replace(id_style, backup_styles[id_style]);

            /* Compacta o conteúdo dos seletores css */
            backup_styles[id_style] = styles[key_style]
               .replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)/gim, '') // remove comentários
               .replace(/[\s]{2,}/gim, ' ') // remove espaços desnecessários
               .replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, ' ') // remove quebras de linhas
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
               .replace(/\s&\s|\s&|&\s/gim, '&') // remove espaços entre &
               .replace(/\s\|\s|\s\||\|\s/gim, '|') // remove espaços entre |
               .replace(/\s\.\s|\s\.|\.\s/gim, '.') // remove espaços entre .
               .replace(/\s,\s|\s,|,\s/gim, ',') // remove espaços entre ,
               .replace(/\s'\s|\s'|'\s/gim, '\'') // remove espaços entre '
               .replace(/\s"\s|\s"|"\s/gim, '"') // remove espaços entre "
               .replace(/\s`\s|\s`|`\s/gim, '`') // remove espaços entre `
               .replace(/;}/gim, '}') // remove ; desnecessários
               .replace(/(?:\s)\s/gim, ' ') // remove espaços duplicados
               .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
            ;

            /* Compacta o conteúdo do <style> e os seletores css */
            backup_inline_styles[id_inline_style] = inline_styles[key_inline_style]
               .replace(/[\s]{2,}/gim, ' ') // remove espaços desnecessários
               .replace(/[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, '') // remove quebras de linhas
               .replace(/\s{\s|\s{|{\s/gim, '{') // remove espaços entre {
               .replace(/\s}\s|\s}|}\s/gim, '}') // remove espaços entre }
               .replace(/\[\s/gim, '[') // remove espaços dentro de [
               .replace(/\s\]/gim, ']') // remove espaços dentro de ]
               .replace(/\s=\s|\s=|=\s/gim, '=') // remove espaços entre =
               .replace(/\s<\s|\s<|<\s/gim, '<') // remove espaços entre <
               .replace(/\s>\s|\s>|>\s/gim, '>') // remove espaços entre >
               .replace(/\s~\s|\s~|~\s/gim, '~') // remove espaços entre ~
               .replace(/(?:\s)\s/gim, ' ') // remove espaços duplicados
               .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
            ;
         }
      }

      /* JS */
      for (const key in inline_scripts) {
         
         /* Gera e substitui cada <script> por um ID */
         const id_inline_script = randomID();
         /* Transcreve o id de cada <script> */
         new_content = new_content.replace(inline_scripts[key], id_inline_script);

         /* Guarda strings do conteúdo na memória */
         const strings_JS = inline_scripts[key].match(/(('.*?')|(".*?")|(`.*?`))/gim);
      
         /* Gera e substitui cada string por um ID */
         for (const key_strings_js in strings_JS) {
      
            const id = randomID();

            backup_strings_JS[id] = strings_JS[key_strings_js];
            inline_scripts[key] = inline_scripts[key].replace(strings_JS[key_strings_js], id);
         }

         /* Guarda <script> do conteúdo na memória */
         backup_inline_scripts[id_inline_script] = inline_scripts[key]
            .replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)|(\<!--[^\[][\w\W]*?-->)/gim, '') // remove comentários JS e HTML
            .replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, ' ') // remove quebras de linhas
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
            .replace(/\s&\s|\s&|&\s/gim, '&') // remove espaços entre &
            .replace(/\s\|\s|\s\||\|\s/gim, '|') // remove espaços entre |
            .replace(/\s\.\s|\s\.|\.\s/gim, '.') // remove espaços entre .
            .replace(/\s,\s|\s,|,\s/gim, ',') // remove espaços entre ,
            .replace(/\s'\s|\s'|'\s/gim, '\'') // remove espaços entre '
            .replace(/\s"\s|\s"|"\s/gim, '"') // remove espaços entre "
            .replace(/\s`\s|\s`|`\s/gim, '`') // remove espaços entre `
            .replace(/;}/gim, '}') // remove ; desnecessários
            .replace(/(?:\s)\s/gim, ' ') // remove espaços duplicados
            .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
         ;
      }

      /* HTML */

      /* Compacta o conteúdo HTML */
      new_content = new_content
         .replace(/\<!--[^\[][\w\W]*?-->/gim, '') // remove comentários (inline e multiline)
         .replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, '') // remove linhas e espaços vazios
         .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
      ;

      /* Gravar todas alterações no novo conteúdo */

      /* Recupera os dados compactados dos <styles> */
      for (const id in backup_inline_styles) new_content = new_content.replace(id, backup_inline_styles[id]);
      /* Recupera os dados compactados dos conteúdos internos dos seletores css */
      for (const id in backup_styles) new_content = new_content.replace(id, backup_styles[id]);
      /* Recupera os dados compactados dos <script> */
      for (const id in backup_inline_scripts) new_content = new_content.replace(id, backup_inline_scripts[id]);
      /* Recupera os dados das strings JS */
      for (const id in backup_strings_JS) new_content = new_content.replace(id, backup_strings_JS[id]);

      /* Recupera novo conteúdo se tudo ocorreu corretamente */
      if (!!new_content) content = new_content.trim();
   }
   catch(e) {
      
      /* Em caso de erro, será retornado o conteúdo original */
      console.log('Error: ', e);
   }
   finally {
      
      return content;
   }
}

module.exports = processHTML;