declare namespace ScreenShareScssNamespace {
  export interface IScreenShareScss {
    previewShot: string;
    previewShotBig: string;
  }
}

declare const ScreenShareScssModule: ScreenShareScssNamespace.IScreenShareScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScreenShareScssNamespace.IScreenShareScss;
};

export = ScreenShareScssModule;
