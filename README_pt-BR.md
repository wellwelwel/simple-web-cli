<p align="center">
 <img width="100px" src="/.github/assets/readme/logo.svg" align="center" alt="simple-web-cli" />
 <h1 align="center">Simple Web CLI</h1>
 <p align="center">Um simples compilador para automatizar o desenvolvimento nas linguagens HTML, CSS/Sass, JavaScript e PHP utilizando Localhost Live Reloader ou conexão FTP para enviar os arquivos processados automaticamente para o servidor final.</p>
</p>

<p align="center">
   <a href="/README.md">English</a>
   ·
   <a href="/README_pt-BR.md">Português</a>
</p>

## Instalação

```shell
   npm i simple-web-cli -D  # para baixar as dependências
```

```shell
   npx sw  # para iniciar o serviço
```

<hr />

### Desenvolvimento

-  **`scr`** é o diretório de desenvolvimento
-  **`dist`** é o diretório com o código compilado
<hr />

<!-- Comandos -->

### Comandos

-  `npx sw` ou `npx sw start`: prepara o ambiente e inicia o serviço
-  `npx sw init`: prepara o ambiente sem iniciar o serviço
-  `npx sw build`: compila todo o conteúdo do diretório `src` e compacta para o arquivo `release.zip`
<hr />

### Utilizando

-  Uma vez iniciado o processo, o evento ocorre ao **salvar qualquer arquivo** no diretório `src`.
<hr />

### <img src="/.github/assets/readme/logo.svg" width="20" /> Funcionalidades

   <!-- HTML Import -->

#### HTML Import

-  É possível importar recursivamente arquivos `.html`, baseado na importação do `scss`, por exemplo:
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

   <!-- Local Modules -->

#### Módulos Locais - Navegador

-  No **JavaScript** (web), é possível importar módulos locais salvos dentro do diretório `.library`, por exemplo:

   <ins>`.library/meu-script/index.js`</ins>

   ```javascript
   /* para importação completa do arquivo */
   require('web/meu-script');

   /* para importar o módulo padrão em uma variável */
   const meu_script = require('web/meu-script');

   /* para importar os módulos em variáveis por desestruturação */
   const { meu_script1, meu_script2 } = require('web/meu-script');

   /* para importar o módulo em uma variável com nome personalizado */
   const minha_variavel = require('web/meu-script').meu_script1;
   ```

   <hr />

#### Habilitando o FTP

-  No arquivo **`.swrc.js`**, basta inserir as informações de acesso:

   ```javascript
   {
      ftp: {
         root: '_DIRETORIO_RAIZ_',
         host: '_IP_',
         user: '_USUARIO_',
         pass: '_SENHA_',
         secure: true || 'explict'
      }
   }
   ```

-  Supondo que o diretório **`root`** seja <ins>`/var/www`</ins>, a entrada e saída dos diretórios seria:

   -  **Desenvolvimento:** <ins>`src/html/index.html`</ins>
   -  **Distribuição:** <ins>`dist/html/index.html`</ins>
   -  **FTP:** <ins>`/var/www/html/index.html`</ins>
   <hr />

### <img src="/.github/assets/readme/logo.svg" width="20" /> Alguns Exemplos

<details>
<summary>Visualizar Exemplos</summary>

<!-- HTML -->

#### HTML

`ENTRADA`

```html
<div>
   <h1>Título</h1>
   <p>Parágrafo</p>
</div>
```

`SAÍDA`

```html
<div>
   <h1>Título</h1>
   <p>Parágrafo</p>
</div>
```

<hr />

<!-- CSS -->

#### CSS | Sass

`ENTRADA`

```css
div {
   display: flex;
}
```

`SAÍDA`

```css
div {
   display: -webkit-box;
   display: -webkit-flex;
   display: -moz-box;
   display: -ms-flexbox;
   display: flex;
}
```

<hr />

<!-- JS -->

#### JavaScript

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
'use strict';
!(function () {
   var e,
      c,
      l,
      r,
      t = ((e = 'body'), document.querySelector(e));
   (c = 'div'), t.querySelector(c), (l = '.class'), document.querySelectorAll(l), (r = '.class'), t.querySelectorAll(r);
})();
```

<hr />

<!-- PHP -->

#### PHP | PHTML

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

#### Apache (.htaccess, php.ini)

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

<!-- Substituição de Textos -->

#### Substituição de Textos

-  É possível criar um código de fácil leitura e ao compilar, substituir os textos específicados, por exemplo:

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

`ENTRADA`

```php
<?
   $_POST['*token*'];
   $site = '*site-name*';
```

`SAÍDA DEV (npx sw)`

```php
<?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='dev.weslley.io';
```

`SAÍDA BUILD (npx sw build)`

```php
<?php $_POST['0cfcda42c340dad5616e0b7449a5634b'];$site='weslley.io';
```

-  Funciona em qualquer linguagem que estiver habilitada em `.swrc.js`
<hr />

<!-- others -->

#### Arquivos gerais

-  Apenas envia o arquivo original para os diretórios de saída
</details>
<hr />

### Compatibilidade

![macOS](/.github/assets/readme/macos.svg)
![Linux](/.github/assets/readme/linux.svg)
![Windows](/.github/assets/readme/windows.svg)
![node](/.github/assets/readme/node.svg)
![npm](/.github/assets/readme/npm.svg)

<hr />

### Licença

[![License](/.github/assets/readme/license.svg)](/LICENSE)
[![3rd-Party Software License](/.github/assets/readme/3rd-license.svg)](/docs/LICENSE_THIRD_PARTY.md)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwellwelwel%2Fsimple-web.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fwellwelwel%2Fsimple-web?ref=badge_small)

<hr />

### Créditos

| Contribuidores      | GitHub                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Autor               | [![wellwelwel](/.github/assets/readme/author.svg)](https://github.com/wellwelwel)               |
| Tradução en-US      | [![SrLaco](/.github/assets/readme/translate.svg)](https://github.com/SrLaco)                    |
| Revisão de Tradução | [![micaele-mags](/.github/assets/readme/translate-review.svg)](https://github.com/micaele-mags) |

<hr />

<p>

**Feito com _dor_ e _sofrimento_ em noites frias por [Weslley Araújo](https://github.com/wellwelwel)** 🥺

</p>
