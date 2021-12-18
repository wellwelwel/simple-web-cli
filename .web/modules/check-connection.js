const http2 = require('http2');

module.exports = async (url = 'https://www.google.com/') => {

   function isConnected() {

      try {

         return new Promise((resolve) => {

           const client = http2.connect(url);

           client.on('connect', () => {

             resolve(true);
             client.destroy();
           });

           client.on('error', () => {

             resolve(false);
             client.destroy();
            });
         });
      }
      catch {

      }
   };

   return await isConnected();
};