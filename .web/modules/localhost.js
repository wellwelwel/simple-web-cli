const fs = require('fs');
const express = require('express');
const { port, to } = require('./config');
const { sh } = require('./sh');

const dir = to;
const reload = { status: false };

const appendHTML = (req, res) => {

   const file = req.url === '/' ? `${dir}/index.html` : `${dir}/${req.url}`;

   if (!fs.existsSync(file)) {

      res.status(404);
      res.send('<span>Page not found</span>');
      return;
   }

   const browserReload = `
/* Simple Web Cli: Live Reloader */
/* Only in Localhost 🏠 */
"use strict";function asyncGeneratorStep(e,n,r,t,o,a,i){try{var c=e[a](i),l=c.value}catch(e){return void r(e)}c.done?n(l):Promise.resolve(l).then(t,o)}function _asyncToGenerator(c){return function(){var e=this,i=arguments;return new Promise(function(n,r){var t=c.apply(e,i);function o(e){asyncGeneratorStep(t,n,r,o,a,"next",e)}function a(e){asyncGeneratorStep(t,n,r,o,a,"throw",e)}o(void 0)})}}!function(){var r=setInterval(_asyncToGenerator(function*(){try{var e,n;!0===(yield null===(e=yield fetch("/sw-auto-reload"))||void 0===e||null===(n=e.clone())||void 0===n?void 0:n.json())&&history.go(0)}catch(e){clearInterval(r),console.warn("Simple Web Cli: Live Reloader - Off")}}),1e3)}();
   `.trim();

   res.send(`${fs.readFileSync(file)}<script>${browserReload}</script>`);
};

const createServer = () => {

   if (!port) return false;

   const app = express();

   app.get('*.html', appendHTML);

   app.get('/', appendHTML);

   app.get('/sw-auto-reload', (req, res) => {

      res.send(reload.status);

      reload.status = false;
   });

   app.use(express.static(dir));

   app.listen(port);

   return true;
};

module.exports = { createServer, reload };