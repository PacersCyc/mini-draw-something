declare namespace StyleScssModule {
  export interface IStyleScss {
    "chat-input": string;
    "chat-wrapper": string;
    chatInput: string;
    chatWrapper: string;
    empty: string;
    master: string;
    me: string;
    "msg-item": string;
    "msg-list": string;
    "msg-wrapper": string;
    msgItem: string;
    msgList: string;
    msgWrapper: string;
    player: string;
    "player-header": string;
    "player-name": string;
    playerHeader: string;
    playerName: string;
    "players-list": string;
    playersList: string;
    "room-wrapper": string;
    roomWrapper: string;
    self: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
