import { exec } from 'child_process';

export default (cmd) =>
  new Promise((resolve) =>
    exec(cmd, (error) => resolve(!!error ? false : true))
  );
