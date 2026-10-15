import {
  AgoraEnv,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  RenderModeType,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraCard,
  AgoraDivider,
  AgoraDropdown,
  AgoraList,
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { arrayToItems, enumToItems } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

const FILL_UIDS_KEY = 'rtc.video.render.remote_view_fill_enable_uids';

const MATCH_ALL = '*';

const reportStyle: React.CSSProperties = {
  marginTop: 8,
  padding: 8,
  maxHeight: 260,
  overflow: 'auto',
  fontSize: 11,
  lineHeight: 1.4,
  backgroundColor: 'rgb(245, 245, 245)',
};

/**
 * The remote tile shape. fill only differs from fit/hidden when the container
 * aspect ratio does not match the video aspect ratio, so the shape has to be
 * switchable to make the effect observable.
 */
const REMOTE_SHAPES: Record<string, string> = {
  '16:9': AgoraStyle.fillModeView16x9,
  '4:3': AgoraStyle.fillModeView4x3,
  '21:9': AgoraStyle.fillModeView21x9,
  '1:1': AgoraStyle.fillModeView1x1,
};

interface State extends BaseVideoComponentState {
  fillUids: string;
  appliedFillUids: string;
  remoteRenderMode: RenderModeType;
  remoteMirrorMode: VideoMirrorModeType;
  remoteShape: string;
  selectedUser?: number;
  transformReport: string;
}

export default class RemoteViewFillMode
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      startPreview: false,
      fillUids: MATCH_ALL,
      appliedFillUids: '',
      remoteRenderMode: RenderModeType.RenderModeFit,
      remoteMirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
      remoteShape: '21:9',
      transformReport: '',
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

    // Need granted the microphone and camera permission
    await askMediaAccess(['microphone', 'camera']);

    // Need to enable video on this case
    this.engine.enableVideo();

    this.engine.startPreview();
    this.setState({ startPreview: true });
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

    this.engine?.joinChannel(token, channelId, uid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  }

  /**
   * Step 3-1: set the fill render mode private parameter
   *
   * The parameter is engine scoped and takes effect immediately on Electron:
   * callIrisApi intercepts setParameters and refreshes every renderer, so the
   * views that are already rendering switch over without being re-bound.
   */
  applyFillUids = (value: string) => {
    this.engine?.setParameters(JSON.stringify({ [FILL_UIDS_KEY]: value }));
    this.setState({ fillUids: value, appliedFillUids: value });
  };

  /**
   * Step 3-2: push renderMode / mirrorMode to every remote user
   *
   * Used to verify that the private parameter wins over the requested mode and
   * that mirror keeps working on top of fill.
   */
  pushRemoteRenderMode = () => {
    const { remoteUsers, remoteRenderMode, remoteMirrorMode } = this.state;
    Array.from(new Set(remoteUsers)).forEach((remoteUid) => {
      this.engine?.setRemoteRenderMode(
        remoteUid,
        remoteRenderMode,
        remoteMirrorMode
      );
    });
  };

  /**
   * Step 4: read back what every renderer actually wrote to its canvas
   *
   * This is the objective check. A two value `scale(a, b)` is only written by
   * the fill branch of IRenderer.updateRenderMode, the proportional branch
   * writes a single value `scale(x)`. Whether the two values happen to be
   * equal only tells you if the distortion is visible, it does not tell you
   * whether fill is on, so do not judge by the numbers being different.
   */
  readTransform = () => {
    const caches = AgoraEnv.AgoraRendererManager?.getRendererCaches() ?? [];
    if (!caches.length) {
      this.setState({ transformReport: 'no renderer, bind a view first' });
      return;
    }
    const lines = caches.map((cache) => {
      const { uid, sourceType } = cache.cacheContext;
      const renderers = cache.renderers.map((renderer, index) => {
        const transform = renderer.canvas?.style.transform || '(none)';
        const isFill = /scale\([^,]+,[^)]+\)/.test(transform);
        const container = renderer.container
          ? `${renderer.container.clientWidth}x${renderer.container.clientHeight}`
          : '-';
        const canvas = renderer.canvas
          ? `${renderer.canvas.width}x${renderer.canvas.height}`
          : '-';
        return [
          `  renderer[${index}] transform=${transform}`,
          `    ${
            isFill ? 'two value scale -> FILL' : 'single value -> not fill'
          }`,
          `    container=${container} canvas=${canvas}`,
          `    renderMode=${renderer.context.renderMode} mirrorMode=${renderer.context.mirrorMode}`,
        ].join('\n');
      });
      return [
        `cache ${
          cache.key
        } uid=${uid} sourceType=${sourceType} fps=${cache.actualFps.toFixed(
          2
        )}`,
        ...renderers,
      ].join('\n');
    });
    this.setState({ transformReport: lines.join('\n') });
  };

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  /**
   * The local preview is the control group and is deliberately left at a fixed
   * 1:1 shape: the private parameter only matches remote views, so the local
   * tile must never stretch no matter what is set.
   */
  protected renderUsers(): ReactElement | undefined {
    const { startPreview, joinChannelSuccess, remoteUsers } = this.state;
    if (!startPreview && !joinChannelSuccess) {
      return undefined;
    }
    return (
      <>
        <AgoraCard title={'local (control group, never stretches)'}>
          {this.renderFillVideo(
            { sourceType: VideoSourceType.VideoSourceCamera },
            '1:1'
          )}
        </AgoraCard>
        <AgoraList
          data={Array.from(new Set(remoteUsers ?? []))}
          renderItem={(item) => this.renderRemoteUser(item)}
        />
      </>
    );
  }

  protected renderRemoteUser(remoteUid: number): ReactElement {
    const { remoteShape } = this.state;
    return (
      <AgoraCard
        key={`${remoteUid}`}
        title={`remote ${remoteUid} (${remoteShape} container)`}
      >
        {this.renderFillVideo(
          { uid: remoteUid, sourceType: VideoSourceType.VideoSourceRemote },
          remoteShape
        )}
      </AgoraCard>
    );
  }

  protected renderFillVideo(user: VideoCanvas, shape: string): ReactElement {
    return (
      <RtcSurfaceView
        canvas={user}
        containerClass={REMOTE_SHAPES[shape]}
        videoClass={AgoraStyle.fillModeVideo}
      />
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      fillUids,
      appliedFillUids,
      remoteUsers,
      selectedUser,
      remoteRenderMode,
      remoteMirrorMode,
      remoteShape,
    } = this.state;
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ fillUids: text });
          }}
          placeholder={`${FILL_UIDS_KEY}, e.g. * or 11,12`}
          value={fillUids}
        />
        <AgoraText>{`applied: "${appliedFillUids}"`}</AgoraText>
        <AgoraDropdown
          title={'pick a remote uid to append'}
          items={arrayToItems(Array.from(new Set(remoteUsers ?? [])))}
          value={selectedUser}
          onValueChange={(value) => {
            this.setState({ selectedUser: value });
          }}
        />
        <AgoraButton
          disabled={selectedUser === undefined}
          title={'append uid'}
          onPress={() => {
            if (selectedUser === undefined) {
              return;
            }
            const current = fillUids === MATCH_ALL ? '' : fillUids;
            const parts = current
              .split(',')
              .map((it) => it.trim())
              .filter((it) => it.length > 0);
            if (!parts.includes(`${selectedUser}`)) {
              parts.push(`${selectedUser}`);
            }
            this.setState({ fillUids: parts.join(',') });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'remote container shape'}
          items={Object.keys(REMOTE_SHAPES).map((value) => ({
            label: value,
            value: value,
          }))}
          value={remoteShape}
          onValueChange={(value) => {
            this.setState({ remoteShape: value });
          }}
        />
        <AgoraDropdown
          title={'renderMode pushed to remote users'}
          items={enumToItems(RenderModeType)}
          value={remoteRenderMode}
          onValueChange={(value) => {
            this.setState(
              { remoteRenderMode: value },
              this.pushRemoteRenderMode
            );
          }}
        />
        <AgoraDropdown
          title={'mirrorMode pushed to remote users'}
          items={enumToItems(VideoMirrorModeType)}
          value={remoteMirrorMode}
          onValueChange={(value) => {
            this.setState(
              { remoteMirrorMode: value },
              this.pushRemoteRenderMode
            );
          }}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { fillUids, transformReport } = this.state;
    return (
      <>
        <AgoraButton
          title={'apply fill uids'}
          onPress={() => {
            this.applyFillUids(fillUids);
          }}
        />
        <AgoraView>
          <AgoraButton
            title={'enable all (*)'}
            onPress={() => {
              this.applyFillUids(MATCH_ALL);
            }}
          />
          <AgoraButton
            title={'disable ("")'}
            onPress={() => {
              this.applyFillUids('');
            }}
          />
        </AgoraView>
        <AgoraButton
          title={'read actual transform'}
          onPress={this.readTransform}
        />
        {transformReport ? (
          <pre style={reportStyle}>{transformReport}</pre>
        ) : undefined}
      </>
    );
  }
}
