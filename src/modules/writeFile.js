import fs from 'fs';

export default (content, to) => {
  fs.writeFileSync(to, content, (err) => {
    if (err) throw err;
  });
};
