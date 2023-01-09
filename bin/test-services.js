import { exec } from 'child_process';
import fs from 'fs';
import { resolve, join, extname } from 'path';

(async () => {
  const sh = async command => new Promise((resolve, reject) => exec(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
  const pass = (stdout, regex = /PASSED/gm) => regex.test(stdout);
  const results = {
    passed: '➖ \x1b[32mPASSED\x1b[0m\n',
    failed: '➖ \x1b[31mFAILED\x1b[0m\n'
  };
  const tests = {
    'Environment preparation': async () => {
      try {
        if (fs.existsSync(resolve('./temp'))) {
          console.log('   ➕ Removing previous temporary files...');
          await sh('rm -r "temp"');
        }
        console.log('   ➕ Creating temporary folder...');
        await sh('mkdir "temp"');
        await sh('mkdir "temp/.resources"');
        await sh('cp "resources/package.json" "temp/package.json"');
        console.log('   ➕ Linking service...');
        await sh('cd temp && npm i file:../');
        return 'PASSED';
      } catch (error) {
        return error;
      }
    },
    'Executing service "create"': async () => {
      try {
        const create = await sh('cd "temp" && npx sw create --TEST');
        const source = 'temp/.swrc.js';
        const toTrue = /start: (false)/gm;
        const toFalse = /(initialCommit): (true)/gm;
        const toUncomment = /\/\/\s{0,}(chmod|dir|file|recursive|})/gm;
        const swrc = fs.readFileSync(resolve(source), 'utf-8');
        const result = swrc.replace(toTrue, a => a.replace(/false/, 'true')).replace(toFalse, a => a.replace(/true/, 'false')).replace(toUncomment, a => a.replace(/\/\/ /, ''));
        fs.writeFileSync(resolve(source), result);
        await sh('cp "./.github/workflows/resources/tests/.resources/test-resource-replace.html" "./temp/.resources/test-resource-replace.html"');
        return create;
      } catch (error) {
        return error;
      }
    },
    'Executing service "start"': async () => {
      const result = sh('cd "temp" && npx sw start --TEST');
      let start_errors = 0;
      try {
        if (process.platform !== 'win32') {
          expecteds['test.zip'] = {
            name: 'Zip file: No compile (just copy) and extract to test content',
            cb: async () => {
              if (!fs.existsSync(resolve('./temp/dist/test.txt'))) await sh('cd "./temp/dist" && unzip "./test.zip"');
            },
            ext: 'txt',
            output: 'Success'
          };
        }
        setTimeout(async () => {
          for (const expected in expecteds) {
            try {
              let copied = true;
              try {
                const resourcesPath = resolve('./.github/workflows/resources/tests');
                const destPath = resolve('./temp/src');
                await sh(`cp "${join(resourcesPath, expected)}" "${join(destPath, expected)}"`);
              } catch (error) {
                copied = false;
              }
              if (expecteds[expected]?.src) continue;
              const {
                name,
                output
              } = expecteds[expected];
              const file = expecteds[expected]?.ext ? expected.replace(extname(expected), `.${expecteds[expected].ext}`) : expected;
              await new Promise(resolve$1 => {
                let count = 0;
                const limit = 100;
                const attemp = setInterval(async () => {
                  count++;
                  if (count >= limit) {
                    clearInterval(attemp);
                    resolve$1();
                  }
                  if (!fs.existsSync(resolve(`./temp/src/${file}`)) && !fs.existsSync(resolve(`./temp/src/${expected}`))) return;
                  if (!fs.existsSync(resolve(`./temp/dist/${file}`)) && !fs.existsSync(resolve(`./temp/dist/${expected}`))) return;
                  if (expecteds[expected]?.cb) await expecteds[expected]?.cb();
                  if (fs.readFileSync(resolve(`./temp/dist/${file}`), 'utf-8')?.trim()?.length === 0) return;
                  clearInterval(attemp);
                  resolve$1();
                }, 100);
              });
              const compare = fs.readFileSync(resolve(`./temp/dist/${file}`), 'utf-8');
              console.log(copied && compare === output ? `   \x1b[32m✔\x1b[0m` : `   \x1b[31m✖\x1b[0m`, name);
              if (!copied || compare !== output) {
                errors.push({
                  [name]: compare
                });
                start_errors++;
              }
            } catch (error) {
              console.log(`   \x1b[31m✖\x1b[0m ${error.message}`);
              start_errors++;
            }
          }
          await sh('cd "temp" && touch "./src/exit"');
        }, 5000);
        if (!pass(result)) return result;
        return start_errors === 0 ? 'PASSED' : 'FAILED to building files';
      } catch (error) {
        return error;
      }
    },
    'Executing service "build"': async () => {
      try {
        return await sh('cd "./temp" && npx sw build --TEST');
      } catch (error) {
        return error;
      }
    }
  };
  const errors = [];
  const expecteds = {
    'test-file.html': {
      name: 'Building HTML',
      output: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body></body></html>'
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
      output: '!function(){"use strict";console.log("Hello World")}();'
    },
    'test-file.php': {
      name: 'Building PHP',
      output: '<?php echo 123;'
    },
    'test-file.phtml': {
      name: 'Building PHTML',
      output: '<?php echo 123?>'
    },
    '_header.html': {
      src: true
    },
    'test-import.html': {
      name: 'Testing Feature: HTML Import',
      output: '<html><body><header></header></body></html>'
    },
    'test-string-replace.html': {
      name: 'Testing Plug-in: String Replace',
      output: '<html><body>my-start-output</body></html>'
    },
    'test-resource-replace.html': {
      name: 'Testing Plug-in: Resource Replace',
      output: '<html><body>456</body></html>'
    }
  };
  for (const test in tests) {
    console.log(`➖ ${test}...`);
    const prove = await tests[test]();
    const passed = pass(prove);
    if (!passed) errors.push({
      [test]: prove
    });
    console.log(results[passed ? 'passed' : 'failed']);
  }
  if (fs.existsSync('temp')) {
    try {
      await sh('rm -r "temp"');
      console.log('➖ Removing temporary files...');
      console.log(results.passed);
    } catch (error) {}
  }
  if (errors.length === 0) return true;
  console.log('\n--- LOGS ---\n');
  errors.forEach(error => console.log(error));
  console.log('\n--- LOGS ---\n');
  process.exit(1);
})();
