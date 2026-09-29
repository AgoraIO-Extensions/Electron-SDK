import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('electron', () => ({ ipcRenderer: { invoke: jest.fn() } }));
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Table: ({ locale }: any) =>
    require('react').createElement('div', null, locale.emptyText),
}));
jest.mock('../../../config/agora.config', () => ({
  __esModule: true,
  default: {
    appId: 'test-app-id',
    channelId: 'test-channel',
    token: '',
    uid: 0,
    logFilePath: '',
  },
}));
jest.mock('../../../components/ui', () => ({
  AgoraButton: ({ title }: any) => <button>{title}</button>,
  AgoraDivider: () => <hr />,
  AgoraDropdown: ({ title }: any) => <div>{title}</div>,
  AgoraSlider: ({ title }: any) => <div>{title}</div>,
  AgoraStyle: { screen: 'screen', content: 'content', rightBar: 'right' },
  AgoraText: ({ children }: any) => <div>{children}</div>,
  AgoraTextInput: ({ value }: any) => <input value={value} readOnly />,
  AgoraView: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

import LoopbackAudioTrack from './LoopbackAudioTrack';

test('shows the track controls before joining a channel', () => {
  const markup = renderToStaticMarkup(<LoopbackAudioTrack />);

  expect(markup).toContain('Loopback audio tracks');
  expect(markup).toContain('No loopback tracks');
  expect(markup).toContain('Capture source');
  expect(markup).toContain('Volume interval (ms)');
  expect(markup).toContain('Create loopback track');
});
