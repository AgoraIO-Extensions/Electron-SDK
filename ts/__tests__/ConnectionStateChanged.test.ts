import createAgoraRtcEngine, {
  ConnectionChangedReasonType,
  ConnectionStateType,
} from '../AgoraSdk';
import { processIRtcEngineEventHandler } from '../Private/impl/IAgoraRtcEngineImpl';
import { EVENT_PROCESSORS, emitEvent } from '../Private/internal/IrisApiEngine';

test('exports the private deployment PCU limit reason', () => {
  expect(ConnectionChangedReasonType.ConnectionChangedPcuExceeded).toBe(25);
  expect(ConnectionChangedReasonType[25]).toBe('ConnectionChangedPcuExceeded');
  expect(ConnectionChangedReasonType.ConnectionChangedRejectedByServer).toBe(
    10
  );
});

test.each([25, 10])(
  'preserves connection state and reason %i for event handlers',
  (reason) => {
    const connection = { channelId: 'private-deployment', localUid: 42 };
    const callback = jest.fn();

    processIRtcEngineEventHandler(
      { onConnectionStateChanged: callback },
      'onConnectionStateChanged',
      { connection, state: ConnectionStateType.ConnectionStateFailed, reason }
    );

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(connection, 5, reason);
  }
);

test.each([25, 10])(
  'preserves connection state and reason %i for listeners',
  (reason) => {
    const engine = createAgoraRtcEngine();
    const connection = { channelId: 'private-deployment', localUid: 42 };
    const callback = jest.fn();
    engine.addListener('onConnectionStateChanged', callback);

    try {
      emitEvent(
        'onConnectionStateChanged',
        EVENT_PROCESSORS.IRtcEngineEventHandler,
        {
          connection,
          state: ConnectionStateType.ConnectionStateFailed,
          reason,
        }
      );

      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(connection, 5, reason);
    } finally {
      engine.removeListener('onConnectionStateChanged', callback);
    }
  }
);
