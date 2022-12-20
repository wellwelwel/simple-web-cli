import fs from 'fs';
import { sep } from 'path';
import { sh, draft } from '../../modules/sh.js';
import watchClose from '../../modules/watch-close.js';
import autoDeploy from './autoDeploy.js';
import { source } from '../../modules/config.js';
import rmTemp from '../../modules/rmTemp.js';
import deleteDS_Store from '../../modules/deleteDS_Store.js';

(async () => {
   await watchClose();

   const starting = new draft(`Starting${sh.dim}${sh.yellow} ... ${sh.reset}${sh.bright}`, 'circle');

   await rmTemp();
   await deleteDS_Store();

   if (fs.existsSync('temp')) fs.rmSync('temp', { recursive: true, force: true });
   if (fs.existsSync(`${source}/exit`)) fs.unlinkSync(`${source}${sep}exit`);

   const success = await autoDeploy();

   if (!success) {
      await watchClose();

      starting.stop(0, `Falha ao iniciar processos`);
      process.exit(1);
   }

   starting.stop(
      1,
      `Watching${sh.reset} ${sh.green}${sh.bold}YOU${sh.reset}${sh.dim}${sh.green} ... ${sh.reset}${sh.bright}🧟`
   );
})();
