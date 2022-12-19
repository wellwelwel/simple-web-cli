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
                  // You can use a file extension, a relative path or a part of it
                  '.min.js',
                  '.mjs'
               ]
            }
         },
         scss: true,
         css: {
            autoprefixer: true,
            uglifycss: true
         },
         html: {
            minify: true,
            htmlImportLikeSass: true, // If true, ignores the compilation when a HTML file name starts with _
            exclude: {
               htmlImport: [] // You can use a relative path or a part of it
            }
         },
         htaccess: {
            minify: true
         },
         php: {
            minify: true
         },
         exclude: [ // You can use a file extension, a relative path or a part of it to exclude any file from compiling
            '.min.css',
            '.min.js'
         ]
      },
   },

   /**
    * Don't process neither copy source file to dist path
    * You can use your frameworks in parallel and if you wish, you can define the framework's build output in the same dist directory from this workspace
    * Remove an item from blacklist if you want send just a copy from the original file to dist directory from this workspace
   **/
   blacklist: [
      // You can use a file extension, a relative path or a part of it to exclude any file from compiling
      '.coffee',
      '.jsx',
      '.less',
      '.pug',
      '.ts',
      '.tsx',
      '.git/',
      'node_modules',
   ],

   options: {
      initialCommit: true, // Performs the first commit when starting the project for the first time
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
         secure: true || 'explict', // If the server doesn't use SSL certification, set "explict"
         isWindowsServer: false
      },
      build: { } // Keeps empty to use the same data as set in "ftp.start"
   },

   /**
    * You can duplicate "start.compile" in "build" and set different "start" and "build" settings
    * If you don't specify the "build.compile", it will use the settings from "start.compile"
   **/
   build: {
      level: 9, // Compression level of zip output (0: fast, ..., 9: slow)
      output: 'release', // Generate a zip and creates the root content from this name (example: "release.zip", on extract: "./release/...")
   },

   /**
    * Works on both "build" and "start"
    * This doesn't work on blacklisted files
   **/
   plugins: {

      // Coming soon: Put simple-web-cli language plug-ins modules and path to an auto executable script to compile in other languages
      compiler: [],

      // You can create an easy to read code and on compiling, replace the specified strings:
      stringReplace: {
         strings: {
            '*your-code-string*': { // always starts and ends the key string with *
               start: 'my-start-output',
               build: 'my-build-output'
            }
         },
         /**
          * If you want more specific extensions, you can add them here
          * By default, unlisted extesions are set as "false"
         **/
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