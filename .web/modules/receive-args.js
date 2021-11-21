const build = args => {

   const extend = { };

   args.forEach(cli => {

      const splitCli = cli.split('=');

      extend[splitCli[0].replace(/-/g, '')] = splitCli[1];
   });

   if (extend?.level) {

      if (!isNaN(extend.level)) {

         if (extend.level < 0) extend.level = 0;
         else if (extend.level > 9) extend.level = 9;
      }
   }

   process.env.level = parseInt(extend?.level) || 0;
   process.env.output = extend?.output || '.release';
   process.env.ftp = extend?.ftp || false;
};

module.exports = { build };