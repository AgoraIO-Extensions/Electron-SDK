const generateRandomString = length => {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789! #$%&,()+, -,:;<=.#$%&,()+,-,:;<=.,>?@[],^_,{|},~';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const generateRandomNumber = max => {
  return Math.floor(Math.random() * max);
};

module.exports = {
  generateRandomString: generateRandomString,
  generateRandomNumber: generateRandomNumber
};
