require('draftlog').into(console);

const sh = {

   yellow: '\x1b[33m',
   green: '\x1b[32m',
   cyan: '\x1b[36m',
   white: '\x1b[37m',
   blue: '\x1b[34m',
   magenta: '\x1b[35m',
   red: '\x1b[31m',

   dim: '\x1b[2m',
   underscore: '\x1b[4m',
   bright: '\x1b[22m',
   reset: '\x1b[0m',
   bold: '\x1b[1m',
   italic: '\x1b[3m',

   clear: '\x1Bc'
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

class draft {

   constructor(string, style = 'dots', start = true) {

      this.string = string;
      this.loading = {

         dots: [ '⠋', '⠋', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ],
         circle: [ '◜', '◠', '◝', '◞', '◡', '◟' ]
      };
      this.style = style;
      this.color = sh.yellow;
      this.message = console.draft('');
      this.status = {

         0: `${sh.red}✖`,
         1: `${sh.green}✔`,
         2: `${sh.yellow}⚠`,
         3: `${sh.blue}ℹ`
      };
      this.start = () => {

         let i = 0;
         let interval = this.loading[this.style] === 'dots' ? 50 : 150;

         this.timer = setInterval(() => {

            if (i >= this.loading[this.style].length) i = 0;

            const current = this.loading[this.style][i++];

            this.message(`${sh.bold}${sh.bright}${this.color}${current} ${sh.reset}${this.string}`);
         }, interval);
      };
      this.stop = (status, string = false) => {

         clearInterval(this.timer);

         if (!!string) this.string = string;
         this.message(`${sh.bold}${sh.bright}${this.status[status]} ${sh.reset}${this.string}`);

         return;
      };

      start && this.start();
   }
}

module.exports = { sh, type, draft };