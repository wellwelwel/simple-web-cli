const fs = require('fs');
const express = require('express');
const { port, to } = require('./config');

const dir = to;
const reload = { status: false };

const appendLiveRealoader = (req, res, next) => {

   try {

      const file = /\/$/.test(req.originalUrl) ? `${dir}${req.originalUrl}index.html` : `${dir}${req.originalUrl}`;

      if (!/\.html$|\/$/.test(req.originalUrl)) {

         if (fs.existsSync(`${dir}${req.originalUrl}`)) {

            next();

            return;
         }
      }

      let liveReloader = '';

      liveReloader += '<script>\n';
      liveReloader += '/* Simple Web Cli: Live Reloader */\n';
      liveReloader += '/* Only in Localhost 🏠 */\n';
      liveReloader += '"use strict";function asyncGeneratorStep(e,n,o,r,t,a,i){try{var c=e[a](i),l=c.value}catch(e){return void o(e)}c.done?n(l):Promise.resolve(l).then(r,t)}function _asyncToGenerator(c){return function(){var e=this,i=arguments;return new Promise(function(n,o){var r=c.apply(e,i);function t(e){asyncGeneratorStep(r,n,o,t,a,"next",e)}function a(e){asyncGeneratorStep(r,n,o,t,a,"throw",e)}t(void 0)})}}!function(){console.info("Simple Web Cli: Live Reloader - On");var o=setInterval(_asyncToGenerator(function*(){try{var e,n;!0===(yield null===(e=yield fetch("/sw-auto-reload"))||void 0===e||null===(n=e.clone())||void 0===n?void 0:n.json())&&history.go(0)}catch(e){clearInterval(o),console.warn("Simple Web Cli: Live Reloader - Off")}}),1e3)}();';
      liveReloader += '\n</script>';

      const homepage = (message = 'Create your webpage inside "src".', status = false) => {

         const welcome = !status ? '<h1>Welcome to</h1>' : '';
         const css = '*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}body,main,h1,h2{margin:0}a{text-decoration:none}body{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-family:"Comfortaa",cursive;background-color:#020518;min-height:100vh;color:#7d91ee}body main{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1}body main svg{-webkit-filter:drop-shadow(5px 5px 7.5px #000);filter:drop-shadow(5px 5px 7.5px #000);width:250px;margin-bottom:25px}body main svg path{-webkit-transition:fill .25s;-o-transition:fill .25s;-moz-transition:fill .25s;transition:fill .25s;cursor:pointer}body main svg path#brain-1{fill:#5973e7}body main svg path#brain-1:hover{fill:#738bf7}body main svg path.st1:hover{fill:#0059ff}body main svg path.st2:hover{fill:#ff008b}body main svg path.st3:hover{fill:#5973e7}body main svg path.st4:hover{fill:#e3e6f5}body main h1{font-size:18px;margin-bottom:20px;color:#364485}body main h2 span{color:#e2eaf1;font-size:36px;font-weight:bold;-webkit-transition:color .25s;-o-transition:color .25s;-moz-transition:color .25s;transition:color .25s}body main h2 span.space{margin:0 5px}body main h2 span:hover{color:#0087ff}body main h2 span.cli{color:#0087ff}body main h2 span.cli:hover{color:#bac4f0}body main section{margin-top:25px;padding:15px 25px;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;background-color:#7d91ee;color:#020518;-webkit-transition:background-color .25s;-o-transition:background-color .25s;-moz-transition:background-color .25s;transition:background-color .25s}body main section:hover{background-color:#95a6f3}body footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;padding:25px}body footer a{position:relative;display:block;color:#b4bef2;text-shadow:2px 2px 2px #02051875;cursor:pointer}body footer a+a{margin-left:25px}body footer a::after{content:"";position:absolute;bottom:-8px;display:block;width:100%;height:3px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-transition:background-color .25s;-o-transition:background-color .25s;-moz-transition:background-color .25s;transition:background-color .25s}body footer a:hover::after{background-color:#f94bcc}</style></head><body><main><svg viewBox="0 0 328.4 328.4"><style>.st1{fill:#0087ff}.st2{fill:#F94BCC}.st3{fill:#7D92EF}.st4{fill:#B3BDF2}';
         const css404 = '*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}body,main,h1,h2{margin:0}a{text-decoration:none}body{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-family:"Comfortaa",cursive;background-color:#020518;min-height:100vh;color:#7d91ee}body main{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1}body main svg{-webkit-filter:drop-shadow(5px 5px 7.5px #000);filter:drop-shadow(5px 5px 7.5px #000);width:100px;margin-bottom:25px}body main svg path{-webkit-transition:fill .25s;-o-transition:fill .25s;-moz-transition:fill .25s;transition:fill .25s;cursor:pointer}body main svg path#brain-1{fill:#5973e7}body main svg path#brain-1:hover{fill:#738bf7}body main svg path.st1:hover{fill:#0059ff}body main svg path.st2:hover{fill:#ff008b}body main svg path.st3:hover{fill:#5973e7}body main svg path.st4:hover{fill:#e3e6f5}body main h1{font-size:18px;margin-bottom:20px;color:#364485}body main h2 span{color:#e2eaf1;font-size:36px;font-weight:bold;-webkit-transition:color .25s;-o-transition:color .25s;-moz-transition:color .25s;transition:color .25s}body main h2 span.space{margin:0 5px}body main h2 span:hover{color:#0087ff}body main h2 span.cli{color:#0087ff}body main h2 span.cli:hover{color:#bac4f0}body main section{margin-top:25px;padding:15px 25px;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;background-color: #f94b6b;color: #ffffff;-webkit-transition:background-color .25s;-o-transition:background-color .25s;-moz-transition:background-color .25s;transition:background-color .25s}body main section:hover{background-color:#cf2141}body footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;padding:25px}body footer a{position:relative;display:block;color:#b4bef2;text-shadow:2px 2px 2px #02051875;cursor:pointer}body footer a+a{margin-left:25px}body footer a::after{content:"";position:absolute;bottom:-8px;display:block;width:100%;height:3px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-transition:background-color .25s;-o-transition:background-color .25s;-moz-transition:background-color .25s;transition:background-color .25s}body footer a:hover::after{background-color:#f94bcc}</style></head><body><main><svg viewBox="0 0 328.4 328.4"><style>.st1{fill:#0087ff}.st2{fill:#F94BCC}.st3{fill:#7D92EF}.st4{fill:#B3BDF2}';
         const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${!status ? '' : status}Simple Web Cli</title><link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap" rel="stylesheet"><style>${!status ? css : css404}</style><path id="circle-bottom" class="st1" d="M207.7,248.1c10.3,0,18.6,8.3,18.6,18.6c0,10.3-8.3,18.6-18.6,18.6 c-10.3,0-18.6-8.3-18.6-18.6C189.1,256.4,197.4,248.1,207.7,248.1z"/><path id="circle-right" class="st2" d="M309.8,146c10.3,0,18.6,8.3,18.6,18.6c0,10.3-8.3,18.6-18.6,18.6c-10.3,0-18.6-8.3-18.6-18.6 C291.2,154.3,299.5,146,309.8,146z"/><path id="brain-4" class="st3" d="M200.6,215.5c-29.1-1.2-27.9-20.1-47.9-22.5c-1.4-0.2-2.6-0.2-3.8-0.2c-7.8,0-14.9,2.9-20.2,7.6 c-5.3,4.7-8.9,11.2-9.7,18.6c-0.1,1.2-0.2,2.4-0.2,3.5c0,0.8,0,1.6,0.1,2.6c0.6,7.9,4.1,14.8,9.4,19.7c5.4,4.9,12.7,7.9,20.9,7.9 c0.8,0,1.7,0,2.7-0.1c9.3-0.7,13.6-4.8,18.1-9.1c6.2-5.9,12.9-12.3,30.2-13.5h0.1c29.9-1,35.2,4.4,41.7,10.9 c1.8,1.8,3.8,3.8,6.6,5.7c1.5,1,2.9,1.8,4.4,2.5c7.2,3.5,14.7,4.3,21.5,2.6c6.8-1.7,12.9-5.9,17.2-12.4c0.8-1.2,1.6-2.6,2.3-4 c0.8-1.6,1.4-3.4,1.9-5.3c0.5-1.9,0.8-3.9,0.8-5.9c0.5-12-4.6-17.5-9.8-23.2c-4.2-4.6-8.6-9.3-11-17c-1.4-4.5-1.9-9.7-2.1-15 c-0.2-5.2,0.1-10.3,0.3-14.9l0-0.2c1.9-16.2,7.8-22.2,13.3-27.9c4.2-4.3,8.2-8.4,9.1-18.1c0.1-0.8,0.1-1.7,0.2-2.5 c0.2-8.1-2.7-15.4-7.6-20.8c-4.9-5.4-11.7-9-19.3-9.7c-0.8-0.1-1.6-0.1-2.3-0.1c-9.1-0.2-16.7,3.1-21.9,8.4 c-2.6,2.6-4.7,5.7-6.1,9.1c-1.4,3.4-2.2,7.1-2.3,10.9c-0.4,19.9,17,24.8,21.5,47.5c2.1,10.5,1.8,21.9-0.2,30.6 c-1,4.5-2.8,8.5-4.9,11.8C240.5,213.1,223.3,216.3,200.6,215.5L200.6,215.5z"/><path id="brain-3" class="st4" d="M75.4,252.9c-0.8,1.2-2.1,2.5-3.6,4.1c-6.1,6.4-17.4,18.3-10.2,35.9c0.8,2,2,4.2,3.4,6.3 c1.3,2,2.8,3.8,4.3,5.2c3.6,3.3,8.5,5.6,13.8,6.7c5.3,1,10.9,0.8,15.7-0.9l0.1,0c8.4-3,14.4-8.7,17.6-15.7c3.2-7,3.6-15.3,0.6-23.6 l-0.1-0.2c-1.4-3.8-4-6.6-6.9-9.6c-7.8-8.3-17.1-18-13.4-50.4c1.6-13.9,6.3-18.6,11.4-23.6c2.8-2.8,5.7-5.6,8.1-10.6 c3.3-6.8,3.6-14,1.7-20.4c-1.6-5.5-4.7-10.4-8.9-14.3c-4.1-3.9-9.3-6.6-14.8-7.7c-6.3-1.2-13.3-0.2-20.2,3.9c-5,2.9-9.9,8-12.7,14.6 c-2.2,5.3-3,11.6-1.2,18.6c1.9,7.4,5.5,11.1,9.1,14.8c7.3,7.4,14.6,14.9,12.7,44.4c-0.7,11-2.1,13.7-6,21.1 C76,251.8,75.7,252.5,75.4,252.9L75.4,252.9z"/><path id="brain-2" class="st4" d="M119.2,31.8c-2.9-1.9-5.2-4.2-7.6-6.4c-4.4-4.2-8.9-8.5-17.5-9.8c-5.5-0.8-10.7-0.1-15.4,1.7 c-5.1,1.9-9.5,5.2-12.8,9.3c-3.3,4.1-5.6,9-6.3,14.4c-0.7,4.7-0.2,9.8,1.8,14.9c0.6,1.7,1.6,3.6,2.8,5.4c1,1.7,2.2,3.2,3.3,4.3 l1.7,1.6c5.6,5.4,13,8.2,20.7,8c7.3-0.3,14.8-3.3,21.1-9.6c3.8-3.8,8-7,13.3-9.3c5.3-2.3,11.5-3.7,19.5-3.9 c7.4-0.2,13.9-0.2,19.9,0.9c6.3,1.1,12,3.4,17.3,7.7c3.2,2.6,7.2,6.2,10.7,10.8c3.6,4.7,6.7,10.4,7.9,17.1c1.1,6.1,1.5,14.5,1,22.4 c-0.5,6.8-1.7,13.4-4,18.1c-2.5,5.1-5.6,8.4-8.7,11.6c-3.4,3.6-6.9,7.2-8.9,13.5c-1.6,5.2-1.8,10.4-0.7,15.2 c1.1,5.2,3.6,10,7.2,13.9c3.5,3.9,8,6.9,13.2,8.6c4.8,1.5,10.1,1.9,15.7,0.6c5.6-1.2,10.2-3.8,13.8-7.3c3.9-3.8,6.7-8.5,8.2-13.6 c1.5-5.1,1.7-10.5,0.6-15.5c-1-4.4-3-8.5-6.1-11.8l-2.1-2.1c-7.1-7.2-12.9-13.1-13.8-29.4c-0.6-6.7-0.7-14.5,0.4-21.9 c3.6-22.1,14.9-20.4,20.4-35.2c2.2-5.9,2.3-12.1,0.8-17.8c-1.5-5.8-4.7-11.1-8.9-15.2c-2.9-2.8-6.3-5-10.1-6.4 c-2.3-0.9-4.7-1.4-7.2-1.6c-2.4-0.2-4.9-0.1-7.5,0.4c-2.2,0.4-4,1-5.5,1.6c-1.5,0.7-2.8,1.4-4,2.2c-2.3,1.4-4.3,3.1-6.5,5 c-1.8,1.5-3.8,3.2-6.5,5.2c-7.1,5.4-18.7,8.4-30.2,8.8C138.4,38.7,126.6,36.6,119.2,31.8L119.2,31.8L119.2,31.8z"/><path id="brain-1" class="st3" d="M128.1,126.4c4.7,4.2,11.7,8.6,22.3,7.8c2.3-0.2,4.5-0.6,6.6-1.2c6.4-1.9,12-5.8,15.9-11.1 c3.9-5.2,6-11.8,5.5-19c-0.2-2.3-0.6-4.6-1.3-7c-0.6-1.9-1.3-3.8-2.3-5.6c-3.1-5.6-8.1-10.4-14.1-13.3c-6-2.8-13-3.7-20.2-1.6 c-2.1,0.6-4.3,1.5-6.4,2.7c-3.3,1.8-5.5,4-7.7,6.3c-3.5,3.5-7,7-14.1,9.8c-5.2,2.1-11.9,2.9-18.6,3.1c-6.6,0.2-13.2-0.2-18.7-0.8 l-0.4-0.1C62,93.7,57.7,89.3,53.3,84.8c-2.6-2.6-5.2-5.3-10.1-7.6C34.4,73,25.4,73.6,18,77.2c-3.2,1.5-6.2,3.6-8.7,6.2 c-2.5,2.5-4.6,5.5-6.2,8.7c-3.5,7.4-4.1,16.4,0.1,25.1c2.6,5.4,6,10,9.3,14.6c10,13.7,19.2,26.2,7.6,54.7 c-2.7,6.7-6.2,10.2-9.6,13.8c-2.7,2.8-5.4,5.5-7.5,10c-2.3,4.9-3,9.8-2.6,14.6c0.5,5.3,2.3,10.3,5.2,14.7 c5.7,8.8,14.7,12.7,23.8,12.7c4.9,0,9.8-1.1,14.3-3.2c4.4-2.1,8.3-5.1,11.3-8.9c5.2-6.7,7.4-16.1,3.7-27.2 c-1.9-5.8-5.3-9.2-8.6-12.5c-5.8-5.9-11.6-11.8-12.6-28.2c-0.6-10.5-0.7-19.6,1.8-28.1c4.4-15,19.8-29.6,35.5-31.9 C98,108.7,111,111.2,128.1,126.4L128.1,126.4z"/></svg>${welcome}<h2><span>S</span><span>i</span><span>m</span><span>p</span><span>l</span><span>e</span><span class="space"></span><span>W</span><span>e</span><span>b</span><span class="space"></span><span class="cli">C</span><span class="cli">l</span><span class="cli">i</span></h2><section>${message}</section></main><footer><a href="https://github.com/wellwelwel/simple-web-cli" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.npmjs.com/package/simple-web-cli" target="_blank" rel="noopener noreferrer">npmjs</a></footer></body></html>`;

         return html;
      };

      const browserReload = liveReloader.trim();

      if (!fs.existsSync(file)) {

         if (req.originalUrl === '/') {

            res.send(`${browserReload}${homepage()}`);

            return;
         }

         res.status(404);
         res.send(`${browserReload}${homepage(`<strong>404:</strong> ${file}`, '(404) ')}`);
         return;
      }

      res.send(`${browserReload}${fs.readFileSync(file)}`);
   } catch (error) {

      next();
   }
};

const createServer = () => {

   if (!port) return false;

   const app = express();

   /* Live Reloader */
   app.get('/sw-auto-reload', (req, res) => {

      res.send(reload.status);

      reload.status = false;
   });

   app.get('*', appendLiveRealoader);

   app.use(express.static(dir));

   app.listen(port);

   return true;
};

module.exports = { createServer, reload };