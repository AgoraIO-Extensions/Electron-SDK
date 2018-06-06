const generateRandomString = length => {
    let text = ''
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789! #$%&,()+, -,:;<=.#$%&,()+,-,:;<=.,>?@[],^_,{|},~";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const generateRandomNumber = maxLength => {
  return Math.floor(Math.random()*maxLength)
}

module.exports = {
  generateRandomString: generateRandomString,
  generateRandomNumber: generateRandomNumber
}