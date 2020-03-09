import React, { memo, useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { Modal, InputItem, Toast, Button, Icon } from 'antd-mobile'
import classnames from 'classnames'
import { Context } from '../../context'
import { disconnectHandle } from '../../utils/disconnect'
import styles from './style.scss'

import Header from '@common/Header'
import { RoomItem, RoomItemInHome } from '../../types/room.d';
import { RouteComponentProps } from 'react-router-dom'

interface RoomListProps {
  list: Array<RoomItemInHome>,
  onEnter: (room: RoomItemInHome) => void
}

const RoomList = memo((props: RoomListProps) => {
  // console.log('roomlist render')
  const { list, onEnter } = props

  return (
    <ul className={styles.roomList}>
      {
        list.map(room => (
          <li className={styles.roomItem} key={room.id}>
            <div className={classnames(styles.roomInfo, {
              [styles.disableEnter]: room.status === 1
            })}>
              <span>{room.id}: </span>
              <span className={styles.roomMaster}>{room.name}</span>
              <span>
                {
                  room.status === 0 ? '准备中' : '游戏中'
                }
              </span>
            </div>
            <div className={styles.roomPlayer}>
              <span className={styles.playerCount}>
                玩家人数: {room.playersCount} / 8
                  </span>
              <Button
                type="primary"
                inline={true}
                size="small"
                disabled={room.status === 1}
                onClick={() => onEnter(room)}
              >
                加入房间
                  </Button>
            </div>
          </li>
        ))
      }
    </ul>
  )
})

const Home = (props: RouteComponentProps) => {
  const { history } = props
  const { state, dispatch } = useContext(Context)
  const { uid, username, socket, roomData, onlineCount } = state
  const [modalVisible, setModalVisible] = useState(!uid)
  const [inputName, setInputName] = useState('')
  const [changeVisible, setChangeVisible] = useState(false)
  const [changeName, setChangeName] = useState(username)
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const publicRoomData = useMemo(() => roomData.filter((room: RoomItemInHome) => room.type === 0), [roomData])
  const onEnter = useCallback(room => {
    console.log('enter')
    if (room.status === 1) {
      return
    }
    socket.emit('enterRoom', {
      player: {
        username,
        uid
      },
      socketRoom: room.socketRoom,
      roomId: room.id
    })
    props.history.push(`/room/${room.id}`)
  }, [socket, uid, username, history])
  // console.log('home render')

  useEffect(() => {
    if (uid) {
      socket.emit('login', {
        uid,
        username
      })
    }

    socket.emit('updateHome')

    socket.on('homeInfo', (data: Object) => {
      // console.log(data)
      dispatch({
        type: 'update_info',
        payload: data
      })
    })

    socket.on('login', (data: Object) => {
      console.log(data)
      dispatch({
        type: 'login',
        payload: data
      })
    })
    socket.on('nameUpdated', (data: Object) => {
      // console.log(data)
      dispatch({
        type: 'update_user_name',
        payload: data
      })
    })

    socket.on('searchRoom', (msg: string) => {
      setSearchModalVisible(false)
      Toast.info(msg, 1)
    })

    socket.on('enterRoom', (data: {id:string}) => {
      // console.log(data)

      dispatch({
        type: 'update_room',
        payload: data
      })
      props.history.push(`/room/${data.id}`)
    })

    disconnectHandle(socket)
  }, [])

  return (
    <div className={styles.home}>
      <Header
        title="你画我猜-大厅"
        left={
          <Icon
            type="search"
            onClick={() => {
              setSearchModalVisible(true)
            }}
          />
        }
      />
      <Modal
        visible={modalVisible}
        title="欢迎进入你画我猜"
        transparent={true}
        maskClosable={true}
        onClose={() => {
          setModalVisible(false)
        }}
        footer={[
          {
            text: 'ok',
            onPress: () => {
              // console.log(inputName)
              if (!inputName.trim()) {
                Toast.info('不能为空哦', 1)
                return
              }
              socket.emit('createUser', {
                name: inputName,
              })
              setModalVisible(false)
            }
          }
        ]}
      >
        <InputItem
          placeholder="请输入游戏昵称"
          value={inputName}
          onChange={val => {
            setInputName(val)
          }}
        />
      </Modal>

      <Modal
        title="寻找房间"
        visible={searchModalVisible}
        transparent
        maskClosable={true}
        onClose={() => {
          setSearchModalVisible(false)
        }}
        footer={[
          {
            text: 'ok',
            onPress: () => {
              if (!searchInput.trim()) {
                Toast.info('不能为空哦', 1)
                return
              }
              socket.emit('searchRoom', {
                roomId: searchInput,
                player: {
                  username,
                  uid
                }
              })
              setSearchModalVisible(false)
            }
          }
        ]}
      >
        <InputItem
          placeholder="输入房间号"
          value={searchInput}
          onChange={val => {
            setSearchInput(val)
          }}
        />
      </Modal>

      <Modal
        visible={changeVisible}
        title="修改昵称"
        transparent={true}
        maskClosable={true}
        onClose={() => {
          setChangeVisible(false)
        }}
        footer={[
          {
            text: 'ok',
            onPress: () => {
              if (!changeName.trim()) {
                Toast.info('不能为空哦')
                return
              }
              socket.emit('updateUserName', {
                name: changeName,
                uid
              })
              setChangeVisible(false)
            }
          }
        ]}
      >
        <InputItem
          placeholder="请输入修改昵称"
          value={changeName}
          onChange={val => {
            setChangeName(val)
          }}
        />
      </Modal>
      {
        username &&
        <div className={styles.userWrapper}>
          <span className={styles.userName}>{username}</span>
          <Button
            type="primary"
            inline={true}
            size="small"
            onClick={() => {
              setChangeVisible(true)
            }}
          >
            修改昵称
          </Button>
        </div>
      }

      {
        !publicRoomData.length &&
        <div className={styles.noRoom}>没人玩啦</div>
      }

      {
        publicRoomData.length > 0 &&
        <RoomList 
          list={publicRoomData}
          onEnter={onEnter}
        />
      }

      <Button
        type="primary"
        style={{
          marginTop: 40,
          marginLeft: 15,
          marginRight: 15
        }}
        onClick={() => {
          props.history.push('/create-room')
        }}
      >
        没有想要的房间？创建一个
      </Button>

      <div className={styles.onlineCount}>
        在线人数: {onlineCount}
      </div>
    </div>
  )
}

export default Home