import {
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngineEventHandler,
  LocalAudioStreamError,
  LocalAudioStreamState,
  LoopbackAudioTrackConfig,
  LoopbackAudioTrackType,
  MediaDeviceType,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraCard,
  AgoraDivider,
  AgoraSlider,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface LoopbackAudioTrackInfo {
  trackId: number;
  appName: string;
  volume: number;
  loopbackType: LoopbackAudioTrackType;
  deviceName: string;
  processId: number;
  isPublished: boolean;
  // Private parameters at creation time (read-only)
  externalAECFarin: boolean;
  enableAEC: boolean;
  allowLoopbackWithSCK: boolean;
  allowLoopbackWithCatap: boolean;
  allowSilenceDetection: boolean;
  forceUseALD: boolean;
}

/**
 * LoopbackAudioTrackForm Component
 * Displays information and controls for a single loopback audio track
 */
interface LoopbackAudioTrackFormProps {
  track: LoopbackAudioTrackInfo;
  onDestroy: () => void;
  onUpdate: (config: LoopbackAudioTrackConfig) => void;
  onPublish: () => void;
  onUnpublish: () => void;
}

const LoopbackAudioTrackForm: React.FC<LoopbackAudioTrackFormProps> = ({
  track,
  onDestroy,
  onUpdate,
  onPublish,
  onUnpublish,
}) => {
  // Only volume can be changed after creation
  const [localVolume, setLocalVolume] = React.useState(track.volume);

  React.useEffect(() => {
    setLocalVolume(track.volume);
  }, [track]);

  const handleUpdate = () => {
    // Only volume can be updated, other fields are read-only after creation
    const config: LoopbackAudioTrackConfig = {
      volume: localVolume,
      // Keep original values for fields that cannot be changed
      appName: track.appName,
      loopbackType: track.loopbackType,
      deviceName: track.deviceName,
      processId: track.processId,
    };
    onUpdate(config);
  };

  const getLoopbackTypeName = (type: LoopbackAudioTrackType): string => {
    switch (type) {
      case LoopbackAudioTrackType.LoopbackSystem:
        return 'System';
      case LoopbackAudioTrackType.LoopbackSystemExcludeSelf:
        return 'System (Exclude Self)';
      case LoopbackAudioTrackType.LoopbackApplication:
        return 'Application';
      case LoopbackAudioTrackType.LoopbackProcess:
        return 'Process';
      default:
        return 'Unknown';
    }
  };

  // Determine which fields to show based on loopbackType
  const shouldShowAppName =
    track.loopbackType === LoopbackAudioTrackType.LoopbackApplication;

  const shouldShowDeviceName =
    track.loopbackType === LoopbackAudioTrackType.LoopbackSystem ||
    track.loopbackType === LoopbackAudioTrackType.LoopbackSystemExcludeSelf;

  const shouldShowProcessId =
    track.loopbackType === LoopbackAudioTrackType.LoopbackProcess;

  return (
    <AgoraCard title={`Track #${track.trackId}`} style={{ marginBottom: 12 }}>
      <div style={{ padding: 8 }}>
        {/* Compact info and buttons row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              flex: 1,
            }}
          >
            <span style={{ fontSize: '13px' }}>
              <strong>ID:</strong> {track.trackId}
            </span>
            <span
              style={{
                color: track.isPublished ? '#52c41a' : '#999',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              {track.isPublished ? '● Published' : '○ Not Published'}
            </span>
            <span style={{ color: '#666', fontSize: '13px' }}>
              <strong>Source:</strong>{' '}
              {`${getLoopbackTypeName(track.loopbackType)}${
                shouldShowAppName ? ` - ${track.appName}` : ''
              }${shouldShowDeviceName ? ` - ${track.deviceName}` : ''}${
                shouldShowProcessId ? ` - ${track.processId}` : ''
              }`}
            </span>
          </div>
          {/* Compact button row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {!track.isPublished ? (
              <AgoraButton
                title="Publish"
                onPress={onPublish}
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  fontSize: '12px',
                  padding: '2px 8px',
                  minHeight: '28px',
                }}
              />
            ) : (
              <AgoraButton
                title="Unpublish"
                onPress={onUnpublish}
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  fontSize: '12px',
                  padding: '2px 8px',
                  minHeight: '28px',
                }}
              />
            )}
            <AgoraButton
              title="Update"
              onPress={handleUpdate}
              style={{
                marginTop: 0,
                marginBottom: 0,
                fontSize: '12px',
                padding: '2px 8px',
                minHeight: '28px',
              }}
            />
            <AgoraButton
              title="Destroy"
              onPress={onDestroy}
              style={{
                marginTop: 0,
                marginBottom: 0,
                fontSize: '12px',
                padding: '2px 8px',
                minHeight: '28px',
              }}
            />
          </div>
        </div>

        {/* Volume slider */}
        <AgoraSlider
          title={`Volume ${localVolume}`}
          minimumValue={0}
          maximumValue={400}
          step={1}
          value={localVolume}
          onSlidingComplete={(value) => {
            setLocalVolume(value);
          }}
        />

        {/* Private parameters at creation time (read-only) */}
        <AgoraDivider style={{ margin: '8px 0' }} />
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 6 }}>
            <strong>Private Parameters (at creation):</strong>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: '11px',
              color: '#888',
            }}
          >
            <div>
              <strong>External AEC Farin:</strong>{' '}
              {track.externalAECFarin ? 'true' : 'false'}
            </div>
            <div>
              <strong>Enable AEC:</strong> {track.enableAEC ? 'true' : 'false'}
            </div>
            <div>
              <strong>Allow Silence Detection:</strong>{' '}
              {track.allowSilenceDetection ? 'true' : 'false'}
            </div>
            {process.platform === 'darwin' && (
              <>
                <div>
                  <strong>Force use ALD:</strong>{' '}
                  {track.forceUseALD ? 'true' : 'false'}
                </div>
                <div>
                  <strong>Allow Loopback with SCK:</strong>{' '}
                  {track.allowLoopbackWithSCK ? 'true' : 'false'}
                </div>
                <div>
                  <strong>Allow Loopback with Catap:</strong>{' '}
                  {track.allowLoopbackWithCatap ? 'true' : 'false'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AgoraCard>
  );
};

interface State extends BaseAudioComponentState {
  enableLocalAudio: boolean;
  publishMicrophoneTrack: boolean;
  muteLocalAudioStream: boolean;
  enablePreDump: boolean;
  recordingSignalVolume: number;
  playbackSignalVolume: number;
  // Loopback audio track related states
  loopbackTracks: LoopbackAudioTrackInfo[];
  // Form input states for creating new track
  loopbackAppName: string;
  loopbackVolume: number;
  loopbackType: LoopbackAudioTrackType;
  loopbackDeviceName: string;
  loopbackProcessId: number;
  forceUseALD: boolean;
  loopbackAECAggressiveness: number;
  externalAECFarin: boolean;
  enableAEC: boolean;
  allowLoopbackWithSCK: boolean;
  allowLoopbackWithCatap: boolean;
  allowSilenceDetection: boolean;
}

export default class LoopbackAudioTrack
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: false,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      enableLocalAudio: true,
      publishMicrophoneTrack: true,
      enablePreDump: false,
      muteLocalAudioStream: false,
      recordingSignalVolume: 100,
      playbackSignalVolume: 100,
      // Loopback audio track related states
      loopbackTracks: [],
      loopbackAppName: '',
      loopbackVolume: 100,
      loopbackType: LoopbackAudioTrackType.LoopbackSystem,
      loopbackDeviceName: 'AgoraALD',
      loopbackProcessId: 0,
      forceUseALD: false,
      loopbackAECAggressiveness: -1,
      externalAECFarin: true,
      enableAEC: true,
      allowLoopbackWithSCK: false,
      allowLoopbackWithCatap: true,
      allowSilenceDetection: true,
    };
  }

  /**
   * Step 1: initRtcEngine
   */
  protected async initRtcEngine() {
    const { appId } = this.state;
    if (!appId) {
      this.error(`appId is invalid`);
    }

    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    // Need granted the microphone permission
    await askMediaAccess(['microphone']);

    // Only need to enable audio on this case
    this.engine.enableAudio();
  }

  /**
   * Step 2: joinChannel
   */
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

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    this.engine?.joinChannel(token, channelId, uid, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
    });
  }

  /**
   * Step 3-1-1 (Optional): enableLocalAudio
   */
  enableLocalAudio = () => {
    this.engine?.enableLocalAudio(true);
    this.setState({ enableLocalAudio: true });
  };

  /**
   * Step 3-1-2 (Optional): disableLocalAudio
   */
  disableLocalAudio = () => {
    this.engine?.enableLocalAudio(false);
    this.setState({ enableLocalAudio: false });
  };

  /**
   * Step 3-2-1 (Optional): muteLocalAudioStream
   */
  muteLocalAudioStream = () => {
    this.engine?.muteLocalAudioStream(true);
    this.setState({ muteLocalAudioStream: true });
  };

  /**
   * Step 3-2-2 (Optional): unmuteLocalAudioStream
   */
  unmuteLocalAudioStream = () => {
    this.engine?.muteLocalAudioStream(false);
    this.setState({ muteLocalAudioStream: false });
  };

  publishMicrophoneTrack = () => {
    this.engine?.updateChannelMediaOptions({
      publishMicrophoneTrack: true,
    });
    this.setState({ publishMicrophoneTrack: true });
  };

  unpublishMicrophoneTrack = () => {
    this.engine?.updateChannelMediaOptions({
      publishMicrophoneTrack: false,
    });
    this.setState({ publishMicrophoneTrack: false });
  };

  enablePreDump = () => {
    this.engine?.setParameters(`{"che.audio.apm_dump":true}`);
    this.engine?.setParameters(
      `{"che.audio.enable.predump":{"enable":"true","duration":"30"}}`
    );
    this.engine?.setParameters(`{"che.audio.start.predump":true}`);
    this.setState({ enablePreDump: true });
  };

  disablePreDump = () => {
    this.engine?.setParameters(`{"che.audio.start.predump":false}`);
    this.engine?.setParameters(`{"che.audio.apm_dump":false}`);
    this.engine?.setParameters(
      `{"che.audio.enable.predump":{"enable":"false","duration":"30"}}`
    );
    this.setState({ enablePreDump: false });
  };

  /**
   * Step 3-3 (Optional): adjustRecordingSignalVolume
   */
  adjustRecordingSignalVolume = () => {
    const { recordingSignalVolume } = this.state;
    this.engine?.adjustRecordingSignalVolume(recordingSignalVolume);
  };

  /**
   * Step 3-4 (Optional): adjustPlaybackSignalVolume
   */
  adjustPlaybackSignalVolume = () => {
    const { playbackSignalVolume } = this.state;
    this.engine?.adjustPlaybackSignalVolume(playbackSignalVolume);
  };

  /**
   * Handle Force use ALD checkbox change
   */
  handleForceUseALDChange = (checked: boolean) => {
    // Set catap and sck parameters based on checkbox state
    // When force use ALD is enabled, disable catap and sck
    const catapValue = !checked;
    const sckValue = !checked;

    this.engine?.setParameters(
      `{"che.audio.loopback.allow_loopback_with_catap":${catapValue}}`
    );
    this.engine?.setParameters(
      `{"che.audio.loopback.allow_loopback_with_sck":${sckValue}}`
    );

    // Update state for related checkboxes
    this.setState({
      forceUseALD: checked,
      allowLoopbackWithCatap: catapValue,
      allowLoopbackWithSCK: sckValue,
    });

    this.info(
      `Force use ALD: ${
        checked ? 'enabled' : 'disabled'
      }, catap: ${catapValue}, sck: ${sckValue}`
    );
  };

  handleLoopbackAECAggressivenessChange = (value: number) => {
    this.setState({ loopbackAECAggressiveness: value });
    this.engine?.setParameters(
      `{"che.audio.loopback.apm_aec_aggressiveness":${value}}`
    );
    const valueNames: { [key: number]: string } = {
      [-1]: 'Not Specified',
      [0]: 'Mild',
      [1]: 'Normal',
      [2]: 'Aggressive',
      [3]: 'Super Aggressive',
      [4]: 'Extreme',
    };
    this.info(`LOOPBACK AEC Aggressiveness: ${valueNames[value] || value}`);
  };

  handleExternalAECFarinChange = (checked: boolean) => {
    this.setState({ externalAECFarin: checked });
    this.engine?.setParameters(
      `{"che.audio.loopback.external_aec_farin":${checked}}`
    );
    this.info(`External AEC Farin: ${checked ? 'enabled' : 'disabled'}`);
  };

  handleEnableAECChange = (checked: boolean) => {
    this.setState({ enableAEC: checked });
    this.engine?.setParameters(`{"che.audio.loopback.enable_aec":${checked}}`);
    this.info(`Enable AEC: ${checked ? 'enabled' : 'disabled'}`);
  };

  handleAllowLoopbackWithSCKChange = (checked: boolean) => {
    this.setState({ allowLoopbackWithSCK: checked });
    this.engine?.setParameters(
      `{"che.audio.loopback.allow_loopback_with_sck":${checked}}`
    );
    this.info(`Allow loopback with SCK: ${checked ? 'enabled' : 'disabled'}`);
  };

  handleAllowLoopbackWithCatapChange = (checked: boolean) => {
    this.setState({ allowLoopbackWithCatap: checked });
    this.engine?.setParameters(
      `{"che.audio.loopback.allow_loopback_with_catap":${checked}}`
    );
    this.info(`Allow loopback with Catap: ${checked ? 'enabled' : 'disabled'}`);
  };

  handleAllowSilenceDetectionChange = (checked: boolean) => {
    this.setState({ allowSilenceDetection: checked });
    this.engine?.setParameters(
      `{"che.audio.loopback.allow_silence_detection":${checked}}`
    );
    this.info(`Allow silence detection: ${checked ? 'enabled' : 'disabled'}`);
  };

  /**
   * Create Loopback audio track
   */
  createLoopbackAudioTrack = () => {
    const {
      loopbackAppName,
      loopbackVolume,
      loopbackType,
      loopbackDeviceName,
      loopbackProcessId,
    } = this.state;

    // Validate processId is required for LoopbackProcess
    if (
      loopbackType === LoopbackAudioTrackType.LoopbackProcess &&
      loopbackProcessId <= 0
    ) {
      this.error(
        'Process ID cannot be empty or less than or equal to 0 in Process Loopback mode'
      );
      return;
    }

    // Validate appName is required for LoopbackApplication
    if (
      loopbackType === LoopbackAudioTrackType.LoopbackApplication &&
      (!loopbackAppName || loopbackAppName.trim() === '')
    ) {
      this.error('App Name cannot be empty in Application Loopback mode');
      return;
    }

    const config: LoopbackAudioTrackConfig = {
      appName: loopbackAppName,
      volume: loopbackVolume,
      loopbackType: loopbackType,
      deviceName: loopbackDeviceName,
      processId: loopbackProcessId,
    };

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        const trackId = mediaEngine.createLoopbackAudioTrack(config);
        if (trackId >= 0) {
          const {
            externalAECFarin,
            enableAEC,
            allowLoopbackWithSCK,
            allowLoopbackWithCatap,
            allowSilenceDetection,
            forceUseALD,
          } = this.state;
          const newTrack: LoopbackAudioTrackInfo = {
            trackId,
            appName: loopbackAppName,
            volume: loopbackVolume,
            loopbackType: loopbackType,
            deviceName: loopbackDeviceName,
            processId: loopbackProcessId,
            isPublished: false,
            // Save private parameters at creation time
            externalAECFarin,
            enableAEC,
            allowLoopbackWithSCK,
            allowLoopbackWithCatap,
            allowSilenceDetection,
            forceUseALD,
          };

          this.setState((prevState) => ({
            loopbackTracks: [...prevState.loopbackTracks, newTrack],
          }));

          this.info(
            `Loopback audio track created successfully, Track ID: ${trackId}`
          );
        } else {
          this.error(
            `Failed to create Loopback audio track, error code: ${trackId}`
          );
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(
        `Error occurred while creating Loopback audio track: ${error}`
      );
    }
  };

  /**
   * Destroy all Loopback audio tracks
   */
  destroyAllLoopbackAudioTracks = () => {
    const { loopbackTracks } = this.state;

    if (loopbackTracks.length === 0) {
      this.info('No loopback audio tracks to destroy');
      return;
    }

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        let successCount = 0;
        let failCount = 0;

        // Destroy all tracks
        loopbackTracks.forEach((track) => {
          try {
            // If this track is published, unpublish it first
            if (track.isPublished) {
              this.engine?.updateChannelMediaOptions({
                publishLoopbackAudioTrack: false,
                publishLoopbackAudioTrackId: track.trackId,
              });
            }

            const result = mediaEngine.destroyLoopbackAudioTrack(track.trackId);
            if (result === 0) {
              successCount++;
            } else {
              failCount++;
              this.error(
                `Failed to destroy Loopback audio track, Track ID: ${track.trackId}, error code: ${result}`
              );
            }
          } catch (error) {
            failCount++;
            this.error(
              `Error occurred while destroying Loopback audio track, Track ID: ${track.trackId}, error: ${error}`
            );
          }
        });

        // Clear all tracks from state
        this.setState({
          loopbackTracks: [],
        });

        if (successCount > 0) {
          this.info(
            `Destroyed ${successCount} loopback audio track(s)${
              failCount > 0 ? `, ${failCount} failed` : ''
            }`
          );
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(
        `Error occurred while destroying all Loopback audio tracks: ${error}`
      );
    }
  };

  /**
   * Destroy Loopback audio track
   */
  destroyLoopbackAudioTrack = (trackId: number) => {
    const { loopbackTracks } = this.state;

    const track = loopbackTracks.find((t) => t.trackId === trackId);
    if (!track) {
      this.error('Loopback audio track not found');
      return;
    }

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        // If this track is published, unpublish it first
        if (track.isPublished) {
          this.engine?.updateChannelMediaOptions({
            publishLoopbackAudioTrack: false,
            publishLoopbackAudioTrackId: trackId,
          });
        }

        const result = mediaEngine.destroyLoopbackAudioTrack(trackId);
        if (result === 0) {
          this.setState((prevState) => ({
            loopbackTracks: prevState.loopbackTracks.filter(
              (t) => t.trackId !== trackId
            ),
          }));
          this.info(
            `Loopback audio track destroyed successfully, Track ID: ${trackId}`
          );
        } else {
          this.error(
            `Failed to destroy Loopback audio track, error code: ${result}`
          );
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(
        `Error occurred while destroying Loopback audio track: ${error}`
      );
    }
  };

  /**
   * Update Loopback audio track configuration
   */
  updateLoopbackAudioTrackConfig = (
    trackId: number,
    config: LoopbackAudioTrackConfig
  ) => {
    const { loopbackTracks } = this.state;

    const track = loopbackTracks.find((t) => t.trackId === trackId);
    if (!track) {
      this.error('Loopback audio track not found');
      return;
    }

    // Validate appName is required for LoopbackApplication
    const loopbackType = config.loopbackType ?? track.loopbackType;
    const appName = config.appName ?? track.appName;
    if (
      loopbackType === LoopbackAudioTrackType.LoopbackApplication &&
      (!appName || appName.trim() === '')
    ) {
      this.error('App Name cannot be empty in Application Loopback mode');
      return;
    }

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        const result = mediaEngine.updateLoopbackAudioTrackConfig(
          trackId,
          config
        );
        if (result === 0) {
          // Update track info in state
          this.setState((prevState) => ({
            loopbackTracks: prevState.loopbackTracks.map((t) =>
              t.trackId === trackId
                ? {
                    ...t,
                    appName: config.appName ?? t.appName,
                    volume: config.volume ?? t.volume,
                    loopbackType: config.loopbackType ?? t.loopbackType,
                    deviceName: config.deviceName ?? t.deviceName,
                    processId: config.processId ?? t.processId,
                  }
                : t
            ),
          }));
          this.info(
            `Loopback audio track configuration updated successfully, Track ID: ${trackId}`
          );
        } else {
          this.error(
            `Failed to update Loopback audio track configuration, error code: ${result}`
          );
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(
        `Error occurred while updating Loopback audio track configuration: ${error}`
      );
    }
  };

  /**
   * Publish a Loopback audio track to channel
   * Multiple tracks can be published simultaneously
   */
  publishLoopbackAudioTrack = (trackId: number) => {
    const { loopbackTracks } = this.state;

    const track = loopbackTracks.find((t) => t.trackId === trackId);
    if (!track) {
      this.error('Loopback audio track not found');
      return;
    }

    if (track.isPublished) {
      this.info(`Loopback audio track ${trackId} is already published`);
      return;
    }

    try {
      // Publish the track (can publish multiple tracks simultaneously)
      this.engine?.updateChannelMediaOptions({
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: true,
        publishLoopbackAudioTrack: true,
        publishLoopbackAudioTrackId: trackId,
      });

      this.setState((prevState) => ({
        loopbackTracks: prevState.loopbackTracks.map((t) =>
          t.trackId === trackId ? { ...t, isPublished: true } : t
        ),
      }));

      this.info(
        `Loopback audio track published successfully, Track ID: ${trackId}`
      );
    } catch (error) {
      this.error(
        `Error occurred while publishing Loopback audio track: ${error}`
      );
    }
  };

  /**
   * Unpublish a Loopback audio track from channel
   */
  unpublishLoopbackAudioTrack = (trackId: number) => {
    const { loopbackTracks } = this.state;

    const track = loopbackTracks.find((t) => t.trackId === trackId);
    if (!track) {
      this.error('Loopback audio track not found');
      return;
    }

    if (!track.isPublished) {
      this.info(`Loopback audio track ${trackId} is not published`);
      return;
    }

    try {
      this.engine?.updateChannelMediaOptions({
        publishLoopbackAudioTrack: false,
        publishLoopbackAudioTrackId: trackId,
      });

      this.setState((prevState) => ({
        loopbackTracks: prevState.loopbackTracks.map((t) =>
          t.trackId === trackId ? { ...t, isPublished: false } : t
        ),
      }));

      this.info(
        `Loopback audio track unpublished successfully, Track ID: ${trackId}`
      );
    } catch (error) {
      this.error(
        `Error occurred while unpublishing Loopback audio track: ${error}`
      );
    }
  };

  /**
   * Step 4: leaveChannel
   */
  protected leaveChannel() {
    this.disablePreDump();

    this.destroyAllLoopbackAudioTracks();

    this.engine?.leaveChannel();
  }

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  onError(err: ErrorCodeType, msg: string) {
    super.onError(err, msg);
  }

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    super.onJoinChannelSuccess(connection, elapsed);
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    super.onLeaveChannel(connection, stats);
  }

  onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number) {
    super.onUserJoined(connection, remoteUid, elapsed);
  }

  onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    super.onUserOffline(connection, remoteUid, reason);
  }

  onAudioDeviceStateChanged(
    deviceId: string,
    deviceType: number,
    deviceState: number
  ) {
    this.info(
      'onAudioDeviceStateChanged',
      'deviceId',
      deviceId,
      'deviceType',
      deviceType,
      'deviceState',
      deviceState
    );
  }

  onAudioDeviceVolumeChanged(
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) {
    this.info(
      'onAudioDeviceVolumeChanged',
      'deviceType',
      deviceType,
      'volume',
      volume,
      'muted',
      muted
    );
  }

  onLocalAudioStateChanged(
    connection: RtcConnection,
    state: LocalAudioStreamState,
    error: LocalAudioStreamError
  ) {
    this.info(
      'onLocalAudioStateChanged',
      'connection',
      connection,
      'state',
      state,
      'error',
      error
    );
  }

  onAudioRoutingChanged(deviceType: number, routing: number) {
    this.info(
      'onAudioRoutingChanged',
      'deviceType',
      deviceType,
      'routing',
      routing
    );
  }

  protected renderUsers(): ReactElement | undefined {
    const { loopbackTracks } = this.state;

    if (loopbackTracks.length === 0) {
      return (
        <AgoraCard title="Loopback Audio Tracks">
          <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
            No loopback audio tracks created yet. Create one using the form on
            the right.
          </div>
        </AgoraCard>
      );
    }

    return (
      <>
        {loopbackTracks.map((track) => (
          <LoopbackAudioTrackForm
            key={track.trackId}
            track={track}
            onDestroy={() => this.destroyLoopbackAudioTrack(track.trackId)}
            onUpdate={(config) =>
              this.updateLoopbackAudioTrackConfig(track.trackId, config)
            }
            onPublish={() => this.publishLoopbackAudioTrack(track.trackId)}
            onUnpublish={() => this.unpublishLoopbackAudioTrack(track.trackId)}
          />
        ))}
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      recordingSignalVolume,
      playbackSignalVolume,
      muteLocalAudioStream,
      publishMicrophoneTrack,
      enablePreDump,
    } = this.state;
    const isMacOS = process.platform === 'darwin';
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <AgoraSlider
              title={`Recording: ${recordingSignalVolume}`}
              minimumValue={0}
              maximumValue={400}
              step={1}
              value={recordingSignalVolume}
              onSlidingComplete={(value) => {
                this.setState({ recordingSignalVolume: value });
              }}
            />
          </div>
          <AgoraButton
            title="Apply"
            onPress={this.adjustRecordingSignalVolume}
            style={{ marginTop: 0, marginBottom: 0, minWidth: 80 }}
          />
        </div>
        <AgoraDivider style={{ margin: '8px 0' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <AgoraSlider
              title={`Playback: ${playbackSignalVolume}`}
              minimumValue={0}
              maximumValue={400}
              step={1}
              value={playbackSignalVolume}
              onSlidingComplete={(value) => {
                this.setState({ playbackSignalVolume: value });
              }}
            />
          </div>
          <AgoraButton
            title="Apply"
            onPress={this.adjustPlaybackSignalVolume}
            style={{ marginTop: 0, marginBottom: 0, minWidth: 80 }}
          />
        </div>
        <AgoraDivider style={{ margin: '8px 0' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          {/* <AgoraButton
            title={`${enableLocalAudio ? 'Disable' : 'Enable'} Local Audio`}
            onPress={
              enableLocalAudio ? this.disableLocalAudio : this.enableLocalAudio
            }
            style={{ marginTop: 0, marginBottom: 0, flex: 1, minWidth: 150 }}
          /> */}
          <AgoraButton
            title={`${muteLocalAudioStream ? 'Unmute' : 'Mute'} Audio Stream`}
            onPress={
              muteLocalAudioStream
                ? this.unmuteLocalAudioStream
                : this.muteLocalAudioStream
            }
            style={{ marginTop: 0, marginBottom: 0, flex: 1, minWidth: 150 }}
          />
          <AgoraButton
            title={`${
              publishMicrophoneTrack ? 'Unpublish' : 'Publish'
            } Microphone`}
            onPress={
              publishMicrophoneTrack
                ? this.unpublishMicrophoneTrack
                : this.publishMicrophoneTrack
            }
            style={{ marginTop: 0, marginBottom: 0, flex: 1, minWidth: 150 }}
          />
          <AgoraButton
            title={`${enablePreDump ? 'Disable' : 'Enable'} Pre Dump`}
            onPress={enablePreDump ? this.disablePreDump : this.enablePreDump}
            style={{ marginTop: 0, marginBottom: 0, flex: 1, minWidth: 150 }}
          />
        </div>
        <AgoraDivider style={{ margin: '8px 0' }} />
        {isMacOS && (
          <div style={{ marginBottom: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={this.state.forceUseALD}
                onChange={(e) => this.handleForceUseALDChange(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Force use ALD
            </label>
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <label>
            LOOPBACK AEC:
            <select
              value={this.state.loopbackAECAggressiveness}
              onChange={(e) =>
                this.handleLoopbackAECAggressivenessChange(
                  Number(e.target.value)
                )
              }
              style={{ marginLeft: 10, padding: 5 }}
            >
              <option value={-1}>Not Specified -1 (Default)</option>
              <option value={0}>Mild 0</option>
              <option value={1}>Normal 1</option>
              <option value={2}>Aggressive 2</option>
              <option value={3}>Super Aggressive 3</option>
              <option value={4}>Extreme 4</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={this.state.externalAECFarin}
              onChange={(e) =>
                this.handleExternalAECFarinChange(e.target.checked)
              }
              style={{ marginRight: 8 }}
            />
            External AEC Farin
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={this.state.enableAEC}
              onChange={(e) => this.handleEnableAECChange(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Enable AEC (Default: true)
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={this.state.allowSilenceDetection}
              onChange={(e) =>
                this.handleAllowSilenceDetectionChange(e.target.checked)
              }
              style={{ marginRight: 8 }}
            />
            Allow Silence Detection (Default: true)
          </label>
        </div>
        {isMacOS && (
          <div style={{ marginBottom: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={this.state.allowLoopbackWithSCK}
                onChange={(e) =>
                  this.handleAllowLoopbackWithSCKChange(e.target.checked)
                }
                style={{ marginRight: 8 }}
              />
              Allow Loopback with SCK
            </label>
          </div>
        )}
        {isMacOS && (
          <div style={{ marginBottom: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={this.state.allowLoopbackWithCatap}
                onChange={(e) =>
                  this.handleAllowLoopbackWithCatapChange(e.target.checked)
                }
                style={{ marginRight: 8 }}
              />
              Allow Loopback with Catap (Default: true)
            </label>
          </div>
        )}
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const {
      loopbackAppName,
      loopbackVolume,
      loopbackType,
      loopbackDeviceName,
      loopbackProcessId,
      loopbackTracks,
    } = this.state;

    // Determine whether to show deviceName input field
    // Only show on macOS (darwin)
    const isMacOS = process.platform === 'darwin';
    const shouldShowDeviceName =
      isMacOS &&
      (loopbackType === LoopbackAudioTrackType.LoopbackSystem ||
        loopbackType === LoopbackAudioTrackType.LoopbackSystemExcludeSelf);

    const shouldShowAppName =
      loopbackType === LoopbackAudioTrackType.LoopbackApplication;

    // Determine whether to show processId input field
    const shouldShowProcessId =
      loopbackType === LoopbackAudioTrackType.LoopbackProcess;

    return (
      <>
        <div style={{ marginBottom: 10 }}>
          <label>Loopback Type:</label>
          <select
            value={loopbackType}
            onChange={(e) =>
              this.setState({ loopbackType: Number(e.target.value) })
            }
            style={{ marginLeft: 10, padding: 5 }}
          >
            <option value={LoopbackAudioTrackType.LoopbackSystem}>
              System
            </option>
            <option value={LoopbackAudioTrackType.LoopbackSystemExcludeSelf}>
              System (Exclude Self)
            </option>
            <option value={LoopbackAudioTrackType.LoopbackApplication}>
              Application
            </option>
            <option value={LoopbackAudioTrackType.LoopbackProcess}>
              Process
            </option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <AgoraSlider
            title={`Volume ${loopbackVolume}`}
            minimumValue={0}
            maximumValue={400}
            step={1}
            value={loopbackVolume}
            onSlidingComplete={(value) => {
              this.setState({ loopbackVolume: value });
            }}
          />
        </div>

        {shouldShowDeviceName && (
          <div style={{ marginBottom: 10 }}>
            <label>Device Name:</label>
            <input
              type="text"
              value={loopbackDeviceName}
              onChange={(e) =>
                this.setState({ loopbackDeviceName: e.target.value })
              }
              placeholder="Default: AgoraALD"
              style={{ marginLeft: 10, padding: 5, width: 200 }}
            />
          </div>
        )}

        {shouldShowAppName && (
          <div style={{ marginBottom: 10 }}>
            <label>App Name:</label>
            <input
              type="text"
              value={loopbackAppName}
              onChange={(e) =>
                this.setState({ loopbackAppName: e.target.value })
              }
              placeholder="Required"
              style={{ marginLeft: 10, padding: 5, width: 200 }}
            />
            <span style={{ color: 'red', marginLeft: 10 }}>* Required</span>
          </div>
        )}

        {shouldShowProcessId && (
          <div style={{ marginBottom: 10 }}>
            <label>Process ID:</label>
            <input
              type="number"
              value={loopbackProcessId}
              onChange={(e) =>
                this.setState({ loopbackProcessId: Number(e.target.value) })
              }
              placeholder="Required"
              min="1"
              style={{ marginLeft: 10, padding: 5, width: 200 }}
            />
            <span style={{ color: 'red', marginLeft: 10 }}>* Required</span>
          </div>
        )}

        <AgoraButton
          title="Create Loopback Audio Track"
          onPress={this.createLoopbackAudioTrack}
        />
        <AgoraButton
          title="Destroy All Tracks"
          onPress={this.destroyAllLoopbackAudioTracks}
          disabled={loopbackTracks.length === 0}
        />
      </>
    );
  }
}
