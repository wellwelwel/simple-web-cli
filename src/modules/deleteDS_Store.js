import exec from './execShellCommand.js';

export default async () => {
   if (process.platform !== 'darwin') return;

   await exec('find . -name ".DS_Store" -type f -delete');
};
