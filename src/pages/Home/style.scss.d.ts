declare namespace StyleScssModule {
  export interface IStyleScss {
    "disable-enter": string;
    disableEnter: string;
    home: string;
    "no-room": string;
    noRoom: string;
    "online-count": string;
    onlineCount: string;
    "player-count": string;
    playerCount: string;
    "room-info": string;
    "room-item": string;
    "room-list": string;
    "room-master": string;
    "room-player": string;
    roomInfo: string;
    roomItem: string;
    roomList: string;
    roomMaster: string;
    roomPlayer: string;
    "user-name": string;
    "user-wrapper": string;
    userName: string;
    userWrapper: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
