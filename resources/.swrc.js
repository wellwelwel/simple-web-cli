// @ts-check

import { defineConfig } from 'simple-web-cli';

export default defineConfig({
   workspaces: {
      src: 'src',
      dist: 'dist',
   },
   start: {
      compile: {
         js: {
            babel: true,
            uglify: true,
         },
         scss: true,
         css: {
            autoprefixer: true,
            uglifycss: true,
         },
         html: {
            minify: true,
            htmlImportLikeSass: true,
            exclude: {
               htmlImport: [],
            },
         },
         htaccess: {
            minify: true,
         },
         php: {
            minify: true,
         },
         exclude: ['.min.css', '.min.js'],
      },
   },
   build: {
      level: 9,
      output: 'release',
   },
   options: {
      initialCommit: true,
   },

   /* --------------------------------------------- */
   /* ----   A D V A N C E D   O P T I O N S   ---- */
   /* --------------------------------------------- */

   // 👮🏻‍♂️ Don't process neither copy source file to dist path
   blacklist: ['.coffee', '.jsx', '.less', '.pug', '.tsx', '.git/', 'node_modules'],

   /**
    * 🔒 You can only use one protocol: `SFTP` or `FTP`
    * ❗️ Becareful: set access FTP data in an external .env or add the “.swrc.js” to .gitignore
    */

   // sftp: {
   //    start: {
   //       root: '',
   //       host: '',
   //       username: '',
   //       password: '',
   //    },
   // },

   /** or */

   // ftp: {
   //    start: {
   //       root: '',
   //       host: '',
   //       user: '',
   //       pass: '',
   //       secure: true,
   //    },
   // },

   plugins: {
      // ℹ️ You can create an easy to read code and on compiling, replace the specified strings
      stringReplace: {
         strings: {
            // ❗️ Always starts and ends the key string with: *
            '*your-code-string*': {
               start: 'my-start-output',
               build: 'my-build-output',
            },
         },

         // ℹ️ If you want more specific extensions, you can add them here
         languages: {
            html: true,
            php: true,
            phtml: true,
            scss: true,
            css: true,
            htaccess: true,
            js: true,
            sql: false,
            others: false,
         },
      },

      // 🔄 You can create a mirror project folder and add static resource files to replace temporary development files by this on compiling
      resourceReplace: {
         src: '.resources',
         replace: {
            start: false,
            build: true,
         },
      },
   },
});
