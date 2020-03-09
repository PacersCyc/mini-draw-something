import React, { createContext, useReducer, PropsWithChildren, ReactNode, Reducer, Dispatch } from 'react'
import io from 'socket.io-client'
import { RoomItem, Player, PlayerInRoom, PlayerInGame } from '../types/room';

interface ResScore {
  [uid:string]: number 
}

interface GameInfo {
  gameTime: number
  isPainter: boolean
  key: string
  painter: PlayerInGame
  players: PlayerInGame[]
  socketRoom: string
}

interface RoomDataItem {
  id: string
  master: Player
  name:string
  players: PlayerInRoom,
  playersCount: number,
  socketRoom:string
  status:number
  type:number
}

interface ContextState {
  username: string
  uid:string
  socket: SocketIOClient.Socket,
  roomData: RoomDataItem[] | any[],
  currentRoomId: string|undefined|null,
  onlineCount: number,
  gameInfo: GameInfo
}

interface Payload {
  id?: string,
  time?: number,
  [k:string]: any
}

// interface Action2 {
//   type: string
//   payload: {} | GameInfo
// }

type Action = {
  type: 'login',
  payload: {
    uid: string
    username:string
    clientId:string
    currentRoom: string
  }
} | {
  type: 'update_info',
  payload: {
    roomData: RoomDataItem[]
    onlineCount:number
  }
} | {
  type: 'update_user_name',
  payload: {
    username: string
    uid:string
  }
} | {
  type: 'update_room',
  payload: {
    id:string
  }
} | {
  type: 'delete_roomId'
} | {
  type: 'update_game_info',
  payload:GameInfo
} | {
  type: 'update_game_time_data',
  payload: {
    time: number
  }
} | {
  type: 'update_score',
  payload: ResScore
}

let socketURL = process.env.NODE_ENV === 'production' ? 'ws://47.111.244.176:9000' : 'ws://localhost:9000'

const Context: React.Context<null> = createContext(null)

let drawUser = JSON.parse(localStorage.getItem('drawUser') as string)
let initialUsername = (drawUser && drawUser.username) || ''
let initialUid = (drawUser && drawUser.uid) || ''

const initialState = {
  username: initialUsername,
  uid: initialUid,
  socket: io(socketURL),
  roomData: [],
  currentRoomId: null,
  onlineCount: 0,
  gameInfo: {}
}

const reducer = (state:ContextState, action:Action) => {
  const {
    type,
    payload
  } = action

  switch(type) {
    case 'login':
      localStorage.setItem('drawUser', JSON.stringify(payload))
      return {...state, ...payload}
    case 'update_info':
      return {
        ...state,
        ...payload
      }
    case 'update_user_name':
      localStorage.setItem('drawUser', JSON.stringify(payload))
      return {...state, ...payload}
    case 'update_room':
      return {
        ...state,
        currentRoomId: payload!.id
      }
    case 'delete_roomId':
      return {
        ...state,
        currentRoomId: null
      }
    case 'update_game_info':
      return {
        ...state,
        gameInfo: payload
      }
    case 'update_game_time_data':
      let newPlayInfo = {
        ...state.gameInfo,
        // players: payload.players,
        gameTime: payload!.time
      }
      return {
        ...state,
        gameInfo: newPlayInfo
      }
    case 'update_score':
      let newPlayers = state.gameInfo!.players!.map(p => ({
        ...p,
        score: payload![p.uid] || 0
      }))
      return {
        ...state,
        gameInfo: {
          ...state.gameInfo,
          players: newPlayers
        }
      }
    default:
      return state
  }
}

const ContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // console.log(props, state)
  return (
    <Context.Provider
      value={{
        state, 
        dispatch
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export {
  Context,
  ContextProvider
}