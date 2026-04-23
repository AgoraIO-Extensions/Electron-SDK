import os from 'os';

import {
  ChannelProfileType,
  ClientRoleType,
  IMediaRecorder,
  IMediaRecorderObserver,
  IRtcEngineEventHandler,
  MediaRecorderContainerFormat,
  MediaRecorderStreamType,
  RecorderInfo,
  RecorderReasonCode,
  RecorderState,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  storagePath: string;
  startRecording: boolean;
  listenerRegistered: boolean;
  observerInjected: boolean;
  listenerInfoUpdatedCount: number;
  observerInfoUpdatedCount: number;
  listenerStateChangedCount: number;
  observerStateChangedCount: number;
  lastEvent: string;
  validationStatus: string;
}

export default class MediaRecorderObserverValidation
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected recorder?: IMediaRecorder;

  private readonly recorderInfoUpdateInterval = 1000;
  private readonly maxDurationMs = 15000;

  private readonly validationObserver: IMediaRecorderObserver = {
    onRecorderInfoUpdated: (channelId, uid, info) => {
      this.info(
        '[observer] onRecorderInfoUpdated',
        'channelId',
        channelId,
        'uid',
        uid,
        'info',
        info
      );
      this.setState((prevState) => ({
        observerInfoUpdatedCount: prevState.observerInfoUpdatedCount + 1,
        lastEvent: `[observer] onRecorderInfoUpdated`,
        validationStatus:
          'PASS: observer received callback after addListener -> setMediaRecorderObserver',
      }));
    },
    onRecorderStateChanged: (channelId, uid, state, reason) => {
      this.info(
        '[observer] onRecorderStateChanged',
        'channelId',
        channelId,
        'uid',
        uid,
        'state',
        state,
        'reason',
        reason
      );
      this.handleRecorderStateChanged(state);
      this.setState((prevState) => ({
        observerStateChangedCount: prevState.observerStateChangedCount + 1,
        lastEvent: `[observer] onRecorderStateChanged state=${state} reason=${reason}`,
        validationStatus:
          'PASS: observer received callback after addListener -> setMediaRecorderObserver',
      }));
    },
  };

  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: false,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      storagePath: os.homedir(),
      startRecording: false,
      listenerRegistered: false,
      observerInjected: false,
      listenerInfoUpdatedCount: 0,
      observerInfoUpdatedCount: 0,
      listenerStateChangedCount: 0,
      observerStateChangedCount: 0,
      lastEvent: 'Idle',
      validationStatus:
        'Join channel, then run the validation sequence to verify observer callbacks.',
    };
  }

  protected async initRtcEngine() {
    const { appId } = this.state;
    if (!appId) {
      this.error(`appId is invalid`);
    }

    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    await askMediaAccess(['microphone']);
    this.engine.enableAudio();
  }

  protected joinChannel() {
    const { channelId, token, uid } = this.state;
    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      this.error('uid is invalid');
      return;
    }

    this.engine?.joinChannel(token, channelId, uid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  }

  protected leaveChannel() {
    this.destroyMediaRecorder();
    this.engine?.leaveChannel();
  }

  protected releaseRtcEngine() {
    this.destroyMediaRecorder();
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  private createMediaRecorder() {
    const { channelId, uid } = this.state;
    this.recorder = this.engine?.createMediaRecorder({
      channelId,
      uid,
    });
  }

  private destroyMediaRecorder() {
    if (!this.recorder) {
      return;
    }
    try {
      this.recorder.stopRecording();
    } catch (error) {
      this.log('ignore stopRecording error while destroying recorder', error);
    }
    this.engine?.destroyMediaRecorder(this.recorder);
    this.recorder = undefined;
  }

  private handleRecorderStateChanged(state: RecorderState) {
    switch (state) {
      case RecorderState.RecorderStateStart:
        this.setState({ startRecording: true });
        break;
      case RecorderState.RecorderStateError:
      case RecorderState.RecorderStateStop:
        this.setState({ startRecording: false });
        break;
    }
  }

  private readonly onListenerRecorderInfoUpdated = (
    channelId: string,
    uid: number,
    info: RecorderInfo
  ) => {
    this.info(
      '[listener] onRecorderInfoUpdated',
      'channelId',
      channelId,
      'uid',
      uid,
      'info',
      info
    );
    this.setState((prevState) => ({
      listenerInfoUpdatedCount: prevState.listenerInfoUpdatedCount + 1,
      lastEvent: `[listener] onRecorderInfoUpdated`,
    }));
  };

  private readonly onListenerRecorderStateChanged = (
    channelId: string,
    uid: number,
    state: RecorderState,
    reason: RecorderReasonCode
  ) => {
    this.info(
      '[listener] onRecorderStateChanged',
      'channelId',
      channelId,
      'uid',
      uid,
      'state',
      state,
      'reason',
      reason
    );
    this.handleRecorderStateChanged(state);
    this.setState((prevState) => ({
      listenerStateChangedCount: prevState.listenerStateChangedCount + 1,
      lastEvent: `[listener] onRecorderStateChanged state=${state} reason=${reason}`,
    }));
  };

  private resetValidationState(message: string) {
    this.setState({
      startRecording: false,
      listenerRegistered: false,
      observerInjected: false,
      listenerInfoUpdatedCount: 0,
      observerInfoUpdatedCount: 0,
      listenerStateChangedCount: 0,
      observerStateChangedCount: 0,
      lastEvent: message,
      validationStatus: message,
    });
  }

  private prepareValidationRecorder = () => {
    if (!this.state.joinChannelSuccess) {
      this.error(
        'Please join channel before preparing the validation recorder'
      );
      return;
    }

    this.destroyMediaRecorder();
    this.resetValidationState(
      'Prepared a fresh recorder. Next step is addListener -> setMediaRecorderObserver.'
    );
    this.createMediaRecorder();

    if (!this.recorder) {
      this.error('createMediaRecorder failed');
      return;
    }

    this.recorder.addListener(
      'onRecorderInfoUpdated',
      this.onListenerRecorderInfoUpdated
    );
    this.recorder.addListener(
      'onRecorderStateChanged',
      this.onListenerRecorderStateChanged
    );
    this.recorder.setMediaRecorderObserver(this.validationObserver);

    this.setState({
      listenerRegistered: true,
      observerInjected: true,
      lastEvent:
        'Validation recorder prepared with addListener -> setMediaRecorderObserver',
      validationStatus:
        'Prepared. Start recording and wait for observer callback counts to increase.',
    });
  };

  private startRecording = () => {
    const { storagePath, uid } = this.state;
    if (!this.recorder) {
      this.error('Please prepare the validation recorder first');
      return;
    }

    this.recorder.startRecording({
      storagePath: `${storagePath}/${uid}_media_recorder_validation.mp4`,
      containerFormat: MediaRecorderContainerFormat.FormatMp4,
      streamType: MediaRecorderStreamType.StreamTypeAudio,
      maxDurationMs: this.maxDurationMs,
      recorderInfoUpdateInterval: this.recorderInfoUpdateInterval,
    });
    this.setState({
      validationStatus:
        'Recording started. Observer callback counts should become greater than 0 shortly.',
      lastEvent: 'startRecording invoked',
    });
  };

  private stopRecording = () => {
    this.recorder?.stopRecording();
    this.setState({
      startRecording: false,
      lastEvent: 'stopRecording invoked',
    });
  };

  private runValidationSequence = () => {
    this.prepareValidationRecorder();
    if (!this.recorder) {
      return;
    }
    this.startRecording();
  };

  protected renderConfiguration(): ReactElement | undefined {
    const {
      storagePath,
      listenerRegistered,
      observerInjected,
      listenerInfoUpdatedCount,
      observerInfoUpdatedCount,
      listenerStateChangedCount,
      observerStateChangedCount,
      lastEvent,
      validationStatus,
    } = this.state;

    return (
      <>
        <AgoraText>{`Validation path: addListener -> setMediaRecorderObserver -> startRecording`}</AgoraText>
        <AgoraDivider />
        <AgoraText>{`validationStatus: ${validationStatus}`}</AgoraText>
        <AgoraText>{`lastEvent: ${lastEvent}`}</AgoraText>
        <AgoraDivider />
        <AgoraText>{`listenerRegistered: ${listenerRegistered}`}</AgoraText>
        <AgoraText>{`observerInjected: ${observerInjected}`}</AgoraText>
        <AgoraDivider />
        <AgoraText>{`listenerInfoUpdatedCount: ${listenerInfoUpdatedCount}`}</AgoraText>
        <AgoraText>{`observerInfoUpdatedCount: ${observerInfoUpdatedCount}`}</AgoraText>
        <AgoraText>{`listenerStateChangedCount: ${listenerStateChangedCount}`}</AgoraText>
        <AgoraText>{`observerStateChangedCount: ${observerStateChangedCount}`}</AgoraText>
        <AgoraDivider />
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ storagePath: text });
          }}
          placeholder={'storagePath'}
          value={storagePath}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { joinChannelSuccess, startRecording } = this.state;

    return (
      <>
        <AgoraView>
          <AgoraText>{`1. Join channel`}</AgoraText>
          <AgoraText>{`2. Click Run Validation Sequence`}</AgoraText>
          <AgoraText>{`3. Confirm observer callback counts become > 0`}</AgoraText>
        </AgoraView>
        <AgoraButton
          disabled={!joinChannelSuccess}
          title={'Prepare Validation Recorder'}
          onPress={this.prepareValidationRecorder}
        />
        <AgoraButton
          disabled={!joinChannelSuccess || startRecording}
          title={'Run Validation Sequence'}
          onPress={this.runValidationSequence}
        />
        <AgoraButton
          disabled={!joinChannelSuccess || !this.recorder || startRecording}
          title={'Start Recording'}
          onPress={this.startRecording}
        />
        <AgoraButton
          disabled={!startRecording}
          title={'Stop Recording'}
          onPress={this.stopRecording}
        />
      </>
    );
  }
}
