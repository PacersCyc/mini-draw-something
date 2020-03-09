declare namespace StyleScssModule {
  export interface IStyleScss {
    line: string;
    "line-item": string;
    "line-wrapper": string;
    lineItem: string;
    lineWrapper: string;
    "lines-hidden": string;
    linesHidden: string;
    width: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
