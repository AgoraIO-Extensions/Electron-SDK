declare namespace CameraAndScreenShareScssNamespace {
  export interface ICameraAndScreenShareScss {
    previewShot: string;
    previewShotBig: string;
  }
}

declare const CameraAndScreenShareScssModule: CameraAndScreenShareScssNamespace.ICameraAndScreenShareScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CameraAndScreenShareScssNamespace.ICameraAndScreenShareScss;
};

export = CameraAndScreenShareScssModule;
