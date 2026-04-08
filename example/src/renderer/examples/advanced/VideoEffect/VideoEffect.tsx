import fs from 'fs';

import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IVideoEffectObject,
  MediaSourceType,
  RtcConnection,
  RtcStats,
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
  BundleTemplateOption,
  CUSTOM_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH,
  DEFAULT_SDK_DRIVEN_BEAUTY_OPTIONS,
  SdkDrivenBeautyOptions,
  buildBundleCacheSyncTargets,
  buildStyleEffectOperations,
  classifyBundleTemplates,
  destroyVideoEffectObjectResource,
  enableVideoEffectExtension,
  extractSdkDrivenBeautyOptionsFromConfig,
  parseBundleUiOptions,
  releaseVideoEffectResources,
} from './VideoEffectHelpers';

interface State extends BaseVideoComponentState {
  beautyEnabled: boolean;
  beautyTemplate: string;
  beautyTemplateRelativePath: string;
  beautyTemplates: BundleTemplateOption[];
  bundlePath: string;
  bundlePathExists: boolean;
  filter: string;
  filterRelativePath: string;
  filterTemplates: BundleTemplateOption[];
  filterStrength: number;
  makeupIntensity: number;
  sdkBeautyOptions: SdkDrivenBeautyOptions;
  sticker: string;
  stickerRelativePath: string;
  stickerTemplates: BundleTemplateOption[];
  styleMakeup: string;
  styleMakeupRelativePath: string;
  styleMakeupTemplates: BundleTemplateOption[];
  videoEffectObjectCreated: boolean;
}

const FACE_STYLE_ITEMS = [
  { label: 'None (-1)', value: -1 },
  { label: 'Goddess (0)', value: 0 },
  { label: 'Male (1)', value: 1 },
  { label: 'Natural (2)', value: 2 },
];

