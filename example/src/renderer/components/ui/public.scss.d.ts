declare namespace PublicScssNamespace {
  export interface IPublicScss {
    card: string;
    content: string;
    require: string;
    rightBar: string;
    rightBarBig: string;
    screen: string;
    selectedItem: string;
  }
}

declare const PublicScssModule: PublicScssNamespace.IPublicScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PublicScssNamespace.IPublicScss;
};

export = PublicScssModule;
