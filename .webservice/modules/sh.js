const sh = {

   yellow: "\x1b[33m",
   green: "\x1b[32m",
   cyan: "\x1b[36m",
   white: "\x1b[37m",
   blue: "\x1b[34m",
   magenta: "\x1b[35m",
   red: "\x1b[31m",
   
   dim: "\x1b[2m",
   underscore: "\x1b[4m",
   bright: "\x1b[22m",
   reset: "\x1b[0m",
   bold: "\x1b[1m",
   italic: "\x1b[3m"
};

const colorByType = {

   html: sh.cyan,
   php: sh.magenta,
   css: sh.blue,
   scss: sh.blue,
   js: sh.yellow
};

function type(file, ext = false) {

   let type;

   if (file.includes('.html')) type = 'html';
   else if (file.includes('.php')) type = 'php';
   else if (file.includes('.css')) type = 'css';
   else if (file.includes('.scss')) type = 'scss';
   else if (file.includes('.js')) type = 'js';

   if (ext) return `${colorByType[type] || sh.cyan}${type?.toUpperCase() ? type.toUpperCase() : file.split('.').pop().toUpperCase() || '??'}`;
   else return colorByType[type] || sh.white;
}

module.exports = { sh, type };