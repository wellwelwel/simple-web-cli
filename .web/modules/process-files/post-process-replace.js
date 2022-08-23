const fse = require('fs-extra');
const fsep = require('fs-extra').promises;
const { extname, dirname } = require('path');
const post_replace = require('../post-replace');
const empty = require('../empty');
const resourceReplace = require('../resource-replace');
const exec = require('../execShellCommand');

const post_process = async (options = { }) => {

   const rejectTypes = [

      // Images
      /\.tiff$/i,
      /\.tif$/i,
      /\.bmp$/i,
      /\.jpg$/i,
      /\.jpeg$/i,
      /\.jpe$/i,
      /\.jfif$/i,
      /\.png$/i,
      /\.gif$/i,
      /\.webp$/i,
      /\.avif$/i,
      /\.psd$/i,
      /\.psb$/i,
      /\.exif$/i,
      /\.raw$/i,
      /\.ai$/i,
      /\.crd$/i,
      /\.eps$/i,

      // Videos
      /\.avi$/i,
      /\.wmv$/i,
      /\.mov$/i,
      /\.flv$/i,
      /\.rm$/i,
      /\.mp4$/i,
      /\.mkv$/i,
      /\.mks$/i,

      // Audio
      /\.3gpp$/i,
      /\.aac$/i,
      /\.ac3$/i,
      /\.ac4$/i,
      /\.mp3$/i,
      /\.m4a$/i,
      /\.aiff$/i,
      /\.wav$/i,
      /\.ogg$/i,
      /\.alac$/i,
      /\.flac$/i,
      /\.pcm$/i,

      // Documents
      /\.pdf$/i,
      /\.xlsx$/i,
      /\.xltx$/i,
      /\.xlsm$/i,
      /\.xltm$/i,
      /\.xlsb$/i,
      /\.xls$/i,
      /\.xlt$/i,
      /\.xlam$/i,
      /\.xla$/i,
      /\.xlw$/i,
      /\.xla$/i,
      /\.xlr$/i,
      /\.ods$/i,
      /\.doc$/i,
      /\.docx$/i,
      /\.odt$/i,
      /\.dot$/i,
      /\.dotm$/i,
      /\.xps$/i,
      /\.wps$/i,
      /\.pptx$/i,
      /\.pptm$/i,
      /\.ppt$/i,
      /\.potx$/i,
      /\.potm$/i,
      /\.pot$/i,
      /\.ppsx$/i,
      /\.ppsm$/i,
      /\.pps$/i,
      /\.ppam$/i,
      /\.ppa$/i,
      /\.wmf$/i,
      /\.emf$/i,
      /\.rtf$/i,
      /\.odp$/i,

      // Compressed Files
      /\.zip(\.[0-9]{1,})?$/i,
      /\.rar(\.[0-9]{1,})?$/i,
      /\.7z$/i,
      /\.z[0-9]{1,}?$/i,
      /\.gz$/i,
      /\.z$/i,
      /\.tar$/i,
      /\.tgz$/i,
      /\.bz2$/i,
      /\.(z|gz|tar|tgz|bz2)\.part/i,
   ];

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
   const isValid = !rejectTypes.some(regex => regex.test(extname(src)));
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

   if (!isValid) {

      await exec(`mkdir -p ${dirname(to)} && cp ${sampleContent} ${to}`);

      return 'skip-this-file';
   }

   let content = await fsep.readFile(sampleContent, 'utf8');

   try {

      if (isReplaceable()) {

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