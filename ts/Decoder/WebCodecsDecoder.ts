export class WebCodecsDecoder {
  // eslint-disable-next-line auto-import/auto-import
  private _decoder: VideoDecoder;
  private _startTime: number | null = null;
  private _frameCount = 0;
  // private frames?: Array<VideoFrame>;

  constructor() {
    // eslint-disable-next-line auto-import/auto-import
    this._decoder = new VideoDecoder({
      output: this._output.bind(this),
      error: this._error.bind(this),
    });
  }

  // eslint-disable-next-line auto-import/auto-import
  _output(frame: VideoFrame) {
    // Update statistics.
    if (this._startTime == null) {
      this._startTime = performance.now();
    } else {
      const elapsed = (performance.now() - this._startTime) / 1000;
      const fps = ++this._frameCount / elapsed;
      console.log('render', `${fps.toFixed(0)} fps`);
    }
    // Schedule the frame to be rendered.
    // renderFrame(frame);
  }

  _error(e: Error) {
    console.error('Decoder error:', e);
  }

  get decoder() {
    return this._decoder;
  }

  // async canDecode(mediaFile: MediaFile): Promise<boolean> {
  //   return mediaFile.file.type === 'video/mp4';
  // }

  // async getFrameData(
  //   mediaFile: MediaFile,
  //   context: DecodeContext
  // ): Promise<VideoFrame | null> {
  //   const perfEntry = this.perf?.start('WebCodecsDecoder.getFrameData');

  //   const timeMcs = msToMcs(frameToMs(context));

  //   if (!this.frames) {
  //     throw new Error('Decoder not initialized');
  //   }

  //   const frame = this.frames.find((f) => {
  //     const diff = Math.abs(f.timestamp! - timeMcs);
  //     return diff < WebCodecsDecoder.MIN_FRAME_TIME_DIFF_MCS;
  //   });

  //   perfEntry?.end();

  //   return frame ?? null;
  // }
}
