# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="24" /> WEBSERVICE

>  Um simples WebService para automatizar o desenvolvimento nas linguagens HTML, CSS, JavaScript e PHP utilizando conexão FTP para enviar os arquivos automaticamente ao servidor final.  

### ➖ Inicialização
* **`npm i`** ou **`yarn --ignore-engines`** para baixar as dependências
* **`npm start`** ou **`yarn start`** para iniciar o webservice

### ➖ Desenvolvimento
* **`scr`** é o diretório de desenvolvimento
* **`.main`** é o diretório com o código compilado

### ➖ Configurando o FTP
* No arquivo **`.webserviceconfig.json`**, basta inserir as informações de acesso:
```json
   "ftp": {
      "root": "_DIRETORIO_RAIZ_",
      "host": "_IP_",
      "user": "_USUARIO_",
      "pass": "_SENHA_",
      "secure": true
   }
```
> ##### *caso não seja inserido nenhum acesso, ele criará o projeto normalmente, apenas ignorando o envio FTP*

* Supondo que o diretório **`root`** seja <ins>`/var/www`</ins>, a entrada e saída dos diretórios seria:

   ➖ **Desenvolvimento:** <ins>`src/html/index.html`</ins>  
   ➖ **Distribuição:** <ins>`.main/html/index.html`</ins>  
   ➖ **FTP:** <ins>`/var/www/html/index.html`</ins>  

<br />

### ➖ Utilizando
>   Uma vez iniciado o processo com `npm start` ou `yarn start`, o evento ocorre ao **salvar qualquer arquivo** dentro do diretório `src`.

<!-- HTML -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="24" /> `HTML`
>`ENTRADA`
>```html
>   <div>
>      <h1>Título</h1>
>      <p>Parágrafo</p>
>   </div>
>```
>`SAÍDA`
>```html
>   <div><h1>Título</h1><p>Parágrafo</p></div>
>```
<br />

<!-- CSS -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24" /> `CSS` <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" width="24" /> `Sass`
>`ENTRADA`
>```css
>   div {
>      display: flex;
>   }
>```
>`SAÍDA`
>```css
>   div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}
>```
<br />

<!-- JS -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" /> `JavaScript`
>`ENTRADA`
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
>`SAÍDA`
>```javascript
>   "use strict";!function(){var e,c,l,r,t=(e="body",document.querySelector(e));c="div",t.querySelector(c),l=".class",document.querySelectorAll(l),r=".class",t.querySelectorAll(r)}();
>```
<br />

<!-- PHP -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg" width="36" /> `PHP` | `PHTML`
>`ENTRADA`
>```php
><?
>   $var = 'texto'
>?>
>
><div>
>   <?=$var?>
></div>
>```
>`SAÍDA`
>```php
>  <?php $var='texto'?><div><?=$var?></div>
>```

<!-- .htaccess -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" width="42" /> `Apache (.htaccess, php.ini)`
>`ENTRADA`
>```apache
># comment
><Directory /var/www/>
>   # another comment
>   Options Indexes FollowSymLinks MultiViews
></Directory>
>```
>`SAÍDA`
>```apache
><Directory /var/www/>
>Options Indexes FollowSymLinks MultiViews
></Directory>
>```
<br />

<!-- others -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" width="24" /> `Arquivos gerais`
> * Apenas envia o arquivo original para os diretórios de saída
<br />

<!-- Local Modules -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="24" /> `Módulos Locais`
>  * No **JavaScript Web**, é possível importar módulos locais salvos dentro dos arquivos, por exemplo:
> 
>     <ins>`.library/meu-script/index.js`</ins>
>     
>     ```javascript
>        require('web/meu-script'); /* para importação completa do arquivo */
>        const meu_script = require('web/meu-script'); /* para importar o módulo em uma variável */
>     ```
<br />

<!-- Substituição de Textos -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg" width="24" /> ` Substituição de Textos`
>  * Nas linguagens **PHP** e **Apache** é possível criar um código de fácil leitura e ao compilar, substituir os *strings* específicados. Por exemplo:
> 
>     <ins>`.webservicereplace.json`</ins>
>     
>     ```json
>     {
>        "strings": {
>           "*token*": {
>              "dev": "0cfcda42c340dad5616e0b7449a5634b"
>           },
>           "*site-name*": {
>              "dev": "weslley.io"
>           }
>        }
>     }
>     ```
>
>`ENTRADA`
>```php
><?
>   $_POST['*token*'];
>   $site = '*site-name*';
>```
>
>`SAÍDA`
>```php
><?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='weslley.io';
>```
<br />

<!-- Compatibilidade -->
# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/putty/putty-plain.svg" width="24" /> `Compatibilidade`

>
>`Sistemas Operacionais`  
>
> ✅ **macOS**  
> ✅ **Linux**  
> 🚫 **Windows**  
>

>
>`Editores`  
>
> ✅ [**Visual Studio Code**](https://code.visualstudio.com/Download)  
> ❎ **Outros** *(as funcionalidades dependem apenas do `Terminal`, porém, outros editores podem não ser compatíveis com sugestões de módulos locais)*  
>

>
>`Extensões Recomendadas (VSCode)` <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" width="12" />
>
>- [x] [**ESLint** - *Dirk Baeumer*](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
>- [x] [**npm Intellisense** - *Christian Kohler*](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
>- [x] [**Path Intellisense** - *Christian Kohler*](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
>- [x] [**Visual Studio IntelliCode** - *Microsoft*](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
>
<br />

#### __Feito com *dor* e *sofrimento* em noites frias por [Weslley Araújo](https://github.com/wellwelwel) 🫀__
