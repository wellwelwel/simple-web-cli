<p align="center">
 <img width="100px" src="/.github/assets/readme/logo.svg" align="center" alt="simple-web-cli" />
 <h1 align="center">Simple Web CLI</h1>
 <p align="center">A simple compiler to automate the development in <b>HTML</b>, <b>CSS</b>, <b>Sass</b>, <b>JavaScript</b> and <b>PHP</b> languages focused on <b>Shared Hosts</b> and using FTP to deploy files processed automatically to final server.</p>
</p>

## Install

```shell
   npm i simple-web-cli -D
```

<hr>

### Usage

#### Create

```shell
   npx sw create
```

-  `npx sw create`: prepares the environment without starting the service

#### Start | Watch

```shell
   npx sw
```

-  `npx sw` or `npx sw start`: prepares the environment and starts the service

#### Build

```shell
   npx sw build
```

-  `npx sw build`: compiles the contents from `src` and zips it to `release.zip`

<hr />

### Development

-  **`scr`** is the default directory of development to watch
-  **`dist`** is the default directory with the compiled code
-  Once the process is started, the event occurs by **saving any file** into `src`.

<hr />

### <img src="/.github/assets/readme/logo.svg" width="20" /> Features

#### ES Modules to Native Browser Javascript

-  Import from external modules

   ```javascript
   // File: ./src/index.js

   import { s } from 'node-and-vite-helpers';

   const body = s('body');
   ```

   <!-- prettier-ignore -->
      >
      >    ```javascript
      >    // Output to ./dist/index.js:
      >
      >    !function(){"use strict";var e="body";document.querySelector(e)}();
      >    ```

-  Import from local modules

   ```javascript
   // File ./helpers/sum.js
   const sum = (a, b) => a + b;
   export default sum;

   // File: ./src/index.js
   import sum from '#helpers/sum';

   console.log(sum(1, 2));
   ```

   <!-- prettier-ignore -->
      >
      >    ```javascript
      >    // Output to ./dist/index.js:
      >
      >    !function(){"use strict";console.log(3)}();
      >    ```

<hr />

#### HTML Import

-  You can import `.html` files recursively, based on the `scss` import, for example:
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

#### Enable the FTP

-  In the file **`.swrc.js`**, just insert the access infos:

   ```javascript
   {
      ftp: {
         root: '',
         host: '',
         user: '',
         pass: '',
         secure: true | 'explict'
      }
   }
   ```

-  Assuming the **`root`** directory is <ins>`/var/www`</ins>, the input and output of the directories would be:

   -  **Development:** <ins>`./src`<b>`/html/index.html`</b></ins>
   -  **Distribution:** <ins>`./dist`<b>`/html/index.html`</b></ins>
   -  **Server:** <ins>`/var/www`<b>`/html/index.html`</b></ins>

<hr />

### <img src="/.github/assets/readme/logo.svg" width="20" /> Some Examples

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

<!-- prettier-ignore -->
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

<!-- prettier-ignore -->
   ```css
   div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}
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

-  You can create an easy to read code and on compiling, replace the specified strings, for example:

<ins>`.swrc.js`</ins>

```javascript
{
   strings: {
      '*token*': {
         start: '123',
         build: '456'
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
<?php $_POST['123'];$site='dev.weslley.io';
```

`OUTPUT BUILD (npx sw build)`

```php
<?php $_POST['456'];$site='weslley.io';
```

-  Works for any language that is enabled in `.swrc.js`
<hr />

#### Miscellaneous Files

-  Only uploads the original file to the output directories
</details>
<hr />

### Compatibility

![macOS](/.github/assets/readme/macos.svg)
![Linux](/.github/assets/readme/linux.svg)
![Windows](/.github/assets/readme/windows.svg)
![node](/.github/assets/readme/node.svg)
![npm](/.github/assets/readme/npm.svg)

<hr />

### License

[![License](/.github/assets/readme/license.svg)](/LICENSE)
[![3rd-Party Software License](/.github/assets/readme/3rd-license.svg)](/docs/LICENSE_THIRD_PARTY.md)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwellwelwel%2Fsimple-web.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fwellwelwel%2Fsimple-web?ref=badge_small)

<hr />

### Credits

| Contributors     | GitHub                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Author           | [![wellwelwel](/.github/assets/readme/author.svg)](https://github.com/wellwelwel)               |
| Translate en-US  | [![SrLaco](/.github/assets/readme/translate.svg)](https://github.com/SrLaco)                    |
| Translate Review | [![micaele-mags](/.github/assets/readme/translate-review.svg)](https://github.com/micaele-mags) |

<hr />

<p>

**Made with _sadness_ and _sorrow_ in rainy nights by [Weslley Araújo](https://github.com/wellwelwel)** 🥺

</p>
