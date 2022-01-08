(async () => {

   const { exec } = require('child_process');
   const fs = require('fs');
   const { extname } = require('path');
   const sh = async command => new Promise((resolve, reject) => exec(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
   // const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf-8'));
   // const buildJSON = obj => orderJSON(obj, 2);
   // const orderJSON = (obj, space) => {

   //    const allKeys = [];
   //    const seen = { };

   //    JSON.stringify(obj, (key, value) => {

   //       if (!(key in seen)) {

   //          allKeys.push(key);
   //          seen[key] = null;
   //       }

   //       return value;
   //    });

   //    allKeys.sort();

   //    return JSON.stringify(obj, allKeys, space);
   // };
   const pass = (stdout, regex = /PASSED/gm) => regex.test(stdout);
   const results = {

      passed: '➖ \x1b[32mPASSED\x1b[0m\n',
      failed: '➖ \x1b[31mFAILED\x1b[0m\n'
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
            return init;
         } catch (error) {

            return error;
         }
      },
      'Executing service "start"': async () => {

         let start_errors = 0;

         try {

            setTimeout(async () => {

               for (const expected in expecteds) {

                  try {

                     let copied = true;

                     try {

                        await sh(`cp ".github/workflows/resources/tests/${expected}" "temp/src/${expected}"`);
                     } catch (error) {

                        copied = false;
                     }

                     if (expecteds[expected]?.src) continue;

                     const { name, output } = expecteds[expected];
                     const file = expecteds[expected]?.ext ? expected.replace(extname(expected), `.${expecteds[expected].ext}`) : expected;

                     await new Promise(resolve => {

                        let count = 0;
                        const limit = 10000;
                        const attemp = setInterval(() => {

                           count++;

                           if (count >= limit) {

                              clearInterval(attemp);
                              resolve();
                           }
                           if (!fs.existsSync(`temp/.main/${file}`)) return;
                           if (fs.readFileSync(`temp/.main/${file}`, 'utf-8')?.trim()?.length === 0) return;

                           clearInterval(attemp);
                           resolve();
                        });
                     });

                     const compare = fs.readFileSync(`temp/.main/${file}`, 'utf-8');

                     console.log(copied && compare === output ? `   \x1b[32m✔\x1b[0m` : `   \x1b[31m✖\x1b[0m`, name);
                     if (!copied || compare !== output) {

                        errors.push({ [ name ]: compare });
                        start_errors++;
                     }
                  } catch (error) {

                     console.log(`   \x1b[31m✖\x1b[0m ${error.message}`);
                     start_errors++
                  }
               }

               await sh('cd "temp" && touch "src/exit"');
            }, 5000);

            const result = await sh('cd "temp" && sw start --TEST');

            if (!pass(result)) return result;
            return start_errors === 0 ? 'PASSED' : 'FAILED to building files';
         } catch (error) {

            return error;
         }
      },
      'Executing service "build"': async () => { try { return await sh('cd "temp" && sw build --TEST'); } catch (error) { return error; } }
   };
   const errors = [];
   const expecteds = {

      'test-file.html': {

         name: 'Building HTML',
         output: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body></body></html>'
      },
      '_header.html': {

         src: true
      },
      'test-import.html': {

         name: 'Testing "HTML Import"',
         output: '<html><body><header></header></body></html>'
      },
      'test-file.css': {

         name: 'Building CSS',
         output: 'div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}'
      },
      'test-file.scss': {

         name: 'Building SCSS',
         output: 'div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}',
         ext: 'css'
      },
      'test-file.js': {

         name: 'Building JS',
         output: '"use strict";console.log("Hello World");'
      },
      'test-require.js': {

         name: 'Testing JS "Require Browser"',
         output: '"use strict";var s=function(t){return document.querySelector(t)},sEl=function(t,n){return t.querySelector(n)},sAll=function(t){return document.querySelectorAll(t)},sElAll=function(t,n){return t.querySelectorAll(n)},isEmpty=function(t){return 0===(null==t?void 0:t.trim().length)},notEmpty=function(t){return 0<(null==t?void 0:t.trim().length)};'
      },
      'test-file.php': {

         name: 'Building PHP',
         output: '<?php echo 123;'
      },
      'test-file.phtml': {

         name: 'Building PHTML',
         output: '<?php echo 123?>'
      }
   };

   console.clear();

   for (const test in tests) {

      console.log(`➖ ${test}...`);

      const prove = await tests[test]();
      const passed = pass(prove);

      if (!passed) errors.push({ [ test ]: prove });

      console.log(results[passed ? 'passed' : 'failed']);
   }

   /* Testing FTP service */
   // if (process.platform === "linux") {

   //    console.log('➖ Testing FTP service...');

   //    const web_config = readJSON('temp/.web-config.json');

   //    web_config.dev.ftp.root = '/';
   //    web_config.dev.ftp.host = '127.0.0.1';
   //    web_config.dev.ftp.user = 'test';
   //    web_config.dev.ftp.pass = 'test';
   //    web_config.dev.ftp.secure = 'explict';

   //    fs.writeFileSync('temp/.web-config.json', buildJSON(web_config));

   //    setTimeout(() => sh('cd "temp" && touch "src/exit"'), 5000);

   //    const FTP = await sh('cd "temp" && sw --TEST');
   //    const passed = pass(FTP, /Connected/gm);

   //    if (!passed) errors.push({ 'Testing FTP service:': FTP });

   //    console.log(results[passed ? 'passed' : 'failed']);
   // }

   if (fs.existsSync('temp')) {

      try {

         await sh('rm -r "temp"');
         console.log('➖ Removing temporary files...');
         console.log(results.passed);
      } catch (error) { }
   }

   /* Exit if success */
   if (errors.length === 0) return true;

   console.log('\n--- LOGS ---\n');
   errors.forEach(error => console.log(error));
   console.log('\n--- LOGS ---\n');

   process.exit(1);
})();