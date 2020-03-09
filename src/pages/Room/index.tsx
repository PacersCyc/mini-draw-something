import React, { memo, useContext, useState, useEffect } from 'react'
import { Icon, Button, InputItem, Toast } from 'antd-mobile'
import classnames from 'classnames'
import { disconnectHandle } from '../../utils/disconnect'
import { Context } from '../../context'
import styles from './style.scss'

import Header from '@common/Header'
import { RouteComponentProps, match } from 'react-router-dom';
import { RoomItemInHome, PlayerInRoom } from 'src/types/room'

interface RoomMatch extends match {
  params: {
    id?: string
  }
}

interface RoomRouteProps extends RouteComponentProps {
  match: RoomMatch
}

interface PlayerProps {
  key: string | number | undefined,
  isSelf: boolean,
  isMaster: boolean,
  uid?: string,
  username?: string,
  clientId?: string,
  status?: number
}

interface ChatMessage {
  message: string,
  isMe: boolean
}

const MAX_ROOM_MEMBERS_COUNT = 8

const Player = memo((props: PlayerProps) => {
  console.log(props)
  const { uid, username, isMaster, isSelf } = props
  const cx = classnames(styles.player, {
    [styles.master]: isMaster,
    [styles.self]: isSelf,
    [styles.empty]: !uid
  })

  return (
    <div className={cx}>
      <div className={styles.playerHeader}>{username ? username[0] : '空'}</div>
      <div className={styles.playerName}>{username || '等待加入'}</div>
    </div>
  )
})

const Room = (props: RoomRouteProps) => {
  console.log(props)
  const { state, dispatch } = useContext(Context)
  const [inputWords, setInputWords] = useState('')
  const [msgList, setMsgList] = useState<Array<ChatMessage>>([])
  const { roomData, socket, username, uid } = state
  console.log(state)
  const currentRoomId = props.match.params.id
  const currentRoom = roomData.find((room: RoomItemInHome) => room.id === currentRoomId)
  // console.log(currentRoom)
  const isMaster = currentRoom.master.uid === uid

  const len = currentRoom.players.length
  const displayPlayers = len >= MAX_ROOM_MEMBERS_COUNT
    ? currentRoom.players
    : currentRoom.players.concat(new Array(MAX_ROOM_MEMBERS_COUNT - len).fill({}))
  // console.log(displayPlayers)

  const allowStart = len >= 2

  const displayMsgList = msgList.filter((item, index) => index <= 7)
  console.log(displayMsgList)

  const startGame = () => {
    if (!allowStart) {
      return
    }

    socket.emit('startGame', currentRoom)
  }

  const onLeft = () => {
    // 离开房间
    socket.emit('leftRoom', {
      player: {
        username,
        uid
      },
      socketRoom: currentRoom.socketRoom,
      roomId: currentRoomId
    })
    // props.history.push('/')
  }

  const sendWords = () => {
    if (!inputWords.trim()) {
      return Toast.info('不能为空哦～', 1)
    }
    socket.emit('chatMessage', {
      player: {
        username,
        uid
      },
      msg: inputWords
    })
    setInputWords('')
  }

  useEffect(() => {
    socket.on('chatMessage', (data: {
      player: {
        username:string,
        uid: string
      },
      msg: string
    }) => {
      // console.log('收到消息了', data)
      const { player, msg } = data
      let message = `${player.username}:  ${msg}`
      let isMe = player.uid === uid
      let msgItem = {
        message,
        isMe
      }

      setMsgList((list: Array<ChatMessage>) => [msgItem].concat(list))
    })

    socket.on('leftRoom', (data: Object) => {
      // console.log('离开房间', data)
      dispatch({
        type: 'delete_roomId'
      })
      props.history.push('/')
    })

    socket.on('startGame', (data: Object) => {
      // console.log('开始游戏', data)
      
      dispatch({
        type: 'update_game_info',
        payload: data
      })
      props.history.push(`/game/${currentRoomId}`)
    })

    disconnectHandle(socket)
  }, [])

  return (
    <div className={styles.roomWrapper}>
      <Header
        title={currentRoom.name}
        left={<Icon type="left" onClick={onLeft} />}
        right={`房间号: ${currentRoomId}`}
      />

      <div className={styles.playersList}>
        {
          displayPlayers.map((player: PlayerInRoom, index: number) => (
            <Player
              key={player.uid || index}
              isMaster={player.uid === currentRoom.master.uid}
              isSelf={player.uid === uid}
              {...player}
            />
          ))
        }
      </div>

      {
        isMaster &&
        <Button
          type="primary"
          disabled={!allowStart}
          style={{
            marginTop: 20
          }}
          onClick={startGame}
        >
          {!allowStart ? '至少两人才能开始游戏' : '开始游戏'}
        </Button>
      }

      <div className={styles.chatWrapper}>
        <InputItem
          clear
          // autoFocus
          placeholder="您说点什么"
          value={inputWords}
          className={styles.chatInput}
          onChange={val => {
            setInputWords(val)
          }}
        />
        <Button
          type="primary"
          inline={true}
          style={{
            borderRadius: 0,
            height: 44,
            lineHeight: '44px'
          }}
          onClick={sendWords}
        >
          发送
        </Button>
      </div>

      <div className={styles.msgWrapper}>
        {
          msgList.length > 0 &&
          <div className={styles.msgList}>
            {
              displayMsgList.map((item, index) => (
                <div 
                  className={classnames(styles.msgItem, {
                    [styles.me]: item.isMe
                  })} 
                  key={index}
                >
                  {item.message}
                </div>
              ))
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Room