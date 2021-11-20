const { execSync } = require('child_process');
const fs = require('fs');
const { EOL } = require('os');
const commands = require('./modules/commands');
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

(() => {
   
   const dest = 'package.json';
   const git = {
   
      name: '@wellwelwel/simple-web',
      publishConfig: {
         registry:'https://npm.pkg.github.com'
      },
      repository: {
         type: 'git',
         url: 'git://github.com/wellwelwel/simple-web.git'
      }
   };
   const package = readJSON(dest);

   package.name = git.name;
   package.publishConfig = git.publishConfig;
   package.repository = git.repository;

   buildJSON();
   execSync(commands(dest, false).join(' && '), { stdio: 'inherit' });
})();