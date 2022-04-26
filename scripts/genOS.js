module.exports = () => {
  const platform = process.platform;
  if (platform === 'darwin') {
    return 'mac';
  } else if (platform === 'win32') {
    return 'win32';
  } else {
    // not supported in temp
    logger.error('Unsupported platform!');
    throw new Error('Unsupported platform!');
  }
};
