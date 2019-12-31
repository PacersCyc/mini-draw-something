import React, { useContext, useState, useEffect } from 'react'
import { Icon, InputItem, List, Radio, Toast, Button } from 'antd-mobile'
import { disconnectHandle } from '../../utils/disconnect'
import { Context } from '../../context'
import styles from './style.scss'

import Header from '@common/Header'

const RadioItem = Radio.RadioItem

const roomTypes = [
  {
    value: 0,
    label: '公开'
  },
  {
    value: 1,
    label: '私人(不在大厅显示)'
  }
]

const CreateRoom = props => {
  const { state, dispatch } = useContext(Context)
  const { socket, username, uid } = state
  const [roomName, setRoomName] = useState(`${username}的房间`)
  const [roomType, setRoomType] = useState(0)

  const onBack = () => {
    props.history.goBack()
  }

  const createRoom = () => {
    if (!roomName.trim()) {
      Toast.info('请输入房间名哦～', 1)
      return
    }
    Toast.loading('loading...', 0)
    socket.emit('createRoom', {
      roomName,
      roomType,
      master: {
        username,
        uid
      }
    })
  }

  useEffect(() => {
    socket.on('enterRoom', data => {
      console.log(data)
      // dispatch({
      //   type: 'add_room',
      //   payload: data
      // })
      Toast.hide()
      props.history.push(`/room/${data.id}`)
    })

    disconnectHandle(socket)
  }, [])

  return (
    <div>
      <Header 
        title="创建房间"
        left={<Icon type="left" onClick={onBack}/>}
      />
      <div>
        <InputItem
          autoFocus
          clear
          placeholder="请输入房间名"
          value={roomName}
          onChange={(val) => {
            setRoomName(val)
          }}
        >
          房间名称:
        </InputItem>
      </div>
      <div>
        <List renderHeader={() => '房间类型'}>
          {
            roomTypes.map(item => (
              <RadioItem
                key={item.value}
                checked={item.value === roomType}
                onChange={e => {
                  console.log(e)
                  setRoomType(item.value)
                }}
              >
                {item.label}
              </RadioItem>
            ))
          }
        </List>
      </div>
      <Button 
        type="primary" 
        onClick={createRoom}
        style={{
          marginTop: 40
        }}
      >
        完成
      </Button>
    </div>
  )
}

export default CreateRoom