const fse = require('fs-extra');
const fsep = require('fs-extra').promises;
const post_replace = require('../post-replace');
const empty = require('../empty');
const mime = require('mime-types');
const resourceReplace = require('../resource-replace');

const post_process = async (options = { }) => {

   const config = {

      src: options.src || false,
      to: options.to || false,
      local: options.local || 'start',
      response: options.response || false
   };
   const { src, to, local, response } = config;

   if (!response) {

      if (!src || !to) return false;
      if (!fse.existsSync(src)) return false;
   }

   const get_replaces = post_replace();
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

         return false;
      }
   };

   const sampleContent = resourceReplace(src, local) || src;
   let content = isValid ? await fsep.readFile(sampleContent, 'utf8') : await fsep.readFile(sampleContent);

   try {

      if (isValid && isReplaceable()) {

         let new_content = content;

         for (const string in get_replaces.strings) {

            if (string.split('*').length === 3 && string.substring(0, 1) === '*' && string.substring(string.length, string.length - 1) === '*') {

               const regex = RegExp(string.replace(/\*/gim, '\\\*'), 'gim');
               let stringToReplace = get_replaces?.strings[string][local];

               if (!stringToReplace || empty(stringToReplace)) {

                  if (local === 'start' && !empty(get_replaces.strings[string]['build'])) stringToReplace = get_replaces.strings[string]['build'];
                  else if (local === 'build' && !empty(get_replaces.strings[string]['start'])) stringToReplace = get_replaces.strings[string]['start'];
                  else stringToReplace = '';
               }

               if (stringToReplace || empty(stringToReplace)) new_content = new_content.replace(regex, stringToReplace);
            }
         }

         if (!!new_content) content = new_content;
      }
   }
   catch(e) { }
   finally {

      if (response === true) return content
      else await fsep.writeFile(to, content);
   }
}

module.exports = post_process;