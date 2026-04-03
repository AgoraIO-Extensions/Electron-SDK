import fs from 'fs';

import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IVideoEffectObject,
  MediaSourceType,
  VideoEffectNodeId,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraSlider,
  AgoraSwitch,
  AgoraText,
  AgoraTextInput,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { getResourcePath } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

import {
  CLEAR_VISION_EXTENSION_NAME,
  CLEAR_VISION_EXTENSION_PROVIDER,
  DEFAULT_FACE_SHAPE_OPTIONS,
  DEFAULT_MAKEUP_OPTIONS,
  FACE_SHAPE_AREA_ITEMS,
  FACE_SHAPE_BEAUTY_STYLES,
  FACE_SHAPE_STYLE_ITEMS,
  FaceShapeOptions,
  MAKEUP_ITEMS,
  MakeupOptions,
  VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES,
  VideoEffectOperation,
  buildFaceShapeEffectOperations,
  buildMakeupEffectOperations,
  releaseVideoEffectResources,
  resolveVideoEffectBundlePath,
  toIndexedItems,
} from './videoEffectHelpers';

interface State extends BaseVideoComponentState {
  bundlePath: string;
  bundlePathExists: boolean;
  videoEffectObjectCreated: boolean;
  makeupOptions: MakeupOptions;
  faceShapeOptions: FaceShapeOptions;
}

