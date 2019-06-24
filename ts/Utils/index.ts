export const deprecate = (replaceApi?: string) => {
  console.warn('This method will be deprecated soon. ', replaceApi ? `Please use ${replaceApi} instead` : '');
};