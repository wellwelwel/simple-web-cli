import fs from 'fs';
import { sep } from 'path';
import { source } from './config.js';

export default async () => {
   fs.writeFileSync(`${source}${sep}exit`, '');
   if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
};
