<p align="center">
 <img width="100px" src="https://weslley.io/media/simple-web-11.svg" align="center" alt="simple-web" />
 <h1 align="center">Simple Web CLI</h1>
 <p align="center">A simple compiler to automate the development in the HTML, CSS/Sass, JavaScript and PHP languages using Localhost Live Reloader or FTP connection to deploy files processed automatically to the final server.</p>
</p>

<p align="center">
   <a href="/README.md">English</a>
   ·
   <a href="/README_pt-BR.md">Português</a>
</p>

## Install

```shell
   npm i simple-web-cli -D  # to download the dependencies
```
```shell
   npx sw  # to start the service
```
<hr />

### Development
* **`scr`** is the directory of development
* **`dist`** is the directory with the compiled code
<hr />

### Commands
   * `npx sw` or `npx sw start`: prepares the environment and starts the service
   * `npx sw init`: prepares the environment without starting the service
   * `npx sw build`: compiles the contents from `src` and zips it to `release.zip`
<hr />

### Using
   * Once the process is started, the event occurs by **saving any file** into `src`.
<hr />

### <img src="https://weslley.io/media/simple-web-11.svg" width="20" /> Features

   #### HTML Import
   * You can import `.html` files recursively, based on the `scss` import, for example:
      
      ```html
         <html>
            <body>
               <!-- import('./views/_header.html') -->
               <section>
                  <!-- import('./views/_main.html') -->
               </section>
               <!-- import('../_footer.html') -->
            </body>
         </html>
      ```
   <hr />

   #### Local Modules - Browser
   * In **JavaScript** (web), it's possible to import local modules saved into `.library`, for example:
   
      <ins>`.library/my-script/index.js`</ins>
      
      ```javascript
         /* for entire file import */
         require('web/my-script');

         /* to import the default module into a variable */
         const my_script = require('web/my-script');

         /* to import the modules by destronstuct variables */
         const { my_script1, my_script2 }  = require('web/my-script');

         /* to import the module into a variable with a custom name */
         const my_name_var = require('web/my-script').my_script1;
      ```
   <hr />

   #### Enable the FTP
   * In the file **`.swrc.js`**, just insert the acess infos:
      ```javascript
      {
         ftp: {
            root: '_ROOT_DIRECTORY_',
            host: '_IP_',
            user: '_USER_',
            pass: '_PASSWORD_',
            secure: true || 'explict'
         }
      }
      ```

   * Assuming the **`root`** directory is <ins>`/var/www`</ins>, the input and output of the directories would be:

      - **Development:** <ins>`src/html/index.html`</ins>  
      - **Distribution:** <ins>`dist/html/index.html`</ins>  
      - **FTP:** <ins>`/var/www/html/index.html`</ins>  
   <hr />


### <img src="https://weslley.io/media/simple-web-11.svg" width="20" /> Some Examples
<details>
<summary>View examples</summary>

#### HTML
`INPUT`
```html
   <div>
      <h1>Title</h1>
      <p>Paragraph</p>
   </div>
```
`OUTPUT`
```html
   <div><h1>Title</h1><p>Paragraph</p></div>
```
<hr />

#### CSS | Sass
`INPUT` 
```css
   div {
      display: flex;
   }
```
`OUTPUT`
```css
   div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}
```
<hr />

#### JavaScript
`INPUT`
```javascript
   (() => {
      require('web/selector');

      const element = s('body');
      const inElement = sEl(element, 'div');
      const elements = sAll('.class');
      const elementsInElement = sElAll(element, '.class');
   })();
```
`OUTPUT`
```javascript
   "use strict";!function(){var e,c,l,r,t=(e="body",document.querySelector(e));c="div",t.querySelector(c),l=".class",document.querySelectorAll(l),r=".class",t.querySelectorAll(r)}();
```
<hr />

#### PHP | PHTML
`INPUT`
```php
<?
   $var = 'text'
?>

<div>
   <?=$var?>
</div>
```
`OUTPUT`
```php
  <?php $var='text'?><div><?=$var?></div>
```
<hr />

#### Apache (.htaccess, php.ini)
`INPUT`
```apache
# comment
<Directory /var/www/>
   # another comment
   Options Indexes FollowSymLinks MultiViews
</Directory>
```
`OUTPUT`
```apache
<Directory /var/www/>
Options Indexes FollowSymLinks MultiViews
</Directory>
```
<hr />

#### Strings Replacement
   * You can create an easy to read code and on compiling, replace the specified strings, for example:
 
   <ins>`.swrc.js`</ins>
   
   ```javascript
   {
      strings: {
         '*token*': {
            start: '0cfcda42c340dad5616e0b7449a5634b',
            build: '0cfcda42c340dad5616e0b7449a5634b'
         },
         '*site-name*': {
            start: 'dev.weslley.io',
            build: 'weslley.io'
         }
      }
   }
   ```

   `INPUT`
   ```php
   <?
      $_POST['*token*'];
      $site = '*site-name*';
   ```

   `OUTPUT DEV (npx sw)`
   ```php
   <?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='dev.weslley.io';
   ```

   `OUTPUT BUILD (npx sw build)`
   ```php
   <?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='weslley.io';
   ```

   * Works for any language that is enabled in `.swrc.js`
<hr />

#### Miscellaneous Files
 * Only uploads the original file to the output directories
</details>
<hr />

### Compatibility

![macOS](https://badgen.net/badge/icon/macOS?icon=apple&label&color=8870FF)
![Linux](https://badgen.net/badge/icon/Linux?icon=terminal&label&color=8870FF)
![Windows](https://badgen.net/badge/icon/Windows?icon=windows&label&color=8870FF)
![node](https://badgen.net/badge/node/%3E=14.15.0/8870FF)
![npm](https://badgen.net/badge/icon/%3E=7.0.2/8870FF?icon=npm&label)
<hr />

### License
[![License](https://badgen.net/badge/License/MIT/8870FF)](/LICENSE)
[![3rd-Party Software License](https://badgen.net/badge/3rd-Party%20Software%20License/docs%2FLICENSE_THIRD_PARTY.md/8870FF)](/docs/LICENSE_THIRD_PARTY.md)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwellwelwel%2Fsimple-web.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fwellwelwel%2Fsimple-web?ref=badge_small)
<hr />

### Credits
| Contributors | GitHub |
|-|-|
| Author | [![wellwelwel](https://badgen.net/badge/icon/wellwelwel?icon=github&label&color=8870FF)](https://github.com/wellwelwel) |
| Translate en-US | [![SrLaco](https://badgen.net/badge/icon/SrLaco?icon=github&label&color=8870FF)](https://github.com/SrLaco) |
| Translate Review | [![micaele-mags](https://badgen.net/badge/icon/micaele-mags?icon=github&label&color=8870FF)](https://github.com/micaele-mags) |
<hr />

<p>

__Made with *sadness* and *sorrow* in rainy nights by [Weslley Araújo](https://github.com/wellwelwel)__ 🥺
</p>