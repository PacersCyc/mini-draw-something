declare namespace StyleScssModule {
  export interface IStyleScss {
    "color-hidden": string;
    "color-item": string;
    "color-wrapper": string;
    colorHidden: string;
    colorItem: string;
    colorWrapper: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
