let localAppId = ''
try {
  localAppId = require('./appID').default
  console.log('appID', localAppId)
} catch (error) {}

const config = {
  enableSDKLogging: true,
  enableSDKDebugLogging: false,
  appID: localAppId,
  token: '',
  defaultChannelId: 'testdcg',
  pluginPath: '',
  nativeSDKLogPath: './Agora_SDK.log',
  addonLogPath: './Agora_SDK_Addon.log',
}

export default config
