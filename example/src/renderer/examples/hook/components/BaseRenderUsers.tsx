import React, { ReactElement, memo } from 'react';

import RtcSurfaceView from '../../../components/RtcSurfaceView';
import { AgoraCard, AgoraList, AgoraText } from '../../../components/ui';

export interface BaseRenderUsersProps {
  startPreview?: boolean;
  joinChannelSuccess: boolean;
  remoteUsers: number[];
  renderVideo?: (uid: number) => ReactElement;
}

function BaseRenderUsers({
  startPreview,
  joinChannelSuccess,
  remoteUsers,
  renderVideo = (uid) => (
    <AgoraCard title={`${uid === 0 ? 'Local' : 'Remote'} Uid: ${uid}`}>
      <AgoraText>Click view to mirror</AgoraText>
      <RtcSurfaceView canvas={{ uid }} />
    </AgoraCard>
  ),
}: BaseRenderUsersProps) {
  return (
    <>
      {!!startPreview || joinChannelSuccess ? renderVideo(0) : undefined}
      {!!startPreview || joinChannelSuccess ? (
        <AgoraList
          data={remoteUsers}
          renderItem={(item) => {
            return renderVideo(item);
          }}
        />
      ) : undefined}
    </>
  );
}

export default memo(BaseRenderUsers);
