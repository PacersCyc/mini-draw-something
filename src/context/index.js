import React, { createContext, useReducer } from 'react'
import io from 'socket.io-client'

let socketURL = process.env.NODE_ENV === 'production' ? 'ws://47.111.244.176:9000' : 'ws://localhost:9000'

const Context = createContext()

let drawUser = JSON.parse(localStorage.getItem('drawUser'))
let initialUsername = (drawUser && drawUser.username) || ''
let initialUid = (drawUser && drawUser.uid) || ''

const initialState = {
  // username: JSON.parse(localStorage.getItem('drawUser')|| "{}").username || '',
  // uid: JSON.parse(localStorage.getItem('drawUser')|| "{}").uid || '',
  username: initialUsername,
  uid: initialUid,
  socket: io(socketURL),
  roomData: [],
  currentRoomId: null,
  onlineCount: 0,
  gameInfo: {}
}

const reducer = (state, action) => {
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
        currentRoomId: payload.id
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
        gameTime: payload.time
      }
      return {
        ...state,
        gameInfo: newPlayInfo
      }
    case 'update_score':
      let newPlayers = state.gameInfo.players.map(p => ({
        ...p,
        score: payload[p.uid] || 0
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

const ContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // console.log(props, state)
  return (
    <Context.Provider
      value={{
        state, dispatch
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