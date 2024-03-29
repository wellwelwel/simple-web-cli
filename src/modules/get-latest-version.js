import { exec } from 'child_process';

const sh = (command) =>
   new Promise((resolve, reject) => exec(command, (error, stdout) => (!!error ? reject(error) : resolve(stdout))));
const latestVersion = async (packageName) =>
   (await sh(`npm view ${packageName?.trim()?.toLowerCase()} version`))?.trim();

export default latestVersion;
