jest.mock('../../build/Release/agora_node_ext', () => {
  return {
    AgoraElectronBridge: function () {
      return {
        CallApi: () => {
          return {
            callApiReturnCode: 0,
            callApiResult: JSON.stringify({ result: 0 }),
          };
        },
        OnEvent: () => {},
      };
    },
  };
});

jest.mock('../Renderer/RendererManager', () => {
  return {
    RendererManager: function () {},
  };
});
