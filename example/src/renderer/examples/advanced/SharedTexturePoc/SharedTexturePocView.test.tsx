import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

(global as any).window = {
  localStorage: { getItem: jest.fn(() => 'configured-app-id') },
};

jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
}));

jest.mock('@ant-design/icons', () => ({
  LeftOutlined: (props: any) => <button data-control="sidebar" {...props} />,
}));

jest.mock('../../../components/ui', () => ({
  AgoraButton: ({ title }: any) => <button>{title}</button>,
  AgoraDivider: () => <hr />,
  AgoraDropdown: ({ items, title, value }: any) => (
    <div data-control={title}>
      {String(value)} {items.map((item: any) => item.label).join(' ')}
    </div>
  ),
  AgoraStyle: { screen: 'screen', content: 'content', rightBar: 'right' },
  AgoraText: ({ children }: any) => <div>{children}</div>,
  AgoraTextInput: ({ value }: any) => <input value={value} readOnly />,
  AgoraView: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

const { SharedTexturePocView } = require('./SharedTexturePoc');

test('renders pacing controls and the latest stream status', () => {
  const markup = renderToStaticMarkup(
    <SharedTexturePocView
      captureWindowState="hidden"
      channelId="customer-channel"
      error=""
      frameRate={30}
      hideRightBar={false}
      lifecycle="joined"
      onCaptureWindowStateChange={jest.fn()}
      onChannelChange={jest.fn()}
      onFrameRateChange={jest.fn()}
      onToggleChannel={jest.fn()}
      onToggleRightBar={jest.fn()}
      status={{
        state: 'running',
        health: 'healthy',
        failureReason: null,
        degradationReasons: [],
        paintCount: 120,
        submittedCount: 118,
        submissionFailureCount: 1,
        rtc: {
          encodedFrameCount: 110,
          sentFrameRate: 30,
          txVideoKBitRate: 512,
        },
      }}
    />
  );

  expect(markup).toContain('data-control="Frame rate"');
  expect(markup).toContain('48 fps');
  expect(markup).toContain('data-control="Capture window"');
  expect(markup).toContain('healthy');
  expect(markup).toContain('Paint: 120');
  expect(markup).toContain('Submitted: 118');
  expect(markup).toContain('Encoded: 110');
  expect(markup).toContain('Video bitrate: 512 Kbps');
});
