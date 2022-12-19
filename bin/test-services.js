(async () => {
   const { exec } = require('child_process');
   const fs = require('fs');
   const { extname } = require('path');
   const sh = async (command) =>
      new Promise((resolve, reject) => exec(command, (error, stdout) => (!!error ? reject(error) : resolve(stdout))));
   const pass = (stdout, regex = /PASSED/gm) => regex.test(stdout);
   const results = {
      passed: '➖ \x1b[32mPASSED\x1b[0m\n',
      failed: '➖ \x1b[31mFAILED\x1b[0m\n',
   };
   const tests = {
      'Environment preparation': async () => {
         try {
            if (fs.existsSync('temp')) {
               console.log('   ➕ Removing previous temporary files...');
               await sh('rm -r "temp"');
            }

            console.log('   ➕ Creating temporary folder...');
            await sh('mkdir "temp"');
            await sh('mkdir "temp/.resources"');

            console.log('   ➕ Importing modules...');
            await sh('npm i');

            console.log('   ➕ Linking service...');
            await sh('npm link');

            return 'PASSED';
         } catch (error) {
            return error;
         }
      },
      'Executing service "init"': async () => {
         try {
            const init = await sh('cd "temp" && sw init --TEST');
            const source = 'temp/.swrc.js';
            const toTrue = /start: (false)/gm;
            const toFalse = /(initialCommit): (true)/gm;
            const toUncomment = /\/\/\s{0,}(chmod|dir|file|recursive|})/gm;
            const swrc = fs.readFileSync(source, 'utf-8');
            const result = swrc
               .replace(toTrue, (a) => a.replace(/false/, 'true'))
               .replace(toFalse, (a) => a.replace(/true/, 'false'))
               .replace(toUncomment, (a) => a.replace(/\/\/ /, ''));

            fs.writeFileSync(source, result);
            await sh(
               'cp .github/workflows/resources/tests/.resources/test-resource-replace.html temp/.resources/test-resource-replace.html'
            );

            return init;
         } catch (error) {
            return error;
         }
      },
      'Executing service "start"': async () => {
         const result = sh('cd "temp" && sw start --TEST');

         let start_errors = 0;

         try {
            if (process.platform !== 'win32') {
               expecteds['test.zip'] = {
                  name: 'Zip file: No compile (just copy) and extract to test content',
                  cb: async () => {
                     if (!fs.existsSync('temp/dist/test.txt')) await sh('cd "temp/dist" && unzip test.zip');
                  },
                  ext: 'txt',
                  output: 'Success',
               };
            }

            setTimeout(async () => {
               for (const expected in expecteds) {
                  try {
                     let copied = true;

                     try {
                        await sh(`cp .github/workflows/resources/tests/${expected} temp/src/${expected}`);
                     } catch (error) {
                        copied = false;
                     }

                     if (expecteds[expected]?.src) continue;

                     const { name, output } = expecteds[expected];
                     const file = expecteds[expected]?.ext
                        ? expected.replace(extname(expected), `.${expecteds[expected].ext}`)
                        : expected;

                     await new Promise((resolve) => {
                        let count = 0;
                        const limit = 100;
                        const attemp = setInterval(async () => {
                           count++;

                           if (count >= limit) {
                              clearInterval(attemp);
                              resolve();
                           }

                           if (!fs.existsSync(`temp/src/${file}`) && !fs.existsSync(`temp/src/${expected}`)) return;
                           if (!fs.existsSync(`temp/dist/${file}`) && !fs.existsSync(`temp/dist/${expected}`)) return;

                           if (expecteds[expected]?.cb) await expecteds[expected]?.cb();

                           if (fs.readFileSync(`temp/dist/${file}`, 'utf-8')?.trim()?.length === 0) return;

                           clearInterval(attemp);
                           resolve();
                        }, 100);
                     });

                     const compare = fs.readFileSync(`temp/dist/${file}`, 'utf-8');

                     console.log(copied && compare === output ? `   \x1b[32m✔\x1b[0m` : `   \x1b[31m✖\x1b[0m`, name);
                     if (!copied || compare !== output) {
                        errors.push({ [name]: compare });
                        start_errors++;
                     }
                  } catch (error) {
                     console.log(`   \x1b[31m✖\x1b[0m ${error.message}`);
                     start_errors++;
                  }
               }

               await sh('cd "temp" && touch "src/exit"');
            }, 5000);

            if (!pass(result)) return result;
            return start_errors === 0 ? 'PASSED' : 'FAILED to building files';
         } catch (error) {
            return error;
         }
      },
      'Executing service "build"': async () => {
         try {
            return await sh('cd "temp" && sw build --TEST');
         } catch (error) {
            return error;
         }
      },
   };
   const errors = [];
   const expecteds = {
      'test-file.html': {
         name: 'Building HTML',
         output:
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body></body></html>',
      },
      'test-file.css': {
         name: 'Building CSS',
         output: 'div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}',
      },
      'test-file.scss': {
         name: 'Building SCSS',
         output: 'div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}',
         ext: 'css',
      },
      'test-file.js': {
         name: 'Building JS',
         output: '"use strict";console.log("Hello World");',
      },
      'test-file.php': {
         name: 'Building PHP',
         output: '<?php echo 123;',
      },
      'test-file.phtml': {
         name: 'Building PHTML',
         output: '<?php echo 123?>',
      },
      '_header.html': {
         src: true,
      },
      'test-import.html': {
         name: 'Testing Feature: HTML Import',
         output: '<html><body><header></header></body></html>',
      },
      'test-require.js': {
         name: 'Testing Feature: Require Browser',
         output:
            '"use strict";var s=function(e){return document.querySelector(e)},sEl=function(e,r){return e.querySelector(r)},sAll=function(e){return document.querySelectorAll(e)},sElAll=function(e,r){return e.querySelectorAll(r)};',
      },
      'test-string-replace.html': {
         name: 'Testing Plug-in: String Replace',
         output: '<html><body>my-start-output</body></html>',
      },
      'test-resource-replace.html': {
         name: 'Testing Plug-in: Resource Replace',
         output: '<html><body>456</body></html>',
      },
   };

   for (const test in tests) {
      console.log(`➖ ${test}...`);

      const prove = await tests[test]();
      const passed = pass(prove);

      if (!passed) errors.push({ [test]: prove });

      console.log(results[passed ? 'passed' : 'failed']);
   }

   /* Testing FTP service */
   if (process.platform === 'linux') {
      console.log('➖ Testing FTP service...');

      const source = 'temp/.swrc.js';
      const regex = {
         root: /root: '',/gim,
         host: /host: '',/gim,
         user: /user: '',/gim,
         pass: /pass: '',/gim,
         secure: /secure: true\s\|\|\s/gim,
      };
      const swrc = fs.readFileSync(source, 'utf-8');

      let result = '';

      result = swrc.replace(regex.root, (a) => a.replace(/''/, "'/'"));
      result = result.replace(regex.host, (a) => a.replace(/''/, "'127.0.0.1'"));
      result = result.replace(regex.user, (a) => a.replace(/''/, "'test'"));
      result = result.replace(regex.pass, (a) => a.replace(/''/, "'test'"));
      result = result.replace(regex.secure, (a) => a.replace(/true\s\|\|\s/, ''));

      fs.writeFileSync(source, result);

      setTimeout(() => sh('cd "temp" && touch "src/exit"'), 5000);

      const FTP = await sh('cd "temp" && sw --TEST');
      const passed = pass(FTP, /Connected/gm);

      if (!passed) errors.push({ 'Testing FTP service:': FTP });

      console.log(results[passed ? 'passed' : 'failed']);
   }

   // if (fs.existsSync('temp')) {
   //    try {
   //       await sh('rm -r "temp"');
   //       console.log('➖ Removing temporary files...');
   //       console.log(results.passed);
   //    } catch (error) {}
   // }

   /* Exit if success */
   if (errors.length === 0) return true;

   console.log('\n--- LOGS ---\n');
   errors.forEach((error) => console.log(error));
   console.log('\n--- LOGS ---\n');

   process.exit(1);
})();
