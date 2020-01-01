import React, { useContext, useRef, useEffect, useState, useMemo, useCallback, memo } from 'react'
import { Redirect } from 'react-router-dom'
import { InputItem, Button, Modal, Toast } from 'antd-mobile'
import classnames from 'classnames'
import { Context } from '../../context'
import { disconnectHandle } from '../../utils/disconnect'
import styles from './style.scss'

import Header from '@common/Header'
import Draw from '../../components/Draw'


const Game = props => {
  const { state, dispatch } = useContext(Context)
  const { gameInfo, socket, roomData, uid, username } = state
  const { painter, players = [], key, gameTime, isPainter } = gameInfo
  const msgScroll = useRef(null)
  const msgList = useRef(null)
  const interval = useRef(null)
  const [imageData, setImageData] = useState({})
  const [actionData, setActionData] = useState({})
  const [answerWord, setAnswerWord] = useState('')
  const [scrollText, setScrollText] = useState([])
  const [answerModalVisible, setAnswerModalVisible] = useState(false)
  const [scoreModalVisible, setScoreModalVisible] = useState(false)
  const [answer, setAnswer] = useState('')

  const scrollVisible = useMemo(() => scrollText.length > 0, [scrollText])

  const sendActionData = data => {
    socket.emit('drawAction', data)
  }

  const sendImageData = data => {
    socket.emit('imageData', data)
  }

  const sendAnswer = () => {
    if (!answerWord) {
      Toast.info('别这么皮～', 1)
      return
    }
    let gameId = props.match.params.id
    socket.emit('answer', {
      gameId,
      answer: answerWord,
      answerer: {
        uid,
        username
      }
    })
    setAnswerWord('')
  }

  useEffect(() => {
    let msg 
    if (isPainter) {
      msg = '你来画'
    } else {
      msg = `由${painter.username}作画`
    }
    Toast.info(msg, 1)
  }, [painter, isPainter])


  useEffect(() => {

    socket.on('imageData', data => {
      // console.log(data)
      setImageData(data)
    })

    socket.on('gameData', data => {
      // console.log(data)

      dispatch({
        type: 'update_game_time_data',
        payload: data
      })

    })

    socket.on('drawAction', data => {
      // console.log(data)
      setActionData(data)
    })

    socket.on('message', data => {
      // console.log(data)
      const { type, playerName } = data
      let newMessage

      switch (type) {
        case 'answer':
          newMessage = `${playerName}答对了 +${data.score}分`
          break;
        case 'normal':
          newMessage = `${playerName}说: ${data.message}`
          break;
        case 'notify':
          newMessage = `${playerName}${data.message}`
          break;
      }
      if (data.resScore) {
        dispatch({
          type: 'update_score',
          payload: data.resScore
        })
      }

      setScrollText(a => a.concat({
        msg: newMessage,
        type
      }))
    })

    socket.on('timeover', data => {
      // console.log(data)
    })

    socket.on('thisOver', data => {
      // console.log(data)

      setAnswer(data.answer)
      setAnswerModalVisible(true)
      dispatch({
        type: 'update_score',
        payload: data.resScore
      })
    })

    socket.on('nextPlay', data => {
      // console.log('下一轮', data)

      setImageData({
        type: 'next',
        dataURL: ''
      })
      setAnswerModalVisible(false)
      dispatch({
        type: 'update_game_info',
        payload: data
      })
    })

    socket.on('gameover', data => {
      // console.log(data)

      setAnswerModalVisible(false)
      setScoreModalVisible(true)
    })

    disconnectHandle(socket)
  }, [])

  useEffect(() => {
    // console.log(interval.current)
    let msgScrollDom = msgScroll.current
    if (interval.current) {
      if (!scrollText.length) {
        clearInterval(interval.current)
      }
    } else {
      if (scrollText.length) {
        interval.current = setInterval(() => {
          msgScrollDom.scrollLeft++
          if (msgScrollDom.scrollLeft >= msgScrollDom.clientWidth + msgList.current.clientWidth) {
            // console.log(interval.current)
            clearInterval(interval.current)
            interval.current = null // clearInterval没作用要显式置空不知道为什么
            msgScrollDom.scrollLeft = 0
            setScrollText([])
          }
        }, 20)
      }
    }

    return () => {
      clearInterval(interval.current)
      interval.current = null
    }
  }, [scrollText])

  return (
    <div className={styles.gameWrapper}>
      <Header
        // title="游戏中"
        leftClass={styles.leftKey}
        left={
          <div>
            <span>{isPainter ? '请画: ' : '提示: '}</span>
            <span>{key}</span>
          </div>
        }
        right={gameTime}
      />
      {/* 将canvas画板组件单独封装出去，防止游戏信息变更造成组件更新视图打断canvas绘画 */}
      <Draw
        isPainter={isPainter}
        imageData={imageData}
        actionData={actionData}
        sendActionData={sendActionData}
        sendImageData={sendImageData}
      />

      {
        !isPainter &&
        <div className={styles.answerWrapper}>
          <InputItem
            clear
            autoFocus
            className={styles.answerInput}
            placeholder="输入答案哟～"
            value={answerWord}
            onChange={val => {
              setAnswerWord(val)
            }}
          />
          <Button
            type="primary"
            inline={true}
            style={{
              height: 44,
              borderRadius: 0
            }}
            onClick={sendAnswer}
          >
            发送
          </Button>
        </div>
      }

      <div className={styles.playersWrapper}>
        <div className={styles.playersList}>
          {
            players.map(p => (
              <div
                key={p.uid}
                className={classnames(styles.playerItem, {
                  [styles.painter]: p.isPainter,
                  [styles.me]: p.uid === uid,
                  [styles.offline]: p.status === 1
                })}
              >
                <div className={styles.playerHead}>
                  {p.username[0]}
                  <div className={styles.score}>{p.score}分</div>
                </div>
                <div className={styles.playerName}>{p.username}</div>
              </div>
            ))
          }
        </div>
      </div>

      <div
        className={styles.textScrollWrapper}
        ref={msgScroll}
        style={{
          opacity: scrollVisible ? 1 : 0
        }}
      >
        <div className={styles.textAutoScroll}>
          <div className={styles.textList} ref={msgList}>
            {
              scrollText.map(t => (
                <span key={t.msg} className={styles[t.type]}>{t.msg}</span>
              ))
            }
          </div>
        </div>
      </div>

      <Modal 
        title="这轮结束啦"
        transparent
        visible={answerModalVisible}
      >
        <span>答案是: <span className={styles.answerText}>{answer}</span></span>
      </Modal>

      <Modal
        title="游戏结果"
        transparent
        visible={scoreModalVisible}
        footer={[
          {
            text: '返回房间',
            onPress: () => {
              let gameId = props.match.params.id
              props.history.push(`/room/${gameId}`)
            }
          }
        ]}    
      >
        <div>
          {
            players.sort((a, b) => b.score - a.score).map((p, i) => (
              <div key={p.uid}>
                <span>第{i+1}名: </span>
                <span>{p.username}</span>
                <span style={{
                  marginLeft: 8,
                  fontWeight: 'bold'
                }}>
                  {p.score}分
                </span>
              </div>
            ))
          }
        </div>
      </Modal>
    </div >
  )
}

export default Game