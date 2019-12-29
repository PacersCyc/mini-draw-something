import React, { createContext, useReducer } from 'react'
import io from 'socket.io-client'

const Context = createContext()

const initialState = {
  username: JSON.parse(localStorage.getItem('drawUser')|| "{}").username || '',
  uid: JSON.parse(localStorage.getItem('drawUser')|| "{}").uid || '',
  socket: io('ws://localhost:9000'),
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
    case 'update_game_info':
      return {
        ...state,
        gameInfo: payload
      }

    // case 'add_room':
    //   return {
    //     ...state,
    //     currentRoomId: payload.id,
    //     roomData: state.roomData.concat(payload)
    //   }
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