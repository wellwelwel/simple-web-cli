import fs from 'fs';
import { source, plugins } from './config.js';

export default (file, local) => {
   if (!plugins) return false;

   const resources = plugins?.resourceReplace || false;

   if (!resources?.replace?.[local]) return false;

   const src = resources?.src || '.resources';
   const dest = file.replace(source, src);

   if (!fs.existsSync(dest)) return false;

   return dest;
};
