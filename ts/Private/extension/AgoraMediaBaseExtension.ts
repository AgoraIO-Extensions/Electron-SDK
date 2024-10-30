import '../AgoraMediaBase';

declare module '../AgoraMediaBase' {
  interface VideoFrame {
    /**
     * @ignore
     */
    hasAlphaBuffer?: boolean;
  }
}
