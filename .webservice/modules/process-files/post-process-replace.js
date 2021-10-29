const fse = require('fs-extra');
const fsep = require('fs-extra').promises;
const post_replace = require('../post-replace');
const mime = require('mime-types');

const post_process = async (options = { }) => {

   const config = {
      
      src: options.src || false,
      to: options.to || false,
      local: options.local || 'dev',
      response: options.response || false
   };
   const { src, to, local, response } = config;

   if (!response) {

      if (!src || !to) return false;
      if (!fse.existsSync(src)) return false;  
   }
   
   const get_replaces = await post_replace();
   const mimetype = `${mime.lookup(src)}`;
   const isValid = /plain|text|application|false/.test(mimetype) ? true : false;
   const fileType = src.split('.').pop().toLowerCase();
   const isReplaceable = () => {

      try {

         if (get_replaces.config === true) return true;
         if (get_replaces.config[fileType] === true) return true;
         if (get_replaces.config.others === true) return true;
         return false;
      }
      catch(e) {

         console.log(e);
         return false;
      }
   };

   let content = isValid ? await fsep.readFile(src, 'utf8') : await fsep.readFile(src);

   try {

      if (isValid && isReplaceable()) {

         let new_content = content;
   
         for (const string in get_replaces.strings) {
      
            if (
               string.split('*').length !== 3 ||
               string.substring(0, 1) !== '*' ||
               string.substring(string.length, string.length - 1) !== '*'
            ) {

               console.log(`String inválida: ${string}\nInicie e termine a string a ser substituída com *\nExemplo: *domain-name*`);
            }
            else {

               const regex = RegExp(string.replace(/\*/gim, '\\\*'), 'gim');
               if (get_replaces.strings[string][local]) new_content = new_content.replace(regex, get_replaces.strings[string][local]);
            }
         }
   
         if (!!new_content) content = new_content;
      }
   }
   catch(e) {
      
      console.log(e);
   }
   finally {
      
      if (response === true) return content
      else await fsep.writeFile(to, content);
   }
}

module.exports = post_process;