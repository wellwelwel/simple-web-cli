const forceArray = inputs => {

   const array = [ ];
   if (typeof inputs === 'string') array.push(inputs);
   else if (typeof inputs === 'object') Object.assign(array, inputs);
   else throw('An array or string is expected');

   return array;
};

module.exports = forceArray;