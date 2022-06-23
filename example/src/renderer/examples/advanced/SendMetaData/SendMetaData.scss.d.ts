declare namespace SendMetaDataScssNamespace {
  export interface ISendMetaDataScss {
    msg: string
    msgList: string
    toolBarContent: string
  }
}

declare const SendMetaDataScssModule: SendMetaDataScssNamespace.ISendMetaDataScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SendMetaDataScssNamespace.ISendMetaDataScss
}

export = SendMetaDataScssModule
