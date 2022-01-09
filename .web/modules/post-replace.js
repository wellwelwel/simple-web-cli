const { plugins } = require('./config');

const get_post_replace = () => {

   const post_replaces = {

      config: true,
      strings: false
   };

   if (!plugins?.stringReplace) return post_replaces;

   const set_post_replaces = plugins.stringReplace;

   if (set_post_replaces?.strings) if (Object.keys(set_post_replaces.strings).length > 0) post_replaces.strings = set_post_replaces.strings;
   if (set_post_replaces?.config) post_replaces.config = set_post_replaces?.config;

   return post_replaces;
};

module.exports = get_post_replace;