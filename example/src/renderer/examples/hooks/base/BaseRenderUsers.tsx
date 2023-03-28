import React, { ReactNode } from 'react';
import { Card, List } from 'antd';

import { AgoraText } from '../../../components/ui';
import RtcSurfaceView from '../../../components/RtcSurfaceView';

export interface BaseRenderUsersProps {
  enableVideo: boolean;
  startPreview?: boolean;
  joinChannelSuccess: boolean;
  remoteUsers: number[];
}

function BaseRenderUsers({
  enableVideo,
  startPreview,
  joinChannelSuccess,
  remoteUsers,
}: BaseRenderUsersProps) {
  const renderVideo = (uid: number): ReactNode => {
    return (
      <List.Item>
        <Card title={`${uid === 0 ? 'Local' : 'Remote'} Uid: ${uid}`}>
          {enableVideo ? (
            <>
              <AgoraText>Click view to mirror</AgoraText>
              <RtcSurfaceView canvas={{ uid }} />
            </>
          ) : undefined}
        </Card>
      </List.Item>
    );
  };
  return (
    <>
      {startPreview || joinChannelSuccess ? (
        <List
          style={{ width: '100%' }}
          grid={
            enableVideo
              ? {
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 1,
                  xl: 1,
                  xxl: 2,
                }
              : {
                  gutter: 16,
                  column: 4,
                }
          }
          dataSource={[0, ...(remoteUsers ?? [])]}
          renderItem={(item) => {
            return renderVideo(item);
          }}
        />
      ) : undefined}
    </>
  );
}

export default BaseRenderUsers;
