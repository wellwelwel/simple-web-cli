const { execSync } = require('child_process');

(async () => {

   execSync(`npm run stop --silent && npm run reset --silent && npm run start --silent`, { stdio: 'inherit' });
})();