export default class VideoEffect
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected videoEffectObject?: IVideoEffectObject;

  private pendingParamTimers = new Map<string, ReturnType<typeof setTimeout>>();

  private syncBeautyUITimer?: ReturnType<typeof setTimeout>;

  private loadBeautyOptionsFromTemplate(
    bundlePath: string,
    relativePath: string
  ): SdkDrivenBeautyOptions {
    const normalizedRelativePath = relativePath.replace(/\/$/, '');
    const templatePath = `${bundlePath}/${normalizedRelativePath}`;
    const candidates = [
      `${templatePath}/saved.cache`,
      `${templatePath}/saved.json`,
      `${templatePath}/config.json`,
    ];

    for (const filePath of candidates) {
      if (!fs.existsSync(filePath)) {
        continue;
      }
      try {
        return extractSdkDrivenBeautyOptionsFromConfig(
          JSON.parse(fs.readFileSync(filePath, 'utf8'))
        );
      } catch (error) {
        this.error(
          'loadBeautyOptionsFromTemplate failed',
          'filePath',
          filePath,
          'error',
          error
        );
      }
    }

    return { ...DEFAULT_SDK_DRIVEN_BEAUTY_OPTIONS };
  }

  protected createState(): State {
    const bundlePath = getResourcePath(
      CUSTOM_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH
    );
    const bundleConfig = JSON.parse(
      fs.readFileSync(`${bundlePath}/config.json`, 'utf8')
    );
    const templateGroups = classifyBundleTemplates(
      parseBundleUiOptions(bundleConfig)
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
      beautyTemplate: templateGroups.beauty.at(0)?.templateName ?? '',
      beautyTemplateRelativePath:
        templateGroups.beauty.at(0)?.relativePath ?? '',
      beautyTemplates: templateGroups.beauty,
      bundlePath,
      bundlePathExists: fs.existsSync(bundlePath),
      filter: '',
      filterRelativePath: '',
      filterTemplates: templateGroups.filter,
      filterStrength: 0.5,
      makeupIntensity: 1,
      sdkBeautyOptions: this.loadBeautyOptionsFromTemplate(
        bundlePath,
        templateGroups.beauty.at(0)?.relativePath ?? ''
      ),
      sticker: '',
      stickerRelativePath: '',
      stickerTemplates: templateGroups.sticker,
      styleMakeup: '',
      styleMakeupRelativePath: '',
      styleMakeupTemplates: templateGroups.styleMakeup,
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

    enableVideoEffectExtension(this.engine);
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
    this.cleanupVideoEffectObject();
    this.engine?.leaveChannel();
  }

  protected releaseRtcEngine() {
    this.clearVideoEffectTimers();
    releaseVideoEffectResources(this.engine, this.videoEffectObject);
    this.videoEffectObject = undefined;
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.cleanupVideoEffectObject();
    super.onLeaveChannel(connection, stats);
  }

  private clearVideoEffectTimers = () => {
    if (this.syncBeautyUITimer) {
      clearTimeout(this.syncBeautyUITimer);
      this.syncBeautyUITimer = undefined;
    }
    this.pendingParamTimers.forEach((timer) => clearTimeout(timer));
    this.pendingParamTimers.clear();
  };

  private cleanupVideoEffectObject = () => {
    this.clearVideoEffectTimers();
    destroyVideoEffectObjectResource(this.engine, this.videoEffectObject);
    this.videoEffectObject = undefined;
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
        faceStyle: this.videoEffectObject.getVideoEffectIntParam(
          'face_shape_beauty_option',
          'style'
        ),
        faceIntensity: this.videoEffectObject.getVideoEffectIntParam(
          'face_shape_beauty_option',
          'intensity'
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
    if (this.videoEffectObject && this.state.videoEffectObjectCreated) {
      return;
    }
    if (this.videoEffectObject) {
      this.warn('stale videoEffectObject detected, destroying before recreate');
      this.cleanupVideoEffectObject();
    }

    const { bundlePath, bundlePathExists } = this.state;
    if (!bundlePathExists) {
      this.error('bundlePath does not exist', 'bundlePath', bundlePath);
      return;
    }

    enableVideoEffectExtension(this.engine);
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
    this.cleanupVideoEffectObject();
    this.setState({
      beautyEnabled: false,
      filter: 'none',
      filterRelativePath: '',
      styleMakeup: 'none',
      styleMakeupRelativePath: '',
      sticker: '',
      stickerRelativePath: '',
      videoEffectObjectCreated: false,
    });
  };

  private applyBeauty = async () => {
    if (!this.videoEffectObject) {
      return;
    }

    const { beautyTemplate } = this.state;
    if (!beautyTemplate) {
      this.error('beautyTemplate is invalid');
      return;
    }
    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.Beauty,
      beautyTemplate
    );
    if (result !== 0) {
      this.error('applyBeauty failed', 'result', result);
      return;
    }

    this.scheduleSyncBeautyUI();
    this.setState({
      beautyEnabled: true,
      beautyTemplateRelativePath:
        this.state.beautyTemplates.find(
          (template) => template.templateName === beautyTemplate
        )?.relativePath ?? '',
    });
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
    this.syncSavedConfigCache();
  };

  private resetConfig = () => {
    this.videoEffectObject?.performVideoEffectAction(
      VideoEffectNodeId.Beauty,
      VideoEffectAction.Reset
    );
    this.syncSavedConfigCache();
    this.scheduleSyncBeautyUI();
  };

  private syncSavedConfigCache = () => {
    const {
      beautyTemplateRelativePath,
      bundlePath,
      filterRelativePath,
      stickerRelativePath,
      styleMakeupRelativePath,
    } = this.state;

    buildBundleCacheSyncTargets(
      bundlePath,
      [
        beautyTemplateRelativePath,
        styleMakeupRelativePath,
        filterRelativePath,
        stickerRelativePath,
      ]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
    ).forEach(({ cachePath, jsonPath }) => {
      if (!fs.existsSync(jsonPath)) {
        return;
      }
      fs.copyFileSync(jsonPath, cachePath);
    });
  };

  private applyStyleMakeup = (styleMakeup: string) => {
    if (!this.videoEffectObject) {
      return;
    }

    if (!styleMakeup) {
      this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.StyleMakeup);
      this.setState({ styleMakeup, styleMakeupRelativePath: '' });
      return;
    }

    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.StyleMakeup,
      styleMakeup
    );
    if (result !== 0) {
      this.error('applyStyleMakeup failed', 'result', result);
      return;
    }

    buildStyleEffectOperations(
      'style_makeup_option',
      this.state.makeupIntensity
    ).forEach(({ option, key, value }) => {
      this.videoEffectObject?.setVideoEffectFloatParam(
        option,
        key,
        value as number
      );
    });

    this.setState({
      styleMakeup,
      styleMakeupRelativePath:
        this.state.styleMakeupTemplates.find(
          (template) => template.templateName === styleMakeup
        )?.relativePath ?? '',
    });
  };

  private applyFilter = (filter: string) => {
    if (!this.videoEffectObject) {
      return;
    }

    if (!filter) {
      this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.Filter);
      this.setState({ filter, filterRelativePath: '' });
      return;
    }

    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.Filter,
      filter
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
      filterRelativePath:
        this.state.filterTemplates.find(
          (template) => template.templateName === filter
        )?.relativePath ?? '',
    });
  };

  private applySticker = (sticker: string) => {
    if (!this.videoEffectObject) {
      return;
    }

    if (!sticker) {
      this.videoEffectObject.removeVideoEffect(VideoEffectNodeId.Sticker);
      this.setState({ sticker, stickerRelativePath: '' });
      return;
    }

    const result = this.videoEffectObject.addOrUpdateVideoEffect(
      VideoEffectNodeId.Sticker,
      sticker
    );
    if (result !== 0) {
      this.error('applySticker failed', 'result', result);
      return;
    }

    this.setState({
      sticker,
      stickerRelativePath:
        this.state.stickerTemplates.find(
          (template) => template.templateName === sticker
        )?.relativePath ?? '',
    });
  };

  private setVideoEffectParam = (
    kind: 'float' | 'int',
    option: string,
    key: string,
    value: number
  ) => {
    if (!this.videoEffectObject) {
      return;
    }
    if (kind === 'int') {
      this.videoEffectObject.setVideoEffectIntParam(option, key, value);
      return;
    }
    this.videoEffectObject.setVideoEffectFloatParam(option, key, value);
  };

  private scheduleVideoEffectParam = (
    kind: 'float' | 'int',
    option: string,
    key: string,
    value: number,
    delay = 80
  ) => {
    const timerKey = `${kind}:${option}:${key}`;
    const pending = this.pendingParamTimers.get(timerKey);
    if (pending) {
      clearTimeout(pending);
    }
    this.pendingParamTimers.set(
      timerKey,
      setTimeout(() => {
        this.pendingParamTimers.delete(timerKey);
        this.setVideoEffectParam(kind, option, key, value);
      }, delay)
    );
  };

  private commitVideoEffectParam = (
    kind: 'float' | 'int',
    option: string,
    key: string,
    value: number
  ) => {
    const timerKey = `${kind}:${option}:${key}`;
    const pending = this.pendingParamTimers.get(timerKey);
    if (pending) {
      clearTimeout(pending);
      this.pendingParamTimers.delete(timerKey);
    }
    this.setVideoEffectParam(kind, option, key, value);
  };

  private updateSdkBeautyOptions = (
    patch: Partial<SdkDrivenBeautyOptions>,
    option: string,
    key: string,
    value: number,
    kind: 'float' | 'int' = 'float',
    commit = false
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
        if (commit || kind === 'int') {
          this.commitVideoEffectParam(kind, option, key, value);
        } else {
          this.scheduleVideoEffectParam(kind, option, key, value);
        }
      }
    );
  };

  private renderUnitSlider(
    title: string,
    value: number,
    onValueChange: (value: number) => void,
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
          onValueChange={onValueChange}
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
      beautyTemplates,
      bundlePath,
      bundlePathExists,
      filter,
      filterTemplates,
      filterStrength,
      makeupIntensity,
      sdkBeautyOptions,
      sticker,
      stickerTemplates,
      styleMakeup,
      styleMakeupTemplates,
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
              items={beautyTemplates.map((template) => ({
                label: template.label,
                value: template.templateName,
              }))}
              value={beautyTemplate}
              onValueChange={(value) => {
                this.setState(
                  {
                    beautyTemplate: value,
                    beautyTemplateRelativePath:
                      beautyTemplates.find(
                        (template) => template.templateName === value
                      )?.relativePath ?? '',
                    sdkBeautyOptions: this.loadBeautyOptionsFromTemplate(
                      bundlePath,
                      beautyTemplates.find(
                        (template) => template.templateName === value
                      )?.relativePath ?? ''
                    ),
                  },
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
              },
              (value) => {
                this.updateSdkBeautyOptions(
                  { smoothness: value },
                  'beauty_effect_option',
                  'smoothness',
                  value,
                  'float',
                  true
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
              },
              (value) => {
                this.updateSdkBeautyOptions(
                  { lightness: value },
                  'beauty_effect_option',
                  'lightness',
                  value,
                  'float',
                  true
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
              },
              (value) => {
                this.updateSdkBeautyOptions(
                  { redness: value },
                  'beauty_effect_option',
                  'redness',
                  value,
                  'float',
                  true
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
              },
              (value) => {
                this.updateSdkBeautyOptions(
                  { eyePouch: value },
                  'face_buffing_option',
                  'eye_pouch',
                  value,
                  'float',
                  true
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
              onValueChange={(value) => {
                this.updateSdkBeautyOptions(
                  { faceIntensity: value },
                  'face_shape_beauty_option',
                  'intensity',
                  value,
                  'int'
                );
              }}
              onSlidingComplete={(value) => {
                this.updateSdkBeautyOptions(
                  { faceIntensity: value },
                  'face_shape_beauty_option',
                  'intensity',
                  value,
                  'int',
                  true
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
              Style makeup and filters can both be applied. Their visual
              stacking is determined by the bundle and SDK runtime.
            </AgoraText>
            <AgoraDropdown
              title={'Style Makeup Template'}
              items={[
                { label: 'None', value: '' },
                ...styleMakeupTemplates.map((template) => ({
                  label: template.label,
                  value: template.templateName,
                })),
              ]}
              value={styleMakeup}
              onValueChange={(value) => {
                this.applyStyleMakeup(value);
              }}
            />
            {styleMakeup
              ? this.renderUnitSlider(
                  'styleIntensity',
                  makeupIntensity,
                  (value) => {
                    this.setState({ makeupIntensity: value });
                    this.scheduleVideoEffectParam(
                      'float',
                      'style_makeup_option',
                      'styleIntensity',
                      value
                    );
                  },
                  (value) => {
                    this.setState({ makeupIntensity: value });
                    this.commitVideoEffectParam(
                      'float',
                      'style_makeup_option',
                      'styleIntensity',
                      value
                    );
                  }
                )
              : null}

            <AgoraDivider>Filter</AgoraDivider>
            <AgoraDropdown
              title={'Filter Template'}
              items={[
                { label: 'None', value: '' },
                ...filterTemplates.map((template) => ({
                  label: template.label,
                  value: template.templateName,
                })),
              ]}
              value={filter}
              onValueChange={(value) => {
                this.applyFilter(value);
              }}
            />
            {filter
              ? this.renderUnitSlider(
                  'strength',
                  filterStrength,
                  (value) => {
                    this.setState({ filterStrength: value });
                    this.scheduleVideoEffectParam(
                      'float',
                      'filter_effect_option',
                      'strength',
                      value
                    );
                  },
                  (value) => {
                    this.setState({ filterStrength: value });
                    this.commitVideoEffectParam(
                      'float',
                      'filter_effect_option',
                      'strength',
                      value
                    );
                  }
                )
              : null}

            <AgoraDivider>Sticker</AgoraDivider>
            <AgoraDropdown
              title={'Sticker Template'}
              items={[
                { label: 'None', value: '' },
                ...stickerTemplates.map((template) => ({
                  label: template.label,
                  value: template.templateName,
                })),
              ]}
              value={sticker}
              onValueChange={(value) => {
                this.applySticker(value);
              }}
            />
          </>
        ) : null}
      </>
    );
  }
}
