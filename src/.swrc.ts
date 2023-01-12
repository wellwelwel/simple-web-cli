import { ConnectConfig } from 'ssh2';

export interface Compile {
   compile: {
      js: {
         /** 🎲 Enable or disable `babel` in compilation */
         babel: boolean;
         /** 🎲 Enable or disable `uglify-js` in compilation */
         uglify: boolean;
      };
      scss: boolean;
      css: {
         /** 🎲 Enable or disable `autoprefixer` in compilation */
         autoprefixer: boolean;
         /** 🎲 Enable or disable `uglifycss` in compilation */
         uglifycss: boolean;
      };
      html: {
         /** 🎲 Enable or disable `html-minifier` in compilation */
         minify: boolean;
         /** ℹ️ If true, ignores the compilation when a HTML file name starts with _ */
         htmlImportLikeSass: boolean;
         exclude?: {
            /**
             * ℹ️ You can use a relative path or a part of it
             *
             * 🤹🏻‍♀️ Put here the items that you want send just a copy from the original file to dist directory
             */
            htmlImport: string[];
         };
      };
      htaccess: {
         minify: boolean;
      };
      php: {
         minify: boolean;
      };
      /** ℹ️ You can use a file extension, a relative path or a part of it to exclude any file from compiling */
      exclude?: string[];
   };
}

export interface Local {
   workspaces: {
      src: string;
      dist: string;
   };
   start: Compile;
   /** ℹ️ You can use a file extension, a relative path or a part of it to exclude any file from compiling */
   build: {
      /** ℹ️ Compression level of zip output (0: fast to 9: slow) */
      level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      /** ℹ️ Generate a zip and creates the root content from this name (example: "release.zip", on extract: "./release/...") */
      output: string;
      /** ℹ️ If you don't specify the "build.compile", it will use the settings from "start.compile" */
      compile?: Compile;
   };
   options?: {
      /** ℹ️ Performs the first commit when starting the project for the first time */
      initialCommit?: boolean;
   };
   /** 🥷🏻 You can use your frameworks in parallel and if you wish, just define the framework's build output in the same dist directory from this workspace */
   blacklist: string[];
   /**
    * ✅ Works on both "build" and "start"
    *
    * ❌ This doesn't work on blacklisted files
    **/
   plugins: {
      /** ⏳ Coming soon: Put simple-web-cli language plug-ins modules and path to an auto executable script to compile in other languages */
      readonly compiler?: unknown[];
      stringReplace: {
         strings:
            | {
                 [key: string]: {
                    start: string;
                    build: string;
                 };
              }
            | {
                 [key: string]: {
                    start: string;
                 };
              }
            | {
                 [key: string]: {
                    build: string;
                 };
              };
         languages: {
            [key: string]: boolean;
            others: boolean;
         };
      };
      /** ℹ️ It works with "replace-string" and accepts any type of file */
      resourceReplace: {
         src: string;
         replace: {
            start: boolean;
            build: boolean;
         };
      };
   };
}

export interface SFTPAccess extends ConnectConfig {
   root: string;
   isWindowsServer?: boolean;
}

export interface SFTP extends Local {
   /** 📦 It extends all the options from `ssh2` connection and use `basic-sftp` package */
   sftp: {
      start?: SFTPAccess;
   };
}

export interface FTP extends Local {
   /** 📦 It uses `basic-ftp` package */
   ftp: {
      start?: {
         root: string;
         host: string;
         port?: number;
         user: string;
         pass: string;
         /** ℹ️ If the server doesn't use SSL certification, set "explict" */
         secure: true | 'implict' | 'explict';
         isWindowsServer?: boolean;
      };
   };
}

export type Options = Local | SFTP | FTP;

/**
 * 🤹🏻‍♀️ Auxiliary function to define the `simple-web-cli` configurations
 * @param options
 */
export function defineConfig(options: Local): Local;
export function defineConfig(options: SFTP): SFTP;
export function defineConfig(options: FTP): FTP;
export function defineConfig(options: Options): Options {
   return options;
}
