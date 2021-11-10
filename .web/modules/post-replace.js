const fse = require('fs-extra');

const get_post_replace = async () => {

   const post_replaces = {

      config: true,
      strings: false
   };

   if (!fse.existsSync('.web-replace.json')) return post_replaces;

   const set_post_replaces = JSON.parse(fse.readFileSync('.web-replace.json', 'utf8'));

   if (set_post_replaces?.strings) if (Object.keys(set_post_replaces.strings).length > 0) post_replaces.strings = set_post_replaces.strings;
   if (set_post_replaces?.config) post_replaces.config = set_post_replaces?.config;

   return post_replaces;
};

module.exports = get_post_replace;