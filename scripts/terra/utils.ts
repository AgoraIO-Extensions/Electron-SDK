let regMap: any = {
  isCallback: '.*(Observer|Handler|Callback|Receiver|Sink).*',
};

export function isMatch(str: string, type: string): boolean {
  let result = false;
  if (regMap[type]) {
    result = new RegExp(regMap[type]).test(str);
  }
  return result;
}

export function lowerFirstWord(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function convertToCamelCase(
  str: string,
  isFirstWordUpper = true
): string {
  if (/^[A-Z]+$/.test(str)) {
    return str
      .split(' ')
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }

  if (str.indexOf('_') === -1) {
    if (!isFirstWordUpper) {
      return lowerFirstWord(str);
    } else {
      return str;
    }
  }
  let words = str.replace(/[-_]/g, ' ').split(' ');

  let camelCaseStr = words
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  if (!isFirstWordUpper) {
    camelCaseStr = lowerFirstWord(camelCaseStr);
  }

  return camelCaseStr;
}
