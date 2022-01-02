"use strict";

const { source, to, process_files } = require('../config');
const vReg = require('../vReg');
const { minify } = require('html-minifier');
const { normalize, dirname, basename, sep } = require('path');
const fs = require('fs');
const { EOL } = require('os');
const { sh } = require('../sh');
const listFiles = require('../listFiles');

function getLine(search, content) {

   const index = content.indexOf(search);
   const tempString = content.substring(0, index);

   return tempString.split(EOL).length;
}

const putHTML = (content, file) => {

   const importRegex = /<!--.*?import\(("|')(.*)("|')\).*?-->/gim;
   const getImports = content.match(importRegex) || [ ];

   if (getImports.length > 0) {

      const backup = content;

      getImports.forEach(importHTML => {

         const extractPath = /<!--.*?import\(("|')(?<import>.*)("|')\).*?-->/gim.exec(importHTML)?.groups?.import || false;
         const finalPath = normalize(`${dirname(file)}/${extractPath.replace(/(^\.?\/)/gm, '')}`);
         const toReplace = vReg(importHTML, 'gim');

         if (!fs.existsSync(finalPath)) {

            console.log(`${sh.red}⚠${sh.reset} "${sh.cyan}${extractPath}${sh.reset}" not found. Line ${getLine(importHTML, backup)} from "${sh.cyan}${file}${sh.reset}"`);
            return;
         }

         let toImport = fs.readFileSync(finalPath, 'utf-8');

         if (importRegex.test(toImport)) toImport = putHTML(toImport, finalPath);

         content = content.replace(toReplace, toImport);
      });
   }

   return content;
};

const processHTML = async (content, file) => {

   { /* Check if other files need this file */
      const dirs = dirname(file).split(sep);
      const srcFile = basename(file);
      const preRegex = dirs.map(dir => `(${dir}\/)?`);
      const finalRegex = new RegExp(`${preRegex.join('')}${srcFile}`, 'gim');
      const files = await listFiles(source, 'html');

      for (const searchFile of files) {

         if (searchFile === file) continue;

         const searchContent = fs.readFileSync(searchFile, 'utf-8');

         if (searchContent.match(finalRegex)) fs.writeFileSync(searchFile.replace(source, to), await processHTML(searchContent, searchFile));
      }
   }

   if (!content || content?.trim().length === 0) return '';

   content = putHTML(content, file);

   if (!process_files.html) return content;

   try {

      const new_content = minify(content, {

         removeAttributeQuotes: false,
         removeComments: true,
         minifyCSS: true,
         minifyJS: true,
         preserveLineBreaks: false,
         collapseWhitespace: true,
         // conservativeCollapse: true
      });

      if (!!new_content) content = new_content.trim();
   }
   catch(e) {

      /* In case of error, the original content will be returned */
   }
   finally {

      return content;
   }
};

module.exports = processHTML;