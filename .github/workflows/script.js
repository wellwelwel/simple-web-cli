(() => {

   const { execSync } = require('child_process');
   const fs = require('fs');
   const files = [

      { dest: '.web-config.json', src: `${__dirname}/resource.json` },
      { dest: '.gitignore', src: `${__dirname}/_gitignore` }
   ];
   const commands = file => {
      
      return [

         'git config --local user.name github-actions',
         'git config --local user.email "github-actions@github.com"',
         `git add --force ${file}`,
         `git commit -am "Update ${file}"`,
         'git push'
      ];
   };
   
   /* On missing, recreats the default resources */
   files.forEach(file => {

      const { src, dest } = file;

      if (fs.existsSync(dest)) return;
   
      fs.writeFileSync(dest, fs.readFileSync(src, 'utf-8'));
      execSync(commands().join(' && '), { stdio: 'inherit' });
   });
})();