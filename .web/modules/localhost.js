const fs = require('fs');
const express = require('express');
const { port, to } = require('./config');
const { normalize } = require('path');

const dir = to;
const reload = { status: false };

const appendLiveRealoader = (req, res) => {

   const file = req.url === '/' ? `${dir}/index.html` : `${dir}/${req.url}`;
   const browserReload = `
/* Simple Web Cli: Live Reloader */
/* Only in Localhost 🏠 */
"use strict";function asyncGeneratorStep(e,n,o,r,t,a,i){try{var c=e[a](i),l=c.value}catch(e){return void o(e)}c.done?n(l):Promise.resolve(l).then(r,t)}function _asyncToGenerator(c){return function(){var e=this,i=arguments;return new Promise(function(n,o){var r=c.apply(e,i);function t(e){asyncGeneratorStep(r,n,o,t,a,"next",e)}function a(e){asyncGeneratorStep(r,n,o,t,a,"throw",e)}t(void 0)})}}!function(){console.info("Simple Web Cli: Live Reloader - On");var o=setInterval(_asyncToGenerator(function*(){try{var e,n;!0===(yield null===(e=yield fetch("/sw-auto-reload"))||void 0===e||null===(n=e.clone())||void 0===n?void 0:n.json())&&history.go(0)}catch(e){clearInterval(o),console.warn("Simple Web Cli: Live Reloader - Off")}}),1e3)}();
   `.trim();

   if (!fs.existsSync(file)) {

      if (req.url === '/') {

         const homepage = fs.readFileSync(normalize(`${__dirname}/../../.github/workflows/resources/homepage/index.html`));
         res.send(`${homepage}<script>${browserReload}</script>`);

         return;
      }

      res.status(404);
      res.send(`<span>Page not found</span><script>${browserReload}</script>`);
      return;
   }

   res.send(`${fs.readFileSync(file)}<script>${browserReload}</script>`);
};

const createServer = () => {

   if (!port) return false;

   const app = express();

   app.get('*.html', appendLiveRealoader);

   app.get('/', appendLiveRealoader);

   app.get('/sw-auto-reload', (req, res) => {

      res.send(reload.status);

      reload.status = false;
   });

   app.use(express.static(dir));

   app.listen(port);

   return true;
};

module.exports = { createServer, reload };