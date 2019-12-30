import React, { useContext, useRef, useEffect, useState, useMemo, useCallback, memo } from 'react'
import { InputItem, Button } from 'antd-mobile'
import classnames from 'classnames'
import { Context } from '../../context'
import styles from './style.scss'

import Header from '@common/Header'
import Draw from '../../components/Draw'


const Game = props => {
  const { state, dispatch } = useContext(Context)
  const { gameInfo, socket, roomData, uid, username } = state
  const { players, key, gameTime, isPainter } = gameInfo
  const [imageData, setImageData] = useState({})
  const [actionData, setActionData] = useState({})
  const [answerWord, setAnswerWord] = useState('')

  const sendActionData = data => {
    socket.emit('drawAction', data)
  }

  const sendImageData = data => {
    socket.emit('imageData', data)
  }

  const sendAnswer = () => {
    setAnswerWord('')
    socket.emit('answer', {
      answer: answerWord,
      answerer: {
        uid,
        username
      }
    })
  }


  useEffect(() => {

    socket.on('imageData', data => {
      console.log(data)
      setImageData(data)
    })

    socket.on('gameData', data => {
      console.log(data)
      
      dispatch({
        type: 'update_game_time_data',
        payload: data
      })
      
    })

    socket.on('drawAction', data => {
      console.log(data)
      setActionData(data)
    })
  }, [])


  return (
    <div className={styles.gameWrapper}>
      <Header
        title="游戏中"
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
                  [styles.me]: p.uid === uid
                })}
              >
                <div className={styles.playerHead}>
                  {p.username[0]}
                  <div className={styles.score}>0分</div>
                </div>
                <div className={styles.playerName}>{p.username}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div >
  )
}

export default Game