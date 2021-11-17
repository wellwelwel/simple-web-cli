"use strict";

var isCompatible = function isCompatible() {

   try {
   
      var process = require("process");
      var node = {
         
         minimun: 14.15,
         current:process.version.split(".") || ["v0","0"]
      };
      
      return node.minimun >= parseFloat("".concat(node.current[0].replace(/[^0-9]/, ""), ".").concat(node.current[1] || 0));
   }
   catch (error) {
      
      return false;
   }
};

module.exports = isCompatible;