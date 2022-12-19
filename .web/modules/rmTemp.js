import fs from 'fs';
import exec from './execShellCommand.js';

const rmTemp = async () => {
   const currentDir = fs.readdirSync('./');

   for (const dir of currentDir) {
      if (!/^temp_/.test(dir)) continue;

      await exec(`rm -rf ./${dir}`);
   }
};

export default rmTemp;