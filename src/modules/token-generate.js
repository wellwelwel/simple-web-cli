const generateRandomHexadecimal = () =>
  Math.floor(Math.random() * 16).toString(16);

const tokenGenerate = (tokenSize = 32) => {
  const token = [];

  for (let size = 0; size < tokenSize; size++)
    token.push(generateRandomHexadecimal());

  return token.join('');
};

export default tokenGenerate;
