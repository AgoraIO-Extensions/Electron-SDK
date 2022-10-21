import React, { useEffect, useState } from 'react';
import {
  ChannelProfileType,
  ErrorCodeType,
  ClientRoleType,
  createAgoraRtcEngine,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  MusicCollection,
  Music,
  IMusicContentCenter,
  IMusicPlayer,
} from 'agora-electron-sdk';

import { List, Button } from 'antd';
const MusicsList = (props: {
  musicList: Music[];
  preload: any;
  openWithSongCode: any;
}) => {
  const { musicList, preload, openWithSongCode } = props;
  console.log(musicList);
  useEffect(() => {}, []);

  const preparePlay = (item: Music) => {
    preload(item.songCode);
  };

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={musicList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button onClick={() => preparePlay(item)}> preload</Button>,
              <Button onClick={() => openWithSongCode(item.songCode)}>
                play
              </Button>,
            ]}
          >
            <List.Item.Meta title={<div>{item.name}</div>} />
            <div>{item.singer}</div>
          </List.Item>
        )}
      />
    </>
  );
};

export default MusicsList;
