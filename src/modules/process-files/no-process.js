import { process_files } from '../config.js';
import vReg from '../vReg.js';

function no_process(file) {
  const exclude_files = process_files?.exclude || false;
  let result = false;

  if (exclude_files) {
    for (const exclude of exclude_files) {
      if (vReg(exclude).test(file)) {
        result = true;
        break;
      }
    }
  }

  return result;
}

export default no_process;
