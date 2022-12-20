import fs from 'fs';
import { normalize } from 'path';

export default (directory) => {
   const directorys = [];
   if (typeof directory === 'string') directorys.push(directory);
   else if (typeof directory === 'object') Object.assign(directorys, directory);

   directorys.forEach((dir) => {
      dir = normalize(dir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
   });
};
