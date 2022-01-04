"use strict";

var isNodeCompatible = function isNodeCompatible() {

   try {

      var process = require("process");
      var node = {

         minimun: 14.15,
         current:process.version.split(".") || ["v0","0"]
      };

      return parseFloat("".concat(node.current[0].replace(/[^0-9]/, ""), ".").concat(node.current[1] || 0)) >= node.minimun;
   }
   catch (error) {

      return false;
   }
};

module.exports = isNodeCompatible;