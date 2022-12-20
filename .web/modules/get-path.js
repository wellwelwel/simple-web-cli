import { sep } from 'path';

function path(file) {
   const path = file.split(sep);
   path.pop();

   return path.join(sep);
}

export default path;
