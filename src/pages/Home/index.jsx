import React, { useState, useEffect, useContext } from 'react'
import { Modal, InputItem, Toast, Button, Icon } from 'antd-mobile'
import classnames from 'classnames'
import { Context } from '../../context'
import styles from './style.scss'

import Header from '@common/Header'

const prompt = Modal.prompt

const Home = (props) => {

  const { state, dispatch } = useContext(Context)
  const { uid, username, socket, roomData, onlineCount } = state
  const [modalVisible, setModalVisible] = useState(!uid)
  const [inputName, setInputName] = useState('')
  const [changeVisible, setChangeVisible] = useState(false)
  const [changeName, setChangeName] = useState(username)

  const publicRoomData = roomData.filter(room => room.status === 0)
  console.log(roomData, publicRoomData)

  useEffect(() => {
    socket.on('homeInfo', data => {
      console.log(data)
      dispatch({
        type: 'update_info',
        payload: data
      })
    })

    socket.on('login', data => {
      console.log(data)
      dispatch({
        type: 'login',
        payload: data
      })
    })
    socket.on('nameUpdated', data => {
      console.log(data)
      dispatch({
        type: 'update_user_name',
        payload: data
      })
    })
  }, [])

  return (
    <div className={styles.home}>
      <Header
        title="你画我猜-大厅"
        left={<Icon type="search" />}
      />
      <Modal 
        visible={modalVisible}
        title="欢迎进入你画我猜"
        transparent={true}
        footer={[
          {
            text: 'ok',
            onPress: () => {
              console.log(inputName)
              if (!inputName.trim()){
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
        visible={changeVisible}
        title="修改昵称"
        transparent={true}
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
        <ul className={styles.roomList}>
          {
            roomData.map(room => (
              <li className={styles.roomItem} key={room.id}>
                <div className={classnames(styles.roomInfo, {
                  [styles.disableEnter]: room.status === 1
                })}>
                  <span className={styles.roomName}>{room.id}: </span>
                  <span className={styles.roomMaster}>{room.master.username}</span>
                  <span className={styles.roomStatus}>
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
                    onClick={() => {
                      if (room.status === 1) {
                        return
                      }
                      props.history.push(`/room/${room.id}`)
                    }}
                  >
                    加入房间
                  </Button>
                </div>
              </li>
            ))
          }
        </ul>
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