module.exports = function (config) {
  config.externals = [
    ...(config.externals || []),
    'agora-electron-sdk/js/Private/internal/IrisApiEngine.js',
    'agora-electron-sdk/js/Private/ipc/main.js',
  ];
  return config;
};
