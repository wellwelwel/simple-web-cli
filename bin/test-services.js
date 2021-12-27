(async () => {

   const { exec } = require('child_process');
   const fs = require('fs');
   const sh = async command => new Promise((resolve, reject) => exec(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
   const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf-8'));
   const buildJSON = obj => orderJSON(obj, 2);
   const orderJSON = (obj, space) => {

      const allKeys = [];
      const seen = { };

      JSON.stringify(obj, (key, value) => {

         if (!(key in seen)) {

            allKeys.push(key);
            seen[key] = null;
         }

         return value;
      });

      allKeys.sort();

      return JSON.stringify(obj, allKeys, space);
   };
   const pass = (stdout, regex = /PASSED/gm) => regex.test(stdout);
   const results = {

      passed: '\x1b[32mPASSED\x1b[0m',
      failed: '\x1b[31mFAILED\x1b[0m'
   };
   const tests = {

      'Environment preparation': async () => {

         try {

            if (fs.existsSync('temp')) {

               await sh('rm -r "temp"');
               console.log('Removing previous temporary files:', results.passed);
            }

            await sh('mkdir "temp"');
            console.log('Creating temporary folder:', results.passed);

            await sh('npm i');
            console.log('Importing modules:', results.passed);

            await sh('npm link');
            console.log('Linking service:', results.passed);

            return 'PASSED';
         } catch (error) {

            return error;
         }
      },
      'Executing service "init"': async () => { try { return await sh('cd "temp" && simple-web init --TEST'); } catch (error) { return error; } },
      'Executing service "start"': async () => {

         try {

            setTimeout(() => sh('cd "temp" && touch "src/exit"'), 10000);

            return await sh('cd "temp" && simple-web start --TEST');
         } catch (error) {

            return error;
         }
      },
      'Executing service "build"': async () => { try { return await sh('cd "temp" && simple-web build --TEST'); } catch (error) { return error; } },
      'Executing service directly': async () => {

         try {

            setTimeout(() => sh('cd "temp" && touch "src/exit"'), 10000);

            return await sh('cd "temp" && simple-web --TEST');
         } catch (error) {

            return error;
         }
      }
   };
   const errors = [];

   console.clear();

   for (const test in tests) {

      const prove = await tests[test]();
      const passed = pass(prove);

      if (!passed) errors.push({ [ test ]: prove });

      console.log(`${test}:`, results[passed ? 'passed' : 'failed']);
   }

   /* Testing FTP service */
   if (process.platform === "linux") {

      const web_config = readJSON('temp/.web-config.json');

      web_config.dev.ftp.root = '/';
      web_config.dev.ftp.host = '127.0.0.1';
      web_config.dev.ftp.user = 'test';
      web_config.dev.ftp.pass = 'test';
      web_config.dev.ftp.secure = 'explict';

      fs.writeFileSync('temp/.web-config.json', buildJSON(web_config));

      setTimeout(() => sh('cd "temp" && touch "src/exit"'), 10000);

      const FTP = await sh('cd "temp" && simple-web --TEST');
      const passed = pass(FTP, /Connected/gm);

      if (!passed) errors.push({ 'Testing FTP service:': FTP });

      console.log('Testing FTP service:', results[passed ? 'passed' : 'failed']);
   }

   if (fs.existsSync('temp')) {

      await sh('rm -r "temp"');
      console.log('Removing temporary files:', results.passed);
   }

   /* Exit if success */
   if (errors.length === 0) {

      await sh('touch "passed"')
      return true;
   }

   console.log('\n--- LOGS ---\n');
   errors.forEach(error => console.log(error));
   console.log('\n--- LOGS ---\n');
})();