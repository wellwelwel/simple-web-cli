(() => {

   const { execSync } = require('child_process');
   const fs = require('fs');
   const { EOL } = require('os');
   const commands = require('./modules/commands');
   
   /* On missing, recreats the default resources */
   (() => {

      const files = [
   
         { dest: '.web-config.json', src: `${__dirname}/resources/_web-config.json` },
         { dest: '.web-replace.json', src: `${__dirname}/resources/_web-replace.json` },
      ];
   
      files.forEach(file => {
   
         const { src, dest } = file;
   
         if (fs.existsSync(dest)) return;
      
         fs.writeFileSync(dest, fs.readFileSync(src, 'utf-8'));
         execSync(commands(dest).join(' && '), { stdio: 'inherit' });
      });
   })();

   /* Rebuilds .gitignore if it's differ from production resource */
   (() => {

      const gitignore = fs.readFileSync('.gitignore', 'utf-8');
      const list = gitignore.split(EOL);
      const recreated = [ ];
      const blacklist = [
   
         'src',
         '.library',
         '.library/my'
      ];
      const dest = '.gitignore';
      
      list.forEach(toIgnore => {
            
         if (toIgnore?.trim().length === 0) return;
         if (/#/.test(toIgnore)) return;
         if (blacklist.includes(toIgnore)) return;
      
         recreated.push(toIgnore);
      });
      
      if (recreated.length === list.length) return;

      fs.writeFileSync(dest, recreated.join(EOL));
      execSync(commands(dest).join(' && '), { stdio: 'inherit' });
   })();
})();