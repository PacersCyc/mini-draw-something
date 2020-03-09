declare namespace StyleScssModule {
  export interface IStyleScss {
    "header-left": string;
    "header-right": string;
    "header-wrapper": string;
    headerLeft: string;
    headerRight: string;
    headerWrapper: string;
    title: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
