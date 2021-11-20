module.exports = (file, push = true) => {
      
   const commands = [

      'git config --local user.name github-actions',
      'git config --local user.email "github-actions@github.com"',
      `git add --force ${file}`,
      `git commit -am "Update ${file}"`,
   ];

   push && commands.push('git push');

   return commands;
};