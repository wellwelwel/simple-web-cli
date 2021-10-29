class Blacklist {

   constructor(blacklist) {

      const cheats = {

         "a": [ "@", "4", "á", "à", "â", "ã", "ª", "^" ],
         "b": [ "3", "8" ],
         "c": [ "ç", "\\(", "\\[", "\\{", "<" ],
         "d": [ ],
         "e": [ "3", "é", "ê", "&" ],
         "f": [ ],
         "g": [ "6" ],
         "h": [ ],
         "i": [ "1", "!", "í", "l" ],
         "j": [ ],
         "k": [ ],
         "l": [ "1", "!", "í", "i" ],
         "m": [ "ññ", "nn" ],
         "n": [ "ñ" ],
         "o": [ "0", "ó", "ô", "õ", "º", "\\(\\)" ],
         "p": [ ],
         "q": [ ],
         "r": [ ],
         "s": [ "5", "\\$", "z" ],
         "t": [ "7" ],
         "u": [ "ú", "v", "w" ],
         "v": [ "u", "ú" ],
         "w": [ ],
         "x": [ ],
         "y": [ "i", "l" ],
         "z": [ "2", "s" ]
      };

      /* -- CODE -- */
      try {

         // valida a blacklist enviada
         if (!Array.isArray(blacklist)) throw('A blacklist precisa ser um array');

         // captura tudo que for unicode
         const getUnicode = /(((?!\s)(?=([^a-z0-9~!@#$%^&*()_+`'"=:{}[%?|;,./<>ªºáãàâéêíóõôºúüçñ\]\\\-\s]))).?(?=[^\x2A\x30-\x39\x41-\x5A\x61-\x7A])*)+/gim;
         // guarda os regex gerados com o conteúdo da blacklist
         const blacklistRegex = [];

         if (blacklist.length > 0) {

            // tratar itens da blacklist
            blacklist.map((item, id) => blacklist[id] = item.normalize('NFD').replace(/[\s\u0300-\u036f]/gim, '').toLowerCase());

            // percorre todos os itens da blacklist e cria um regex para cada um
            blacklist.forEach(item => {

               // "explode" cada caractere para um array
               const item_split = item.split('');
               
               // prepara variáveis para o loop
               let count = 0;
               let item_regex = '';
         
               // percorre cada caractere e cria um regex para cada combinação do objeto "cheat" no caractere relacionado
               item_split.forEach(character => {
         
                  count++;
                  const currentCheat = cheats[character];
                  
                  if (currentCheat) {

                     const item_length = item_split.length;
                     const cheat_length = currentCheat.length;

                     const regex_character = currentCheat.toString().split(',').join('.?|');
                     const regex_last_character = currentCheat.toString().split(',').join('|');

                     const cheatMid = cheat_length > 0 ? `|${regex_character}.?` : '';
                     const cheatLast = cheat_length > 0 ? `|${regex_last_character}` : '';

                     item_regex += count < item_length ? `(${character}.?${cheatMid})` : `(${character}${cheatLast})`;
                  }
               });
         
               // guarda na memória o regex final gerado pelo loop
               blacklistRegex.push(RegExp(item_regex, 'gim'));
            });
         }

         this.validate = text => {

            try {

               // valida os parâmetros
               if (typeof text !== 'string' || text?.trim().length === 0) throw('O conteúdo a ser validado precisa ser do tipo string');
               if (blacklist.length === 0) return true;
               
               // normalizar dígitos (como "\u0061" de volta para "a")
               text = text.normalize('NFC');
               // remover espaços duplicados
               text = text.replace(/\s/gim, ' ');
               
               // guarda, caso ocorra, os "matchs" com os itens da blacklist
               const invalids = [];
               // guarda, caso ocorra, os caracteres unicodes
               const unicodes = text.match(getUnicode) || [];
            
               // verifica ocorrências para cada regex gerado
               blacklistRegex.forEach(regex => {
            
                  // cria um array com as ocorrências, caso houver
                  const words = text.match(regex);
            
                  if (words?.length > 0) Object.assign(invalids, words);
               });
               
               return invalids?.length > 0 || unicodes?.length > 0 ? { matchs: invalids, unicodes: unicodes } : true;
            }
            catch(error) {

               console.error(error);
            }
         };
      }
      catch(error) {

         console.error(error);
      }
   }
}

module.exports = Blacklist;