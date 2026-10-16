import {
  AgoraEnv,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  RenderModeType,
  RtcConnection,
  RtcStats,
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
      // Fit rather than the SDK default of Hidden, and it really is applied
      // because the canvas carries it. Hidden already fills the view by
      // cropping, so starting there would make fill look like it changed
      // nothing; Fit letterboxes, which makes the effect obvious.
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
   * Step 3-2: push the selected renderMode / mirrorMode through the public API
   *
   * This is how both dropdowns take effect. `setRemoteRenderMode` resolves the
   * renderer cache by key and calls setContext on the renderers it already
   * holds, so updateRenderMode / updateMirrorMode only rewrite the canvas
   * transform. Nothing is unbound and no canvas is recreated, so the picture
   * does not blank. Re-binding the view would, because tearing the last
   * renderer out of a cache stops and releases it and the rebuilt canvas stays
   * hidden until the next frame arrives, which at the default 15 fps render
   * loop is a visible black flash.
   *
   * It is also the call an integrator actually uses on a view that is already
   * rendering, and the path the private parameter has to win over, so keeping
   * it behind an explicit button lets the API be exercised on its own.
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
   * Step 3-3: read back what every renderer actually wrote to its canvas
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
   * Step 4: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  /**
   * Reset only what belonged to the call, and deliberately do not call super.
   *
   * The base class reacts to leaving by replacing the whole state with
   * `createState()`, which throws away everything that was typed or picked:
   * the channel name goes back to the one from the config, and so do the
   * parameter input, the render mode, the mirror mode and the container shape.
   * Leaving a channel is the one thing you do between two attempts, so wiping
   * the setup makes every repeat test start over.
   *
   * Two of those resets would also report something untrue. `applied` would
   * read as empty while the parameter is still set, because it lives on the
   * engine and the Electron side keeps it in a module level variable that
   * leaving does not clear. And `startPreview` would read as false while the
   * preview is still running, because nothing ever stopped it.
   */
  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    this.setState({ joinChannelSuccess: false, remoteUsers: [] });
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
          {/* The local tile keeps the SDK defaults: it is the control group and
              the dropdowns only target remote views, same as the parameter. */}
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
    const { remoteShape, remoteRenderMode, remoteMirrorMode } = this.state;
    return (
      <AgoraCard
        key={`${remoteUid}`}
        title={`remote ${remoteUid} (${remoteShape} container)`}
      >
        {this.renderFillVideo(
          {
            uid: remoteUid,
            sourceType: VideoSourceType.VideoSourceRemote,
            renderMode: remoteRenderMode,
            mirrorMode: remoteMirrorMode,
          },
          remoteShape
        )}
      </AgoraCard>
    );
  }

  protected renderFillVideo(user: VideoCanvas, shape: string): ReactElement {
    // The fixed size lives on a wrapper this component owns, and RtcSurfaceView
    // is handed classes that just fill their parent, because
    // RtcSurfaceView.shouldComponentUpdate only diffs canvas/connection/state:
    // a bare containerClass change is ignored and the tile would never resize.
    // Resizing the wrapper instead lets the size be inherited down to the
    // renderer's own container, and updateRenderMode already runs every frame
    // off container.clientWidth/clientHeight, so the next frame recomputes the
    // transform with no rebind at all.
    //
    // The canvas carries renderMode and mirrorMode so that every bind applies
    // the values the UI is showing. Without them presetRendererContext fills in
    // defaultRenderMode, which RendererManager hardcodes to Hidden, so a remote
    // user who joins after the dropdown was changed would come up on Hidden
    // while the dropdown claims otherwise. It also keeps renderMode alive
    // across RtcSurfaceView's own click-to-mirror toggle, whose updateRenderer
    // re-sends the canvas and would otherwise fall back to Hidden.
    //
    // `key` is uid only. Keying on renderMode / mirrorMode as well would turn
    // every dropdown change into an unmount plus mount, and that rebind is what
    // makes the picture blank; the dropdowns go through setRemoteRenderMode
    // instead, which updates the live renderer in place.
    return (
      <div className={REMOTE_SHAPES[shape]}>
        <RtcSurfaceView
          key={`${user.uid ?? 'local'}`}
          canvas={user}
          containerClass={AgoraStyle.fillModeVideo}
          videoClass={AgoraStyle.fillModeVideo}
        />
      </div>
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
        {/* Both dropdowns push through setRemoteRenderMode in the setState
            callback. React commits a child's componentDidUpdate before the
            parent's setState callback, so the push lands after
            RtcSurfaceView.updateRenderer has re-sent the canvas and therefore
            wins over the inverted mirrorMode that updateRenderer substitutes. */}
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
          title={'push renderMode/mirror via setRemoteRenderMode'}
          onPress={this.pushRemoteRenderMode}
        />
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
