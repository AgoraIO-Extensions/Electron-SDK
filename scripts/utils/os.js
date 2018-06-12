const getPlatform = () => {
  if (process.platform === 'darwin') {
    return 'mac';
  }
  if (process.platform === 'win32') {
    return 'win';
  }
  return 'unsupported';
};

module.exports = getPlatform;
