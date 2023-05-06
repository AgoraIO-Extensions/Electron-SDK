import React, { ReactNode } from 'react';

import { AgoraDivider, AgoraStyle, AgoraView } from '../../../components/ui';

interface Props {
  name: string;
  renderConfiguration?: () => ReactNode;
  renderChannel: () => ReactNode;
  renderUsers?: () => ReactNode;
  renderAction?: () => ReactNode;
}

export function BaseComponent({
  name,
  renderConfiguration,
  renderChannel,
  renderUsers,
  renderAction,
}: Props) {
  const users = renderUsers ? renderUsers() : undefined;
  const configuration = renderConfiguration ? renderConfiguration() : undefined;
  return (
    <AgoraView className={AgoraStyle.screen}>
      <AgoraView className={AgoraStyle.content}>{users}</AgoraView>
      <AgoraView className={AgoraStyle.rightBar}>
        {renderChannel()}
        {configuration ? (
          <>
            <AgoraDivider>{`The Configuration of ${name}`}</AgoraDivider>
            {configuration}
          </>
        ) : undefined}
        <AgoraDivider />
        {renderAction ? renderAction() : undefined}
      </AgoraView>
    </AgoraView>
  );
}