export default class VideoEffect
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected videoEffectObject?: IVideoEffectObject;

  protected createState(): State {
    const bundlePath = resolveVideoEffectBundlePath(
      getResourcePath,
      fs.existsSync
    );
    return {
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      startPreview: false,
      bundlePath,
      bundlePathExists: fs.existsSync(bundlePath),
      videoEffectObjectCreated: false,
      makeupOptions: { ...DEFAULT_MAKEUP_OPTIONS },
      faceShapeOptions: { ...DEFAULT_FACE_SHAPE_OPTIONS },
    };
  }

  protected async initRtcEngine() {
    const { appId } = this.state;
    if (!appId) {
      this.error('appId is invalid');
      return;
    }

    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    await askMediaAccess(['microphone', 'camera']);

    this.engine.enableExtension(
      CLEAR_VISION_EXTENSION_PROVIDER,
      CLEAR_VISION_EXTENSION_NAME,
      true,
      MediaSourceType.PrimaryCameraSource
    );
    this.engine.setParameters(
      JSON.stringify({ 'rtc.video.yuvconverter_enable_hardware_buffer': true })
    );
    this.engine.enableVideo();
    this.engine.startPreview();

    this.setState({ startPreview: true }, () => {
      this.ensureVideoEffectObject(false);
    });
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
    this.engine?.leaveChannel();
  }

  protected releaseRtcEngine() {
    this.cleanupVideoEffectResources();
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  private cleanupVideoEffectResources = () => {
    releaseVideoEffectResources(this.engine, this.videoEffectObject);
    this.videoEffectObject = undefined;
  };

  private ensureVideoEffectObject = (showError = true) => {
    if (this.videoEffectObject) {
      return true;
    }

    const { bundlePath } = this.state;
    if (!bundlePath) {
      if (showError) {
        this.error('bundlePath is invalid');
      }
      return false;
    }

    const videoEffectObject = this.engine?.createVideoEffectObject(
      bundlePath,
      MediaSourceType.PrimaryCameraSource
    );

    if (!videoEffectObject) {
      if (showError) {
        this.error('createVideoEffectObject failed', 'bundlePath', bundlePath);
      }
      return false;
    }

    this.videoEffectObject = videoEffectObject;
    this.setState({ videoEffectObjectCreated: true });
    return true;
  };

  private reloadVideoEffectObject = () => {
    if (this.videoEffectObject && this.engine) {
      this.engine.destroyVideoEffectObject(this.videoEffectObject);
      this.videoEffectObject = undefined;
    }

    this.setState({ videoEffectObjectCreated: false }, () => {
      if (!this.ensureVideoEffectObject()) {
        return;
      }
      this.applyAllVideoEffects();
    });
  };

  private removeVideoEffect = (nodeId: VideoEffectNodeId) => {
    if (!this.videoEffectObject) {
      return;
    }
    this.videoEffectObject.removeVideoEffect(nodeId);
  };

  private applyVideoEffectOperations = (
    nodeId: VideoEffectNodeId,
    operations: VideoEffectOperation[]
  ) => {
    if (!this.ensureVideoEffectObject()) {
      return;
    }

    if (!operations.length) {
      this.removeVideoEffect(nodeId);
      return;
    }

    const result = this.videoEffectObject?.addOrUpdateVideoEffect(nodeId, '');
    if (result !== 0) {
      this.error('addOrUpdateVideoEffect failed', 'result', result);
      return;
    }

    operations.forEach(({ kind, option, key, value }) => {
      switch (kind) {
        case 'bool':
          this.videoEffectObject?.setVideoEffectBoolParam(
            option,
            key,
            value as boolean
          );
          break;
        case 'int':
          this.videoEffectObject?.setVideoEffectIntParam(
            option,
            key,
            value as number
          );
          break;
        case 'float':
          this.videoEffectObject?.setVideoEffectFloatParam(
            option,
            key,
            value as number
          );
          break;
      }
    });
  };

  private applyMakeupEffect = () => {
    this.applyVideoEffectOperations(
      VideoEffectNodeId.StyleMakeup,
      buildMakeupEffectOperations(this.state.makeupOptions)
    );
  };

  private applyFaceShapeEffect = () => {
    this.applyVideoEffectOperations(
      VideoEffectNodeId.Beauty,
      buildFaceShapeEffectOperations(this.state.faceShapeOptions)
    );
  };

  private applyAllVideoEffects = () => {
    this.applyMakeupEffect();
    this.applyFaceShapeEffect();
  };

  private updateMakeupOptions = (patch: Partial<MakeupOptions>) => {
    this.setState(
      (prevState) => ({
        makeupOptions: {
          ...prevState.makeupOptions,
          ...patch,
        },
      }),
      this.applyMakeupEffect
    );
  };

  private updateFaceShapeOptions = (patch: Partial<FaceShapeOptions>) => {
    this.setState(
      (prevState) => ({
        faceShapeOptions: {
          ...prevState.faceShapeOptions,
          ...patch,
        },
      }),
      this.applyFaceShapeEffect
    );
  };

  private resetMakeup = () => {
    this.setState(
      {
        makeupOptions: { ...DEFAULT_MAKEUP_OPTIONS },
      },
      this.applyMakeupEffect
    );
  };

  private resetFaceShape = () => {
    this.setState(
      {
        faceShapeOptions: { ...DEFAULT_FACE_SHAPE_OPTIONS },
      },
      this.applyFaceShapeEffect
    );
  };

  private renderStrengthSlider(
    title: string,
    value: number,
    onSlidingComplete: (value: number) => void
  ) {
    return (
      <>
        <AgoraSlider
          title={`${title} ${value.toFixed(2)}`}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={value}
          onSlidingComplete={onSlidingComplete}
        />
        <AgoraDivider />
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      bundlePath,
      bundlePathExists,
      videoEffectObjectCreated,
      makeupOptions,
      faceShapeOptions,
    } = this.state;

    return (
      <>
        <AgoraText>{`videoEffectObject: ${
          videoEffectObjectCreated ? 'ready' : 'not ready'
        }`}</AgoraText>
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({
              bundlePath: text,
              bundlePathExists: fs.existsSync(text),
            });
          }}
          placeholder={'video effect bundle path'}
          value={bundlePath}
        />
        <AgoraText>
          {`bundle path status: ${bundlePathExists ? 'present' : 'missing'}`}
        </AgoraText>
        <AgoraText>
          {`auto-detect candidates: ${VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES.join(
            ', '
          )}`}
        </AgoraText>
        <AgoraText>
          Default path follows the Windows sample layout and falls back to the
          encrypted bundle if needed. If your bundle is packaged elsewhere,
          update this path before enabling the effect.
        </AgoraText>
        <AgoraButton
          disabled={!bundlePathExists}
          title={'reload VideoEffectObject'}
          onPress={this.reloadVideoEffectObject}
        />
        <AgoraDivider>Style Makeup</AgoraDivider>
        <AgoraSwitch
          title={'enable makeup'}
          value={makeupOptions.enable_mu}
          onValueChange={(value) => {
            this.updateMakeupOptions({ enable_mu: value });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'browStyle'}
          items={toIndexedItems(MAKEUP_ITEMS.browStyle)}
          value={makeupOptions.browStyle}
          onValueChange={(value) => {
            this.updateMakeupOptions({ browStyle: value });
          }}
        />
        <AgoraDropdown
          title={'browColor'}
          items={toIndexedItems(MAKEUP_ITEMS.browColor)}
          value={makeupOptions.browColor}
          onValueChange={(value) => {
            this.updateMakeupOptions({ browColor: value });
          }}
        />
        {this.renderStrengthSlider(
          'browStrength',
          makeupOptions.browStrength,
          (value) => {
            this.updateMakeupOptions({ browStrength: value });
          }
        )}
        <AgoraDropdown
          title={'lashStyle'}
          items={toIndexedItems(MAKEUP_ITEMS.lashStyle)}
          value={makeupOptions.lashStyle}
          onValueChange={(value) => {
            this.updateMakeupOptions({ lashStyle: value });
          }}
        />
        <AgoraDropdown
          title={'lashColor'}
          items={toIndexedItems(MAKEUP_ITEMS.lashColor)}
          value={makeupOptions.lashColor}
          onValueChange={(value) => {
            this.updateMakeupOptions({ lashColor: value });
          }}
        />
        {this.renderStrengthSlider(
          'lashStrength',
          makeupOptions.lashStrength,
          (value) => {
            this.updateMakeupOptions({ lashStrength: value });
          }
        )}
        <AgoraDropdown
          title={'shadowStyle'}
          items={toIndexedItems(MAKEUP_ITEMS.shadowStyle)}
          value={makeupOptions.shadowStyle}
          onValueChange={(value) => {
            this.updateMakeupOptions({ shadowStyle: value });
          }}
        />
        {this.renderStrengthSlider(
          'shadowStrength',
          makeupOptions.shadowStrength,
          (value) => {
            this.updateMakeupOptions({ shadowStrength: value });
          }
        )}
        <AgoraDropdown
          title={'pupilStyle'}
          items={toIndexedItems(MAKEUP_ITEMS.pupilStyle)}
          value={makeupOptions.pupilStyle}
          onValueChange={(value) => {
            this.updateMakeupOptions({ pupilStyle: value });
          }}
        />
        {this.renderStrengthSlider(
          'pupilStrength',
          makeupOptions.pupilStrength,
          (value) => {
            this.updateMakeupOptions({ pupilStrength: value });
          }
        )}
        <AgoraDropdown
          title={'blushStyle'}
          items={toIndexedItems(MAKEUP_ITEMS.blushStyle)}
          value={makeupOptions.blushStyle}
          onValueChange={(value) => {
            this.updateMakeupOptions({ blushStyle: value });
          }}
        />
        <AgoraDropdown
          title={'blushColor'}
          items={toIndexedItems(MAKEUP_ITEMS.blushColor)}
          value={makeupOptions.blushColor}
          onValueChange={(value) => {
            this.updateMakeupOptions({ blushColor: value });
          }}
        />
        {this.renderStrengthSlider(
          'blushStrength',
          makeupOptions.blushStrength,
          (value) => {
            this.updateMakeupOptions({ blushStrength: value });
          }
        )}
        <AgoraDropdown
          title={'lipStyle'}
          items={toIndexedItems(MAKEUP_ITEMS.lipStyle)}
          value={makeupOptions.lipStyle}
          onValueChange={(value) => {
            this.updateMakeupOptions({ lipStyle: value });
          }}
        />
        <AgoraDropdown
          title={'lipColor'}
          items={toIndexedItems(MAKEUP_ITEMS.lipColor)}
          value={makeupOptions.lipColor}
          onValueChange={(value) => {
            this.updateMakeupOptions({ lipColor: value });
          }}
        />
        {this.renderStrengthSlider(
          'lipStrength',
          makeupOptions.lipStrength,
          (value) => {
            this.updateMakeupOptions({ lipStrength: value });
          }
        )}
        <AgoraDivider>Face Shape</AgoraDivider>
        <AgoraText>
          The upstream Windows sample hides these controls, but the same
          VideoEffectObject parameters are still available here for debugging.
        </AgoraText>
        <AgoraDropdown
          title={'shapeArea'}
          items={FACE_SHAPE_AREA_ITEMS}
          value={faceShapeOptions.shapeArea}
          onValueChange={(value) => {
            this.updateFaceShapeOptions({ shapeArea: value });
          }}
        />
        <AgoraSlider
          title={`shapeAreaIntensity ${faceShapeOptions.shapeIntensity}`}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={faceShapeOptions.shapeIntensity}
          onSlidingComplete={(value) => {
            this.updateFaceShapeOptions({ shapeIntensity: value });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'shapeStyle'}
          items={FACE_SHAPE_STYLE_ITEMS}
          value={faceShapeOptions.shapeStyle}
          onValueChange={(value) => {
            this.updateFaceShapeOptions({ shapeStyle: value });
          }}
        />
        <AgoraSlider
          title={`shapeStyleIntensity ${faceShapeOptions.styleIntensity}`}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={faceShapeOptions.styleIntensity}
          onSlidingComplete={(value) => {
            this.updateFaceShapeOptions({ styleIntensity: value });
          }}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const {
      bundlePathExists,
      videoEffectObjectCreated,
      makeupOptions,
      faceShapeOptions,
    } = this.state;
    const faceShapeStyleEnabled =
      faceShapeOptions.shapeStyle !==
      FACE_SHAPE_BEAUTY_STYLES.FaceShapeBeautyStyleFemale;

    return (
      <>
        <AgoraText>{`makeup enabled: ${makeupOptions.enable_mu}`}</AgoraText>
        <AgoraText>{`face shape area: ${faceShapeOptions.shapeArea}`}</AgoraText>
        <AgoraText>{`face shape style active: ${faceShapeStyleEnabled}`}</AgoraText>
        <AgoraButton
          disabled={!videoEffectObjectCreated || !bundlePathExists}
          title={'apply all video effects'}
          onPress={this.applyAllVideoEffects}
        />
        <AgoraButton title={'reset makeup'} onPress={this.resetMakeup} />
        <AgoraButton title={'reset face shape'} onPress={this.resetFaceShape} />
      </>
    );
  }
}
