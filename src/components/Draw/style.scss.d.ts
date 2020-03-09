declare namespace StyleScssModule {
  export interface IStyleScss {
    "draw-wrapper": string;
    drawWrapper: string;
    drawingBoard: string;
    "tool-color": string;
    "tool-item": string;
    "tool-line": string;
    "tool-wrapper": string;
    toolColor: string;
    toolItem: string;
    toolLine: string;
    toolWrapper: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
