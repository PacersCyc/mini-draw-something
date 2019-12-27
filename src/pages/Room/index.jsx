import React, { useContext } from 'react'
import { Icon, Button } from 'antd-mobile'
import classnames from 'classnames'
import { Context } from '../../context'
import styles from './style.scss'

import Header from '@common/Header'
console.log(styles)

const MAX_ROOM_MEMBERS_COUNT = 8

const Player = props => {
  const {uid, username, isMaster, isSelf} = props
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
}

const Room = (props) => {
  const { state, dispatch } = useContext(Context)
  const { roomData, currentRoomId, socket, username, uid } = state
  const currentRoom = roomData.find(room => room.id === currentRoomId)
  console.log(currentRoom)

  const len = currentRoom.players.length
  const displayPlayers = len >= MAX_ROOM_MEMBERS_COUNT
    ? currentRoom.players
    : currentRoom.players.concat(new Array(MAX_ROOM_MEMBERS_COUNT - len).fill({}))
  console.log(displayPlayers)

  const allowStart = len >= 2

  const startGame = () => {
    if (!allowStart) {
      return
    }
  }

  const onBack = () => {
    props.history.goBack()
  }

  return (
    <div className={styles.roomWrapper}>
      <Header
        title={currentRoom.name}
        left={<Icon type="left" onClick={onBack} />}
        right={`房间号: ${currentRoom.id}`}
      />

      <div className={styles.playersList}>
        {
          displayPlayers.map((player, index) => (
            <Player 
              key={player.uid || index}
              isMaster={player.uid === currentRoom.master.uid}
              isSelf={player.uid === uid}
              {...player}
            />
          ))
        }
      </div>

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
    </div>
  )
}

export default Room