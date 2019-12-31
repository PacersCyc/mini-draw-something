import { Modal } from 'antd-mobile'

export const disconnectHandle = socket => {
  socket.on('disconnect', () => {
    Modal.alert(
      '阿欧',
      '服务器宕机了，老铁～',
      [
        {
          text: '刷新试试吧',
          onPress: () => {
            window.location.href = '/'
          }
        }
      ]
    )
  })
}