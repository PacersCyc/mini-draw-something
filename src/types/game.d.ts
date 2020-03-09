import { PlayerInGame } from './room.d';

export interface DrawActionData {
  type?: string,
  data?: {
    x: number,
    y: number
  },
  setting?: {
    color: string,
    lineWidth: number
  }
}

export interface DrawImageData {
  type?: string;
  dataURL?: string
}
