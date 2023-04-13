import React, { ReactNode } from 'react';

import { AgoraDivider, AgoraStyle, AgoraView } from '../../../components/ui';

interface Props {
  name: string;
  enableVideo: boolean;
  renderConfiguration?: () => ReactNode;
  renderChannel: () => ReactNode;
  renderUsers?: () => ReactNode;
  renderAction?: () => ReactNode;
}

export function BaseComponent({
  name,
  enableVideo,
  renderConfiguration,
  renderChannel,
  renderUsers,
  renderAction,
}: Props) {
  const configuration = renderConfiguration ? renderConfiguration() : undefined;
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>
        {renderUsers ? renderUsers() : undefined}
      </AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        {renderChannel()}
        {configuration ? (
          <>
            <AgoraDivider>The Configuration of {name}</AgoraDivider>
            {configuration}
          </>
        ) : undefined}
        <AgoraDivider />
        {renderAction ? renderAction() : undefined}
      </AgoraView>
    </AgoraView>
  );
}
