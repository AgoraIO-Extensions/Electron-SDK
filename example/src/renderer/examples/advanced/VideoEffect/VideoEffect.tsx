import fs from 'fs';

import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IVideoEffectObject,
  MediaSourceType,
  VideoEffectAction,
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
  AgoraText,
  AgoraTextInput,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { getResourcePath } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

import {
  BEAUTY_TEMPLATES,
  CLEAR_VISION_EXTENSION_NAME,
  CLEAR_VISION_EXTENSION_PROVIDER,
  CUSTOM_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH,
  DEFAULT_SDK_DRIVEN_BEAUTY_OPTIONS,
  FILTER_TEMPLATES,
  STYLE_MAKEUP_TEMPLATES,
  SdkDrivenBeautyOptions,
  VideoEffectOperation,
  buildSdkDrivenBeautyOperations,
  buildStyleEffectOperations,
  releaseVideoEffectResources,
} from './videoEffectHelpers';

type BeautyTemplateKey = keyof typeof BEAUTY_TEMPLATES;
type StyleMakeupTemplateKey = keyof typeof STYLE_MAKEUP_TEMPLATES;
type FilterTemplateKey = keyof typeof FILTER_TEMPLATES;

interface State extends BaseVideoComponentState {
  beautyEnabled: boolean;
  beautyTemplate: BeautyTemplateKey;
  bundlePath: string;
  bundlePathExists: boolean;
  filter: FilterTemplateKey;
  filterStrength: number;
  makeupIntensity: number;
  sdkBeautyOptions: SdkDrivenBeautyOptions;
  styleMakeup: StyleMakeupTemplateKey;
  videoEffectObjectCreated: boolean;
}

const FACE_STYLE_ITEMS = [
  { label: 'None (-1)', value: -1 },
  { label: 'Goddess (0)', value: 0 },
  { label: 'Male (1)', value: 1 },
  { label: 'Natural (2)', value: 2 },
];

const BEAUTY_TEMPLATE_ITEMS = Object.entries(BEAUTY_TEMPLATES).map(
  ([value, template]) => ({
    label: template.label,
    value,
  })
);

const STYLE_MAKEUP_ITEMS = Object.entries(STYLE_MAKEUP_TEMPLATES).map(
  ([value, template]) => ({
    label: template.label,
    value,
  })
);

const FILTER_ITEMS = Object.entries(FILTER_TEMPLATES).map(
  ([value, template]) => ({
    label: template.label,
    value,
  })
);

