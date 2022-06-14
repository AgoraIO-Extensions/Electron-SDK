declare namespace CreateDataStreamScssNamespace {
  export interface ICreateDataStreamScss {
    msg: string;
    msgList: string;
    toolBarContent: string;
  }
}

declare const CreateDataStreamScssModule: CreateDataStreamScssNamespace.ICreateDataStreamScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateDataStreamScssNamespace.ICreateDataStreamScss;
};

export = CreateDataStreamScssModule;
