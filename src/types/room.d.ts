export interface Player {
  username: string,
  uid: string,
  clientId: string
}

export interface PlayerInRoom extends Player {
  status: number
}

export interface PlayerInGame extends Player {
  status: number,
  isPainter: boolean,
  score: number
}

export interface RoomItem {
  id: string,
  socketRoom: string,
  name: string,
  status: number,
  type: number
}

export interface RoomItemInHome extends RoomItem {
  master: Player,
  players: Array<PlayerInRoom>,
  playersCount: number
}