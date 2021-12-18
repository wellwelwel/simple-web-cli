const fs = require('fs').promises;
const sep = require('path').sep;

class ListFiles {

   constructor() {

      this.files = [];
      this.excludeDir = [];

      this.isTypeExpected = (file, expected) => {

         if (expected === false) return true;

         let isValid = false;

         const types = [];
         const currentFileType = file.split('.').pop();

         if (typeof expected === 'string') types.push(expected);
         else if (typeof expected === 'object') Object.assign(types, expected);

         for (const type in types) {

            if (currentFileType.includes(types[type])) {

               isValid = true;
               break;
            }
         }

         return isValid;
      }

      this.getFiles = async (directory, type, excludeDir = false, excludeType = false) => {

         if (excludeDir) this.excludeDir.push(excludeDir.replace('./', ''));

         const filesList = await fs.readdir(directory);

         for (const file in filesList) {

            const stat = await fs.stat(`${directory}${sep}${filesList[file]}`);
            if (this.excludeDir.includes(directory)) return false;
            else if (stat.isDirectory()) await this.getFiles(`${directory}${sep}${filesList[file]}`, type);
            else if (this.isTypeExpected(filesList[file], type)) this.files.push(`${directory}${sep}${filesList[file]}`);
         }

         return this.files;
      }
   }
}

const listFiles = async (directory, type = false, excludeDir = false, excludeType = false) => {

   const files = new ListFiles;
   const list = await files.getFiles(directory, type, excludeDir);

   this.files = [];

   return list;
};

module.exports = listFiles;