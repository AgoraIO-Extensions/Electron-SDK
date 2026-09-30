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
      pushPending={false}
      onCaptureWindowStateChange={jest.fn()}
      onChannelChange={jest.fn()}
      onFrameRateChange={jest.fn()}
      onToggleChannel={jest.fn()}
      onTogglePush={jest.fn()}
      onToggleRightBar={jest.fn()}
      status={{
        state: 'running',
        pushing: true,
        health: 'healthy',
        failureReason: null,
        degradationReasons: [],
        paintCount: 120,
        submittedCount: 118,
        submissionFailureCount: 1,
        workerDrawIntervalsMs: {
          count: 120,
          average: 16.7,
          p50: 16.6,
          p95: 17.2,
          p99: 18,
          max: 20,
        },
        paintIntervalsMs: {
          count: 120,
          average: 33.3,
          p50: 32,
          p95: 40,
          p99: 50,
          max: 60,
        },
        submissionLatencyMs: {
          count: 118,
          average: 2,
          p50: 2,
          p95: 3.5,
          p99: 4,
          max: 5,
        },
        worker: { requestedFrameRate: 30, renderFrameRate: 60 },
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
  expect(markup).toContain('Worker draw: 59.9 fps');
  expect(markup).toContain('Electron paint: 30.0 fps');
  expect(markup).toContain('Paint P95 gap: 40.0 ms');
  expect(markup).toContain('Submission P95: 3.5 ms');
  expect(markup).toContain('Encoded: 110');
  expect(markup).toContain('Video bitrate: 512 Kbps');
  expect(markup).toContain('>停止<');
});

test('shows the start action before pushing begins', () => {
  const markup = renderToStaticMarkup(
    <SharedTexturePocView
      captureWindowState="hidden"
      channelId="customer-channel"
      error=""
      frameRate={30}
      hideRightBar={false}
      lifecycle="joined"
      pushPending={false}
      onCaptureWindowStateChange={jest.fn()}
      onChannelChange={jest.fn()}
      onFrameRateChange={jest.fn()}
      onToggleChannel={jest.fn()}
      onTogglePush={jest.fn()}
      onToggleRightBar={jest.fn()}
      status={null}
    />
  );

  expect(markup).toContain('>开始<');
});
