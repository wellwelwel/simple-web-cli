# <img src="https://weslley.io/media/simple-web-11.svg" width="32" /> simple-web

>  Um simples compilador para automatizar o desenvolvimento nas linguagens HTML, CSS/Sass, JavaScript e PHP utilizando conexão FTP para enviar os arquivos processados automaticamente para o servidor final.  
<hr />

### - Inicialização
- Local
>* **`npm i simple-web-cli`** ou **`yarn add simple-web-cli`** para baixar as dependências
>* **`npx simple-web`** ou **`yarn simple-web`** para iniciar o serviço
- Global
>* **`npm i simple-web-cli -g`** ou **`yarn global add simple-web-cli`** para baixar as dependências
>* **`simple-web`** para iniciar o serviço
<hr />

### - Desenvolvimento
* **`scr`** é o diretório de desenvolvimento
* **`.main`** é o diretório com o código compilado
<hr />

### - Configurando o FTP
* No arquivo **`.web-config.json`**, basta inserir as informações de acesso:
```json
   "ftp": {
      "root": "_DIRETORIO_RAIZ_",
      "host": "_IP_",
      "user": "_USUARIO_",
      "pass": "_SENHA_",
      "secure": true
   }
```
> ##### *- caso não seja inserido nenhum acesso, ele criará o projeto normalmente, apenas ignorando o envio FTP* <br /> *- se o FTP não possuir certificação SSL, utilize `"explict"` em `"secure"`*

* Supondo que o diretório **`root`** seja <ins>`/var/www`</ins>, a entrada e saída dos diretórios seria:

   + **Desenvolvimento:** <ins>`src/html/index.html`</ins>  
   + **Distribuição:** <ins>`.main/html/index.html`</ins>  
   + **FTP:** <ins>`/var/www/html/index.html`</ins>  
<hr />

### - Utilizando
   * Uma vez iniciado o processo, o evento ocorre ao **salvar qualquer arquivo** dentro do diretório `src`.
<hr />

### - Exemplos
<hr />

<!-- HTML -->
### HTML
`ENTRADA`
```html
   <div>
      <h1>Título</h1>
      <p>Parágrafo</p>
   </div>
```
`SAÍDA`
```html
   <div><h1>Título</h1><p>Parágrafo</p></div>
```
<hr />

<!-- CSS -->
### CSS | Sass
`ENTRADA`
```css
   div {
      display: flex;
   }
```
`SAÍDA`
```css
   div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}
```
<hr />

<!-- JS -->
### JavaScript
`ENTRADA`
```javascript
   (() => {
      require('web/selector');

      const element = s('body');
      const inElement = sEl(element, 'div');
      const elements = sAll('.class');
      const elementsInElement = sElAll(element, '.class');
   })();
```
`SAÍDA`
```javascript
   "use strict";!function(){var e,c,l,r,t=(e="body",document.querySelector(e));c="div",t.querySelector(c),l=".class",document.querySelectorAll(l),r=".class",t.querySelectorAll(r)}();
```
<hr />

<!-- PHP -->
### PHP | PHTML
`ENTRADA`
```php
<?
   $var = 'texto'
?>

<div>
   <?=$var?>
</div>
```
`SAÍDA`
```php
  <?php $var='texto'?><div><?=$var?></div>
```
<hr />

<!-- .htaccess -->
### Apache (.htaccess, php.ini)
`ENTRADA`
```apache
# comment
<Directory /var/www/>
   # another comment
   Options Indexes FollowSymLinks MultiViews
</Directory>
```
`SAÍDA`
```apache
<Directory /var/www/>
Options Indexes FollowSymLinks MultiViews
</Directory>
```
<hr />

<!-- others -->
### Arquivos gerais
 * Apenas envia o arquivo original para os diretórios de saída
<hr />

<!-- Local Modules -->
### Módulos Locais
  * No **JavaScript Web**, é possível importar módulos locais salvos dentro dos arquivos, por exemplo:

   <ins>`.library/meu-script/index.js`</ins>
   
   ```javascript
      require('web/meu-script'); /* para importação completa do arquivo */
      const meu_script = require('web/meu-script'); /* para importar o módulo em uma variável */
   ```
<hr />

<!-- Substituição de Textos -->
### Substituição de Textos
   * É possível criar um código de fácil leitura e ao compilar, substituir os textos específicados. Por exemplo:
   > ##### *- funciona em qualquer linguagem que estiver habilitada em `.web-replace.json`*
 
   <ins>`.web-replace.json`</ins>
   
   ```json
   {
      "strings": {
         "*token*": {
            "dev": "0cfcda42c340dad5616e0b7449a5634b",
            "build": "0cfcda42c340dad5616e0b7449a5634b"
         },
         "*site-name*": {
            "dev": "dev.weslley.io",
            "build": "weslley.io"
         }
      }
   }
   ```

   `ENTRADA`
   ```php
   <?
      $_POST['*token*'];
      $site = '*site-name*';
   ```

   `SAÍDA DEV (npx simple-web | yarn simple-web)`
   ```php
   <?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='dev.weslley.io';
   ```

   `SAÍDA BUILD (npx simple-web build | yarn simple-web build)`
   ```php
   <?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='weslley.io';
   ```
<hr />

<!-- Compatibilidade -->
### - Compatibilidade

>
>`Sistemas Operacionais`  
>
>- [x] **macOS**  
>- [x] **Linux**  
>- [x] **Windows**  
>

>
>`Editores`  
>
>- [x] [**Visual Studio Code**](https://code.visualstudio.com/Download)  
>- [x] **Outros** *(as funcionalidades dependem apenas do `Terminal`, porém, outros editores podem não ser compatíveis com sugestões de módulos locais)*  
>

>
>`Extensões Recomendadas (VSCode)` <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" width="12" />
>
>- [x] [**ESLint** - *Dirk Baeumer*](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
>- [x] [**npm Intellisense** - *Christian Kohler*](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
>- [x] [**Path Intellisense** - *Christian Kohler*](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
>- [x] [**Visual Studio IntelliCode** - *Microsoft*](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
>

#### __Feito com *dor* e *sofrimento* em noites frias por [Weslley Araújo](https://github.com/wellwelwel) 🖤__
