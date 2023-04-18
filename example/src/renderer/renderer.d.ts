import type { IRtcEngine } from 'agora-electron-sdk';

declare global {
  interface Window {
    agoraRtcEngine?: IRtcEngine;
  }
}
