# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="24" /> simple-web

>  A simple compiler able to automate the following programming languages: HTML, CSS/Sass, JavaScript and PHP. Utilizing FTP connection in order to adress the final server automatically.  

### ➖ Startup
* **`npm i`** or **`yarn --ignore-engines`** to download the dependencies
* **`npm start`** or **`yarn start`** to launch simple-service

### ➖ Devlopment
* **`scr`** devlopment directory
* **`.main`** compiled code directory

### ➖ Configuring the FTP
* In the file **`.webserviceconfig.json`**, is only needed to insert the acess info:
```json
   "ftp": {
      "root": "_ROOT_DIRECTORY_",
      "host": "_IP_",
      "user": "_USER_",
      "pass": "_PASSWORD_",
      "secure": true
   }
```
> ##### *- in case that the acess isn't inputed, the project will still be created, only ignoring the FTP connection*  <br />  *- if the FTP haven't a SSL certificate, use `"explict"` on `"secure"`*

* Supposing that the directory **`root`** is <ins>`/var/www`</ins>, the input and output would be:

   ➖ **Devlopment:** <ins>`src/html/index.html`</ins>  
   ➖ **Distribution:** <ins>`.main/html/index.html`</ins>  
   ➖ **FTP:** <ins>`/var/www/html/index.html`</ins>  

<br />

### ➖ Utilizing
>   Once you start the process with `npm start` or `yarn start`, the event occurs when **saving any file** in the directory `src`.

<br />

<!-- HTML -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="24" /> `HTML`
>`INPUT`
>```html
>   <div>
>      <h1>Title</h1>
>      <p>Paragraph</p>
>   </div>
>```
>`OUTPUT`
>```html
>   <div><h1>Title</h1><p>Paragraph</p></div>
>```

<br />

<!-- CSS -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24" /> `CSS` <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" width="24" /> `Sass`
>`INPUT` 
>```css
>   div {
>      display: flex;
>   }
>```
>`OUTPUT`
>```css
>   div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}
>```

<br />

<!-- JS -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" /> `JavaScript`
>`INPUT`
>```javascript
>   (() => {
>      require('web/selector');
>
>      const element = s('body');
>      const inElement = sEl(element, 'div');
>      const elements = sAll('.class');
>      const elementsInElement = sElAll(element, '.class');
>   })();
>```
>`OUTPUT`
>```javascript
>   "use strict";!function(){var e,c,l,r,t=(e="body",document.querySelector(e));c="div",t.querySelector(c),l=".class",document.querySelectorAll(l),r=".class",t.querySelectorAll(r)}();
>```

<br />

<!-- PHP -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg" width="36" /> `PHP` | `PHTML`
>`INPUT`
>```php
><?
>   $var = 'text'
>?>
>
><div>
>   <?=$var?>
></div>
>```
>`OUTPUT`
>```php
>  <?php $var='text'?><div><?=$var?></div>
>```

<br />

<!-- .htaccess -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" width="42" /> `Apache (.htaccess, php.ini)`
>`INPUT`
>```apache
># comment
><Directory /var/www/>
>   # another comment
>   Options Indexes FollowSymLinks MultiViews
></Directory>
>```
>`OUTPUT`
>```apache
><Directory /var/www/>
>Options Indexes FollowSymLinks MultiViews
></Directory>
>```

<br />

<!-- others -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" width="24" /> ` General Files `
> * The original file is only sent to the output directories

<br />

<!-- Local Modules -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="24" /> `Local Modules`
>  * In **JavaScript Web**, is possible to adress local modules saved in files beforehand, as following:
> 
>     <ins>`.library/my-script/index.js`</ins>
>     
>     ```javascript
>        require('web/my-script'); /* importing a full file */
>        const meu_script = require('web/my-script'); /* importing the module from a variable */
>     ```

<br />

<!-- Text Replacing  -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg" width="24" /> ` Text Replacing `
>  * In **PHP** and **Apache** is possible to create an easy-to-read code that, when compiled, replaces the especified *strings*. See example:
> ##### *- works in every language that `.web-replace.json` is enabled*
> 
>     <ins>`.webservicereplace.json`</ins>
>     
>     ```json
>     {
>        "strings": {
>           "*token*": {
>              "dev": "0cfcda42c340dad5616e0b7449a5634b",
>              "build": "0cfcda42c340dad5616e0b7449a5634b"
>           },
>           "*site-name*": {
>              "dev": "dev.weslley.io",
>              "build": "weslley.io"
>           }
>        }
>     }
>     ```
>
>`INPUT`
>```php
><?
>   $_POST['*token*'];
>   $site = '*site-name*';
>```
>
>`OUTPUT DEV (npm start | yarn start)`
>```php
><?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='dev.weslley.io';
>```
>
>`OUTPUT BUILD (npm run build | yarn build)`
>```php
><?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='weslley.io';
>```

<br />

<!-- Compatibility -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/putty/putty-plain.svg" width="24" /> `Compatibility`

>
>`Operational Systems`  
>
> ✅ **macOS**  
> ✅ **Linux**  
> ✅ **Windows**  
>

>
>`Code Editors`  
>
> ✅ [**Visual Studio Code**](https://code.visualstudio.com/Download)  
> ✅ **Others** *(the main functions will rely on the `Integrated Terminal`, therefore, some editors may be incompatible with local suggestion modules)*  
>

>
>`Recomended Extensions (VSCode)` <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" width="12" />
>
>- [x] [**ESLint** - *Dirk Baeumer*](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
>- [x] [**npm Intellisense** - *Christian Kohler*](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
>- [x] [**Path Intellisense** - *Christian Kohler*](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
>- [x] [**Visual Studio IntelliCode** - *Microsoft*](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
>

<br />

#### __Made under cold nights of *pain* and *suffering* by [Weslley Araújo](https://github.com/wellwelwel) 🖤__
