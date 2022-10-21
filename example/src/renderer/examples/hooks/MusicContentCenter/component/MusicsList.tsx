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
  musicPlayer: IMusicPlayer;
  musicContentCenter: IMusicContentCenter;
}) => {
  const { musicList, musicContentCenter } = props;
  console.log(musicList);
  useEffect(() => {}, []);

  const preparePlay = (item: Music) => {
    musicContentCenter.preload(item.songCode);
    musicContentCenter.getLyric(item.songCode);
  };

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={musicList}
        renderItem={(item) => (
          <List.Item
            actions={[<Button onClick={() => preparePlay(item)}>play</Button>]}
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
