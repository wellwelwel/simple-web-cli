module.exports = file => {
      
   return [

      'git config --local user.name github-actions',
      'git config --local user.email "github-actions@github.com"',
      `git add --force ${file}`,
      `git commit -am "Update ${file}"`,
      'git push'
   ];
};