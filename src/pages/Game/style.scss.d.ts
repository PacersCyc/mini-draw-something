declare namespace StyleScssModule {
  export interface IStyleScss {
    answer: string;
    "answer-input": string;
    "answer-text": string;
    "answer-wrapper": string;
    answerInput: string;
    answerText: string;
    answerWrapper: string;
    "game-wrapper": string;
    gameWrapper: string;
    "left-key": string;
    leftKey: string;
    me: string;
    normal: string;
    notify: string;
    offline: string;
    painter: string;
    "player-head": string;
    "player-item": string;
    "player-name": string;
    playerHead: string;
    playerItem: string;
    playerName: string;
    "players-list": string;
    "players-wrapper": string;
    playersList: string;
    playersWrapper: string;
    score: string;
    "text-auto-scroll": string;
    "text-list": string;
    "text-scroll-wrapper": string;
    textAutoScroll: string;
    textList: string;
    textScrollWrapper: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
