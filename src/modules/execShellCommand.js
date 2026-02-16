import { exec } from 'child_process';

export default (cmd) =>
  new Promise((resolve) =>
    exec(cmd, (error, _stdout, stderr) => {
      if (error) console.error(stderr || error.message);
      resolve(!error);
    })
  );
