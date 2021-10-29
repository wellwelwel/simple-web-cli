const exec = require('child_process').exec;

module.exports = cmd => {
   
   return new Promise((resolve, reject) => {
      
      exec(cmd, (error, stdout, stderr) => {
         
         if (error) console.error(error);
         resolve(stdout? stdout : stderr);
      });
   });
};