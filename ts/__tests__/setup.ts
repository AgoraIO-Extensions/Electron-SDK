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
        PushSharedD3D11Texture: jest.fn().mockResolvedValue({
          frameId: 0,
          result: 0,
        }),
      };
    },
  };
});

jest.mock('../Renderer/RendererManager', () => {
  return {
    RendererManager: function () {},
  };
});
