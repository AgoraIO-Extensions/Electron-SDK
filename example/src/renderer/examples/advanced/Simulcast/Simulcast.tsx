import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  SimulcastConfig,
  StreamLayerConfig,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import { Checkbox, List } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraList,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  checkedSimulcastConfigList: CheckboxValueType[];
  clientRoleType: ClientRoleType;
}

let presetSimulcastConfigList = [
  {
    label: '1920x1080-30fps',
    value: {
      dimensions: {
        width: 1920,
        height: 1080,
      },
      frameRate: 30,
      enable: true,
    },
  },
  {
    label: '1280x720-30fps',
    value: {
      dimensions: {
        width: 1280,
        height: 720,
      },
      frameRate: 30,
      enable: true,
    },
  },
  {
    label: '640x360-15fps',
    value: {
      dimensions: {
        width: 640,
        height: 360,
      },
      frameRate: 15,
      enable: true,
    },
  },
  {
    label: '360x270-15fps',
    value: {
      dimensions: {
        width: 360,
        height: 270,
      },
      frameRate: 15,
      enable: true,
    },
  },
  {
    label: '270x150-5fps',
    value: {
      dimensions: {
        width: 270,
        height: 150,
      },
      frameRate: 5,
      enable: true,
    },
  },
  {
    label: '150x150-5fps',
    value: {
      dimensions: {
        width: 150,
        height: 150,
      },
      frameRate: 5,
      enable: true,
    },
  },
];

export default class Simulcast
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected createState(): State {
    return {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      checkedSimulcastConfigList: [],
      startPreview: false,
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
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    // Start preview before joinChannel
    this.engine.startPreview();
    this.setState({ startPreview: true });
  }

  /**
   * Step 2: joinChannel
   */
  protected joinChannel() {
    const { channelId, token, uid, clientRoleType } = this.state;
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
      clientRoleType,
    });
  }

  /**
   * Step 3: setSimulcastConfig
   */
  setSimulcastConfig = () => {
    const { checkedSimulcastConfigList } = this.state;
    if (checkedSimulcastConfigList.length === 0) {
      this.error('please choose simulcast config');
      return;
    }

    let configs: SimulcastConfig = {
      configs: checkedSimulcastConfigList.map((item) => {
        return item as StreamLayerConfig;
      }),
    };

    this.engine?.setSimulcastConfig(configs);
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

  protected renderUsers(): ReactElement | undefined {
    const { startPreview, joinChannelSuccess, remoteUsers } = this.state;
    return (
      <>
        {!!startPreview || joinChannelSuccess
          ? this.renderUser({
              sourceType: VideoSourceType.VideoSourceCamera,
            })
          : undefined}
        {!!startPreview || joinChannelSuccess ? (
          <AgoraList
            data={remoteUsers ?? []}
            renderItem={(item) =>
              this.renderUser({
                uid: item,
                sourceType: VideoSourceType.VideoSourceRemote,
              })
            }
          />
        ) : undefined}
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const { checkedSimulcastConfigList, clientRoleType } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'clientRoleType'}
          items={enumToItems(ClientRoleType)}
          value={clientRoleType}
          onValueChange={(value) => {
            this.setState({ clientRoleType: value });
          }}
        />
        <AgoraDivider />
        <>
          <p>simulcast config list</p>
          <Checkbox.Group
            style={{ width: '100%' }}
            value={checkedSimulcastConfigList}
            onChange={(checkedValues) => {
              console.log(checkedValues);
              this.setState({
                checkedSimulcastConfigList: checkedValues,
              });
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={presetSimulcastConfigList}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Checkbox value={item.value} />}
                    title={item.label}
                  />
                </List.Item>
              )}
            />
          </Checkbox.Group>
        </>
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    return (
      <>
        <AgoraButton
          title={'setSimulcastConfig'}
          onPress={this.setSimulcastConfig}
        />
      </>
    );
  }
}
