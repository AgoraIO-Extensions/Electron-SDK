import '../AgoraBase';

declare module '../AgoraBase' {
  interface VideoCanvas {
    /**
     * @ignore
     */
    useWebCodecsDecoder?: boolean;
    /**
     * @ignore
     */
    enableFps?: boolean;
  }
}
