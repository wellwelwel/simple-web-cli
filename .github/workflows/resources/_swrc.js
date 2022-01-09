module.exports = {

   workspaces: {
      src: 'src',
      dist: 'dist'
   },

   start: {
      compile: {
         js: {
            babel: true,
            uglify: true,
            exclude: {
               requireBrowser: [
                  // You can use a file extension or an absolute path
                  '.min.js',
                  '.mjs'
               ]
            }
         },
         css: {
            autoprefixer: true,
            uglifycss: true
         },
         html: {
            minify: true,
            htmlImportLikeSass: true, // If true, ignores the compilation when a HTML file name starts with _
            exclude: {
               htmlImport: [] // You can use an absolute path
            }
         },
         htaccess: {
            minify: true
         },
         php: {
            minify: true
         },
         exclude: [ // You can use a file extension or an absolute path to exclude any file from compiling
            '.min.css',
            '.min.js'
         ]
      },
      localhost: {
         enabled: true,
         port: 3030
      }
   },

   options: {
      autoUpdate: true // Updates only for patch and minor versions
   },


   /* ----------------------------------------------------------------------- */
   /* -----------------   A D V A N C E D   O P T I O N S   ----------------- */
   /* ----------------------------------------------------------------------- */

   ftp: { // Keeps empty to ignore the FTP connection
      start: { // Becareful! Set access FTP data on an external .env or add the “.swrc.js” to .gitignore
         root: '',
         host: '',
         port: 21,
         user: '',
         pass: '',
         secure: true, // If the server doesn't use SSL certification, set "explict"
         chmod: { // You can remove it to keep the server CHMOD default
            dir: 755,
            file: 644,
            recursive: true
         },
         isWindowsServer: false
      },
      build: { } // Keeps empty to use the same data as set in "ftp.start"
   },

   /**
    * You can duplicate "start.compile" in "build" and set different "start" and "build" settings
    * If you don't specify the "build.compile", it will use the settings from "start.compile"
   **/
   build: {
      level: 0, // Compression level of zip output (0: fast, ..., 9: slow)
      output: 'release', // Generate a zip and creates the root content from this name (example: "release.zip", on extract: "./release/...")
      deployZipToServer: false
   },

   plugins: {

      /**
       * Put simple-web-cli language plug-ins modules and path to an auto executable script to compile in other languages
       * Works on both "build" and "start"
      **/
      compiler: [],

      // You can create an easy to read code and on compiling, replace the specified strings:
      stringReplace: {
         strings: {
            '*your-code-string*': { // always starts and ends this string with *
               start: 'my-start-output',
               build: 'my-build-output'
            }
         },
         languages: {
            html: true,
            php: true,
            phtml: true,
            scss: true,
            css: true,
            htaccess: true,
            js: true,
            sql: false,
            others: false
         }
      },

      /**
       * You can create a mirror project folder and add static resource files to replace temporary development files by this on compiling:
       * It can works joint with "replace-string" and accepts any type of file
      **/
      resourceReplace: {
         src: '.resources',
         replace: {
            start: false,
            build: true
         }
      }
   }
};