import React, { memo, ReactElement } from 'react';

import { AgoraCard, AgoraList, AgoraText } from '../../../components/ui';
import RtcSurfaceView from '../../../components/RtcSurfaceView';

export interface BaseRenderUsersProps {
  renderVideo?: (uid: number) => ReactElement;
  startPreview?: boolean;
  joinChannelSuccess: boolean;
  remoteUsers: number[];
}

function BaseRenderUsers({
  renderVideo = (uid) => (
    <AgoraCard title={`${uid === 0 ? 'Local' : 'Remote'} Uid: ${uid}`}>
      <AgoraText>Click view to mirror</AgoraText>
      <RtcSurfaceView canvas={{ uid }} />
    </AgoraCard>
  ),
  startPreview,
  joinChannelSuccess,
  remoteUsers,
}: BaseRenderUsersProps) {
  return (
    <>
      {!!startPreview || joinChannelSuccess ? (
        <AgoraList
          data={[0, ...remoteUsers]}
          renderItem={(item) => {
            return renderVideo(item);
          }}
        />
      ) : undefined}
    </>
  );
}

export default memo(BaseRenderUsers);
