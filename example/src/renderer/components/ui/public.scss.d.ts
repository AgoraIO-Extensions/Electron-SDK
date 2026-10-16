declare namespace PublicScssNamespace {
  export interface IPublicScss {
    card: string;
    content: string;
    require: string;
    rightBar: string;
    hide: string;
    rightBarIcon: string;
    rightBarBig: string;
    screen: string;
    meetRenderContainer: string;
    meetContainer: string;
    meetMain: string;
    meetRight: string;
    meetSurfaceViewContainer: string;
    meetSurfaceViewVideo: string;
    selectedItem: string;
    fillModeVideo: string;
    fillModeView16x9: string;
    fillModeView4x3: string;
    fillModeView21x9: string;
    fillModeView1x1: string;
  }
}

declare const PublicScssModule: PublicScssNamespace.IPublicScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PublicScssNamespace.IPublicScss;
};

export = PublicScssModule;
