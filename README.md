<p align="center">
 <img width="100px" src="/.github/assets/readme/logo.svg" align="center" alt="simple-web-cli" />
 <h1 align="center">Simple Web CLI</h1>
 <p align="center">⚡ A simple compiler to automate the development in <b>HTML</b>, <b>CSS</b>, <b>Sass</b>, <b>JavaScript</b> and <b>PHP</b> languages, focused on <b>Shared Hosts</b> and using <b>SFTP</b> or <b>FTP</b> to deploy files processed automatically to final server.</p>
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

-  **`src`** is the default directory of development to watch
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

#### Using SFTP or FTP HotSync

-  In the file **`.swrc.js`**, just insert the access infos:

<table width="100%">
<tr>
<td>SFTP</td>
<td>FTP</td>
</tr>
<tr>
<td>

```javascript
{
   // ...

   sftp: {
      start: {
         root: '',
         host: '',
         username: '',
         password: '',
      },
   },
}
```

</td>
<td>

```javascript
{
   // ...

   ftp: {
      root: '',
      host: '',
      user: '',
      pass: '',
      secure: true
   }
}
```

</td>
</tr>
<tr>
<td>

-  The [`sftp`](https://github.com/wellwelwel/basic-sftp) connection options extends all the [`ssh2`](https://github.com/mscdex/ssh2) options

</td>
<td>

-  If the server doesn't use SSL certification, set `explict` or `implict`

</td>
</tr>
</table>

-  Assuming the **`root`** option is `/` and the _remote directory_ is `/var/www`, the input and output of the directories would be:

   -  **Development:** <ins>`./src/`</ins> <b>`html/index.html`</b>
   -  **Distribution:** <ins>`./dist/`</ins> <b>`html/index.html`</b>
   -  **Server:** <ins>`/var/www/`</ins> <b>`html/index.html`</b>

-  You can only use one protocol at a time: `SFTP` or `FTP`

<hr />

#### Using TypeScript

-  Install TypeScript modules

   > ```
   > npm i tslib @rollup/plugin-typescript -D
   > ```

-  In <ins>rollup.config.js</ins>:
   > -  Import the plugin module:
   >    ```js
   >    import typescript from '@rollup/plugin-typescript';
   >    ```
   > -  Then, add the plugin to `configs`:
   >    ```js
   >    {
   >       // ...,
   >       plugins: [
   >          // ...,
   >          typescript(),
   >       ],
   >    };
   >    ```
-  It's done! 😉

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

#### Contributors

| Contributions    | GitHub                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Author           | [![wellwelwel](/.github/assets/readme/author.svg)](https://github.com/wellwelwel)               |
| Translate en-US  | [![SrLaco](/.github/assets/readme/translate.svg)](https://github.com/SrLaco)                    |
| Translate Review | [![micaele-mags](/.github/assets/readme/translate-review.svg)](https://github.com/micaele-mags) |

<hr />

#### `Create` dependencies

-  [@babel/preset-env](https://babel.dev/docs/en/next/babel-preset-env)
-  [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias#readme)
-  [@rollup/plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel#readme)
-  [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs/#readme)
-  [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#readme)
-  [@types/ssh2](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ssh2)
-  [autoprefixer](https://github.com/postcss/autoprefixer#readme)
-  [node-and-vite-helpers](https://github.com/wellwelwel/node-and-vite-helpers#readme)
-  [packages-update](https://github.com/wellwelwel/packages-update#readme)
-  [postcss-cli](https://github.com/postcss/postcss-cli#readme)
-  [rollup](https://rollupjs.org/)
-  [sass](https://github.com/sass/dart-sass)
-  [uglify-js](https://github.com/mishoo/UglifyJS#readme)

<hr />

<p>

**Made with _sadness_ and _sorrow_ in rainy nights by [Weslley Araújo](https://github.com/wellwelwel)** 🌌

</p>