export default class VideoEffect
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected videoEffectObject?: IVideoEffectObject;

  private syncBeautyUITimer?: ReturnType<typeof setTimeout>;

  protected createState(): State {
    const bundlePath = getResourcePath(
      CUSTOM_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH
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
      beautyEnabled: false,
      beautyTemplate: 'basic',
      bundlePath,
      bundlePathExists: fs.existsSync(bundlePath),
      filter: 'none',
      filterStrength: 0.5,
      makeupIntensity: 1,
      sdkBeautyOptions: { ...DEFAULT_SDK_DRIVEN_BEAUTY_OPTIONS },
      styleMakeup: 'none',
      videoEffectObjectCreated: false,
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

    this.setState({ startPreview: true });
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
    if (this.syncBeautyUITimer) {
      clearTimeout(this.syncBeautyUITimer);
    }
    releaseVideoEffectResources(this.engine, this.videoEffectObject);
    this.videoEffectObject = undefined;
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  private applyVideoEffectOperations = (
    nodeId: VideoEffectNodeId,
    operations: VideoEffectOperation[]
  ) => {
    if (!this.videoEffectObject) {
      return;
    }

    const result = this.videoEffectObject.addOrUpdateVideoEffect(nodeId, '');
    if (result !== 0) {
      this.error(
        'addOrUpdateVideoEffect failed',
        'nodeId',
        nodeId,
        'result',
        result
      );
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

  private syncBeautyUI = () => {
    if (!this.videoEffectObject) {
      return;
    }

    this.setState({
      sdkBeautyOptions: {
        ...this.state.sdkBeautyOptions,
        smoothness: this.videoEffectObject.getVideoEffectFloatParam(
          'beauty_effect_option',
          'smoothness'
        ),
        lightness: this.videoEffectObject.getVideoEffectFloatParam(
          'beauty_effect_option',
          'lightness'
        ),
        redness: this.videoEffectObject.getVideoEffectFloatParam(
          'beauty_effect_option',
          'redness'
        ),
        eyePouch: this.videoEffectObject.getVideoEffectFloatParam(
          'face_buffing_option',
          'eye_pouch'
        ),
      },
    });
  };

  private scheduleSyncBeautyUI = () => {
    if (this.syncBeautyUITimer) {
      clearTimeout(this.syncBeautyUITimer);
    }
    this.syncBeautyUITimer = setTimeout(this.syncBeautyUI, 500);
  };

  private createVideoEffectObject = () => {
    if (this.videoEffectObject) {
      return;
    }

    const { bundlePath, bundlePathExists } = this.state;
    if (!bundlePathExists) {
      this.error('bundlePath does not exist', 'bundlePath', bundlePath);
      return;
    }

    const videoEffectObject = this.engine?.createVideoEffectObject(
      bundlePath,
      MediaSourceType.PrimaryCameraSource
    );

    if (!videoEffectObject) {
      this.error('createVideoEffectObject failed', 'bundlePath', bundlePath);
      return;
    }

    this.videoEffectObject = videoEffectObject;
    this.setState({ videoEffectObjectCreated: true }, this.applyBeauty);
  };

  private destroyVideoEffectObject = () => {
    releaseVideoEffectResources(this.engine, this.videoEffectObject);
    this.videoEffectObject = undefined;
    this.setState({
      beautyEnabled: false,
      filter: 'none',
      styleMakeup: 'none',
      videoEffectObjectCreated: false,
    });
  };

  private applyBeauty = async () => {
    if (!this.videoEffectObject) {
      return;
    }

    const template = BEAUTY_TEMPLATES[this.state.beautyTemplate];
    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.Beauty,
      template.templateName
    );
    if (result !== 0) {
      this.error('applyBeauty failed', 'result', result);
      return;
    }

    this.applyVideoEffectOperations(
      VideoEffectNodeId.Beauty,
      buildSdkDrivenBeautyOperations(this.state.sdkBeautyOptions)
    );
    this.scheduleSyncBeautyUI();
    this.setState({ beautyEnabled: true });
  };

  private removeBeauty = () => {
    if (!this.videoEffectObject) {
      return;
    }
    this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.Beauty);
    this.setState({ beautyEnabled: false });
  };

  private saveConfig = () => {
    this.videoEffectObject?.performVideoEffectAction(
      VideoEffectNodeId.Beauty,
      VideoEffectAction.Save
    );
  };

  private resetConfig = () => {
    this.videoEffectObject?.performVideoEffectAction(
      VideoEffectNodeId.Beauty,
      VideoEffectAction.Reset
    );
    this.scheduleSyncBeautyUI();
  };

  private applyStyleMakeup = (styleMakeup: StyleMakeupTemplateKey) => {
    if (!this.videoEffectObject) {
      return;
    }

    const template = STYLE_MAKEUP_TEMPLATES[styleMakeup];
    if (!template.templateName) {
      this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.StyleMakeup);
      this.setState({ styleMakeup });
      return;
    }

    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.StyleMakeup,
      template.templateName
    );
    if (result !== 0) {
      this.error('applyStyleMakeup failed', 'result', result);
      return;
    }

    buildStyleEffectOperations(
      'style_effect_option',
      this.state.makeupIntensity
    ).forEach(({ option, key, value }) => {
      this.videoEffectObject?.setVideoEffectFloatParam(
        option,
        key,
        value as number
      );
    });

    this.setState({
      filter: 'none',
      styleMakeup,
    });
  };

  private applyFilter = (filter: FilterTemplateKey) => {
    if (!this.videoEffectObject) {
      return;
    }

    const template = FILTER_TEMPLATES[filter];
    if (!template.templateName) {
      this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.Filter);
      this.setState({ filter });
      return;
    }

    if (this.state.styleMakeup !== 'none') {
      this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.StyleMakeup);
    }

    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.Filter,
      template.templateName
    );
    if (result !== 0) {
      this.error('applyFilter failed', 'result', result);
      return;
    }

    buildStyleEffectOperations(
      'filter_effect_option',
      this.state.filterStrength
    ).forEach(({ option, key, value }) => {
      this.videoEffectObject?.setVideoEffectFloatParam(
        option,
        key,
        value as number
      );
    });

    this.setState({
      filter,
      styleMakeup: 'none',
    });
  };

  private updateSdkBeautyOptions = (
    patch: Partial<SdkDrivenBeautyOptions>,
    option: string,
    key: string,
    value: number,
    kind: 'float' | 'int' = 'float'
  ) => {
    this.setState(
      (prevState) => ({
        sdkBeautyOptions: {
          ...prevState.sdkBeautyOptions,
          ...patch,
        },
      }),
      async () => {
        if (!this.videoEffectObject) {
          return;
        }
        if (!this.state.beautyEnabled) {
          await this.applyBeauty();
        }
        if (kind === 'int') {
          this.videoEffectObject?.setVideoEffectIntParam(option, key, value);
        } else {
          this.videoEffectObject?.setVideoEffectFloatParam(option, key, value);
        }
      }
    );
  };

  private renderUnitSlider(
    title: string,
    value: number,
    onSlidingComplete: (value: number) => void,
    min = 0,
    max = 1,
    step = 0.05
  ) {
    return (
      <>
        <AgoraSlider
          title={`${title} ${value.toFixed(2)}`}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onSlidingComplete={onSlidingComplete}
        />
        <AgoraDivider />
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      beautyEnabled,
      beautyTemplate,
      bundlePath,
      bundlePathExists,
      filter,
      filterStrength,
      makeupIntensity,
      sdkBeautyOptions,
      styleMakeup,
      videoEffectObjectCreated,
    } = this.state;

    return (
      <>
        <AgoraText>{`videoEffectObject: ${
          videoEffectObjectCreated ? 'ready' : 'not ready'
        }`}</AgoraText>
        <AgoraTextInput
          editable={!videoEffectObjectCreated}
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
          {`configured bundle: ${CUSTOM_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH}`}
        </AgoraText>
        <AgoraText>
          The available templates now follow the AgoraBeautyMaterial bundle
          committed inside project `extraResources`.
        </AgoraText>
        <AgoraButton
          disabled={videoEffectObjectCreated || !bundlePathExists}
          title={'Create Effect Object'}
          onPress={this.createVideoEffectObject}
        />
        <AgoraButton
          disabled={!videoEffectObjectCreated}
          title={'Destroy Effect Object'}
          onPress={this.destroyVideoEffectObject}
        />
        {videoEffectObjectCreated ? (
          <>
            <AgoraDivider>Beauty</AgoraDivider>
            <AgoraDropdown
              title={'Beauty Template'}
              items={BEAUTY_TEMPLATE_ITEMS}
              value={beautyTemplate}
              onValueChange={(value) => {
                this.setState(
                  { beautyTemplate: value as BeautyTemplateKey },
                  this.applyBeauty
                );
              }}
            />
            {this.renderUnitSlider(
              'smoothness',
              sdkBeautyOptions.smoothness,
              (value) => {
                this.updateSdkBeautyOptions(
                  { smoothness: value },
                  'beauty_effect_option',
                  'smoothness',
                  value
                );
              }
            )}
            {this.renderUnitSlider(
              'lightness',
              sdkBeautyOptions.lightness,
              (value) => {
                this.updateSdkBeautyOptions(
                  { lightness: value },
                  'beauty_effect_option',
                  'lightness',
                  value
                );
              }
            )}
            {this.renderUnitSlider(
              'redness',
              sdkBeautyOptions.redness,
              (value) => {
                this.updateSdkBeautyOptions(
                  { redness: value },
                  'beauty_effect_option',
                  'redness',
                  value
                );
              }
            )}
            {this.renderUnitSlider(
              'eye_pouch',
              sdkBeautyOptions.eyePouch,
              (value) => {
                this.updateSdkBeautyOptions(
                  { eyePouch: value },
                  'face_buffing_option',
                  'eye_pouch',
                  value
                );
              }
            )}
            <AgoraDropdown
              title={'Face Style'}
              items={FACE_STYLE_ITEMS}
              value={sdkBeautyOptions.faceStyle}
              onValueChange={(value) => {
                this.updateSdkBeautyOptions(
                  { faceStyle: value },
                  'face_shape_beauty_option',
                  'style',
                  value,
                  'int'
                );
              }}
            />
            <AgoraSlider
              title={`faceIntensity ${sdkBeautyOptions.faceIntensity}`}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={sdkBeautyOptions.faceIntensity}
              onSlidingComplete={(value) => {
                this.updateSdkBeautyOptions(
                  { faceIntensity: value },
                  'face_shape_beauty_option',
                  'intensity',
                  value,
                  'int'
                );
              }}
            />
            <AgoraDivider />
            <AgoraButton
              title={beautyEnabled ? 'Remove Beauty' : 'Apply Beauty'}
              onPress={beautyEnabled ? this.removeBeauty : this.applyBeauty}
            />
            {beautyEnabled ? (
              <>
                <AgoraButton title={'Save Config'} onPress={this.saveConfig} />
                <AgoraButton
                  title={'Reset Config'}
                  onPress={this.resetConfig}
                />
              </>
            ) : null}

            <AgoraDivider>Style Makeup</AgoraDivider>
            <AgoraText>
              Style makeup and filters are mutually exclusive. Applying filter
              removes style makeup first.
            </AgoraText>
            <AgoraDropdown
              title={'Style Makeup Template'}
              items={STYLE_MAKEUP_ITEMS}
              value={styleMakeup}
              onValueChange={(value) => {
                this.applyStyleMakeup(value as StyleMakeupTemplateKey);
              }}
            />
            {styleMakeup !== 'none'
              ? this.renderUnitSlider(
                  'styleIntensity',
                  makeupIntensity,
                  (value) => {
                    this.setState({ makeupIntensity: value });
                    this.videoEffectObject?.setVideoEffectFloatParam(
                      'style_effect_option',
                      'styleIntensity',
                      value
                    );
                  }
                )
              : null}

            <AgoraDivider>Filter</AgoraDivider>
            <AgoraDropdown
              title={'Filter Template'}
              items={FILTER_ITEMS}
              value={filter}
              onValueChange={(value) => {
                this.applyFilter(value as FilterTemplateKey);
              }}
            />
            {filter !== 'none'
              ? this.renderUnitSlider('strength', filterStrength, (value) => {
                  this.setState({ filterStrength: value });
                  this.videoEffectObject?.setVideoEffectFloatParam(
                    'filter_effect_option',
                    'strength',
                    value
                  );
                })
              : null}
          </>
        ) : null}
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { beautyEnabled, filter, styleMakeup, videoEffectObjectCreated } =
      this.state;
    return (
      <>
        <AgoraText>{`beauty enabled: ${beautyEnabled}`}</AgoraText>
        <AgoraText>{`style makeup: ${styleMakeup}`}</AgoraText>
        <AgoraText>{`filter: ${filter}`}</AgoraText>
        <AgoraButton
          disabled={!videoEffectObjectCreated}
          title={'Sync Beauty UI From SDK'}
          onPress={this.syncBeautyUI}
        />
      </>
    );
  }
}
