(() => {

   const { execSync } = require('child_process');
   const fs = require('fs');
   const file = '.web-config.json';
   const content = fs.readFileSync(`${__dirname}/resource.json`, 'utf-8');
   const commands = [

      'git config --local user.name github-actions;',
      'git config --local user.email "github-actions@github.com";',
      `git add --force ${file};`,
      `git commit -am "Update ${file}";`,
      'git push;'
   ]

   if (fs.existsSync(file)) return;

   fs.writeFileSync(file, content);
   execSync(commands.join(' '), { stdio: 'inherit' });
})();