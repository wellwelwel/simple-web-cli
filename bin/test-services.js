(async () => {

   const { exec } = require('child_process');
   const fs = require('fs');
   const sh = async command => new Promise((resolve, reject) => exec(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
   const pass = stdout => /PASSED/gm.test(stdout);
   const tests = {

      'Environment preparation': async () => {

         try {

            if (fs.existsSync('temp')) await sh('rm -r "temp"');
            console.log('Removing previous temporary files:', true);

            await sh('mkdir "temp"');
            console.log('Creating temporary folder:', true);

            await sh('npm i');
            console.log('Importing modules:', true);

            await sh('npm link');
            console.log('Linking service:', true);

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
      },
   };
   const errors = [];

   console.clear();

   for (const test in tests) {

      const prove = await tests[test]();
      const passed = pass(prove);

      if (!passed) errors.push({ [ test ]: prove });

      console.log(`${test}:`, passed);
   }

   if (fs.existsSync('temp')) await sh('rm -r "temp"');
   console.log('Removing temporary files:', true);

   /* Exit if success */
   if (errors.length === 0) return true;

   console.log('\n--- LOGS ---\n');
   console.log(errors);
   console.log('\n--- LOGS ---\n');

   /* Intentional broke */
   await sh('exit 1');
})();