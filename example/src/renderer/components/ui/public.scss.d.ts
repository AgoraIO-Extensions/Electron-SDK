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
  }
}

declare const PublicScssModule: PublicScssNamespace.IPublicScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PublicScssNamespace.IPublicScss;
};

export = PublicScssModule;
