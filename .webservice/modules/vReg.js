function vReg(string, options = 'g') {

   const validate_string = string.
      replace(/\//g, '\\/').
      replace(/\./g, '\\.').
      replace(/\*/g, '\\*').
      replace(/\$/g, '\\$').
      replace(/\+/g, '\\+').
      replace(/\?/g, '\\?').
      replace(/\|/g, '\\|').
      replace(/\[/g, '\\[').
      replace(/\]/g, '\\]').
      replace(/\(/g, '\\(').
      replace(/\)/g, '\\)').
      replace(/\{/g, '\\{').
      replace(/\}/g, '\\}');

   return new RegExp(validate_string, options);
}

module.exports = vReg;