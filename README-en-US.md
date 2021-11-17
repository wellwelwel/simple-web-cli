# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="24" /> simple-web

>  A simple compiler to automate the development in the HTML, CSS/Sass, JavaScript and PHP languages using the FTP connection to deploy files processed automatically to the final server.  

### ➖ Initialization
* **`npm i`** or **`yarn --ignore-engines`** to download the dependencies
* **`npm start`** or **`yarn start`** to start the service

### ➖ Development
* **`scr`** is the directory of development
* **`.main`** is the directory with the compiled code

### ➖ Configuring the FTP
* In the file **`.webserviceconfig.json`**, just insert the acess info:
```json
   "ftp": {
      "root": "_ROOT_DIRECTORY_",
      "host": "_IP_",
      "user": "_USER_",
      "pass": "_PASSWORD_",
      "secure": true
   }
```
> ##### *- if no access is entered, it will create the project normally, just ignoring the FTP upload*  <br />  *- if the FTP lack SSL certification, use `"explict"` in `"secure"`*

* Assuming the directory **`root`** is <ins>`/var/www`</ins>, the input and output of the directories would be:

   ➖ **Development:** <ins>`src/html/index.html`</ins>  
   ➖ **Distribution:** <ins>`.main/html/index.html`</ins>  
   ➖ **FTP:** <ins>`/var/www/html/index.html`</ins>  

<br />

### ➖ Using
>   Once the process is started with `npm start` or `yarn start`, the event occurs by **saving any file** in the directory `src`.

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
> * Only uploads the original file to the output directories

<br />

<!-- Local Modules -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="24" /> `Local Modules`
>  * In **JavaScript Web**, it is possible to import local modules saved within files, for example:
> 
>     <ins>`.library/my-script/index.js`</ins>
>     
>     ```javascript
>        require('web/my-script'); /* for full import of the file */
>        const meu_script = require('web/my-script'); /* to import the module into a variable */
>     ```

<br />

<!-- Text Replacement  -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg" width="24" /> ` Text Replacement `
>  * It is possible to create a code easy to read, and by compiling, replace the specified texts. For example:
> ##### *- runs in any language that is enabled in* `.web-replace.json`
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
> ✅ **Others** *(functionality relies only on the ` Terminal`, however, other editors may not be compatible with local module suggestions)*  
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

#### __Made with *sadness* and *sorrow* in cold nights by [Weslley Araújo](https://github.com/wellwelwel) 🖤__
