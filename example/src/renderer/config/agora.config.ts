let localAppId = '';
try {
  localAppId = require('./appID').default;
  console.log('appID', localAppId);
} catch (error) {
  console.warn(error);
}

const config = {
  enableSDKLogging: true,
  enableSDKDebugLogging: false,
  // Get your own App ID at https://dashboard.agora.io/
  appId: localAppId,
  // Please refer to https://docs.agora.io/en/Agora%20Platform/token
  token: '',
  channelId: 'testdcg',
  uid: 0,
  pluginPath: '',
  SDKLogPath: './agorasdk.log',
};

export default config;
