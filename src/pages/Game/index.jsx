import React, { useContext, useRef, useEffect, useState, useMemo } from 'react'
import classnames from 'classnames'
import { Context } from '../../context'
import styles from './style.scss'
console.log(styles.leftKey)

import Header from '@common/Header'

const COLORS = [
  '#F44336', '#E91E63', '#9C27B0', '#2196F3', '#48C6FF', '#4CAF50',
  '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#795548', '#607D8B',
  '#000', '#666', '#999', '#BBB', '#DDD', '#FFF'
]
const LINES = [2, 4, 6, 8, 10, 12, 16, 20]

const ColorPicker = props => {
  const { colors, visible, selectColor } = props

  return (
    <div className={classnames(styles.colorWrapper, {
      [styles.colorHidden]: !visible
    })}>
      {
        colors.map(item => (
          <div
            key={item}
            className={styles.colorItem}
            onClick={() => {
              selectColor(item)
            }}
          >
            <span style={{
              backgroundColor: item
            }}></span>
          </div>
        ))
      }
    </div>
  )
}

const LinePicker = props => {
  const { lines, color, visible, selectLineWidth } = props

  return (
    <div className={classnames(styles.lineWrapper, {
      [styles.linesHidden]: !visible
    })}>
      {
        lines.map(item => (
          <div
            key={item}
            className={styles.lineItem}
            onClick={() => {
              selectLineWidth(item)
            }}
          >
            <span className={styles.width}>{item}</span>
            <div
              className={styles.line}
              style={{
                backgroundColor: color,
                height: item
              }}
            ></div>
          </div>
        ))
      }
    </div>
  )
}


const Game = props => {
  const { state, dispatch } = useContext(Context)
  const { gameInfo, socket } = state
  const { players, key, gameTime, isPainter } = gameInfo
  const canvasRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [drawHistory, setDrawHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000')
  const [linePickerVisible, setLinePickerVisible] = useState(false)
  const [currentLineWidth, setCurrentLineWidth] = useState(4)

  const saveDrawData = () => {
    let dataURL = canvasRef.current.toDataURL()
    setDrawHistory(h => h.filter((item, index) => index <= historyIndex).concat(dataURL))
  }

  const setDrawColor = color => {
    setCurrentColor(color)
    setColorPickerVisible(false)
  }

  const changeLineWidth = lineWidth => {
    setCurrentLineWidth(lineWidth)
    setLinePickerVisible(false)
  }

  const getPos = e => {
    let canvasDom = canvasRef.current
    let parentDom = canvasDom
    let touch = e.nativeEvent.touches[0]
    let offsetTop = 0
    let offsetLeft = 0
    while (parentDom) {
      offsetTop += parentDom.offsetTop
      offsetLeft += parentDom.offsetLeft
      parentDom = parentDom.offsetParent
    }
    let x = touch.clientX - offsetLeft
    let y = touch.clientY - offsetTop
    return {
      x,
      y
    }
  }

  const onTouchStart = (e) => {
    const { x, y } = getPos(e)
    let ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentLineWidth
    ctx.moveTo(x, y)
  }

  const onTouchMove = e => {
    const { x, y } = getPos(e)
    let ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const onTouchEnd = e => {
    let ctx = canvasRef.current.getContext('2d')
    ctx.closePath()
    saveDrawData()
  }

  const undo = () => {
    historyIndex > 0 && setHistoryIndex(historyIndex - 1)
  }

  const redo = () => {
    (historyIndex < drawHistory.length - 1) && setHistoryIndex(historyIndex + 1)
  }

  const clearCanvas = () => {
    console.log('clear')
    let canvasDom = canvasRef.current
    let ctx = canvasDom.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    saveDrawData()
  }

  useEffect(() => {
    let canvasDom = canvasRef.current
    let drawWrapperDom = canvasDom.parentElement
    setCanvasWidth(drawWrapperDom.clientWidth)
    setCanvasHeight(drawWrapperDom.clientHeight)
    canvasDom.setAttribute('width', canvasWidth)
    canvasDom.setAttribute('height', canvasHeight)
    console.log(historyIndex, drawHistory)
  })

  useEffect(() => {
    socket.on('imageData', data => {
      console.log(data)
      const { setting, dataURL } = data

      if (!isPainter) {
        let ctx = canvasRef.current.getContext('2d')
        let img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight)
          ctx.drawImage(img, 0, 0)
        }
        img.src = dataURL

        ctx.strokeStyle = setting.color
        ctx.lineWidth = setting.lineWidth
      }
    })

    saveDrawData()
  }, [])

  useEffect(() => {
    let dataURL = drawHistory[historyIndex]
    if (isPainter) {
      socket.emit('imageData', {
        setting: {
          color: currentColor,
          lineWidth: currentLineWidth
        },
        dataURL
      })
    }
  }, [historyIndex])

  useEffect(() => {
    setHistoryIndex(drawHistory.length - 1)
  }, [drawHistory])

  useEffect(() => {
    let ctx = canvasRef.current.getContext('2d')
    let data = drawHistory[historyIndex]
    let img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(img, 0, 0)
    }
    img.src = data
  }, [historyIndex, drawHistory, colorPickerVisible, linePickerVisible])

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

      <div className={styles.drawingBoard}>
        {
          isPainter &&
          <canvas
            ref={canvasRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            你浏览器连canvas都不支持还玩啥，洗洗睡吧
          </canvas>
        }
        {
          !isPainter &&
          <canvas ref={canvasRef}>你浏览器连canvas都不支持还玩啥，洗洗睡吧</canvas>
        }

        {
          isPainter &&
          <ColorPicker
            visible={colorPickerVisible}
            colors={COLORS}
            selectColor={setDrawColor}
          />
        }

        {
          isPainter &&
          <LinePicker
            visible={linePickerVisible}
            lines={LINES}
            color={currentColor}
            selectLineWidth={changeLineWidth}
          />
        }
      </div>

      {
        isPainter &&
        <div className={styles.toolWrapper}>
          <div
            className={styles.toolItem}
            onClick={() => {
              setColorPickerVisible(!colorPickerVisible)
              setLinePickerVisible(false)
            }}
          >
            <div
              className={styles.toolColor}
              style={{
                backgroundColor: currentColor
              }}
            ></div>
          </div>
          <div
            className={styles.toolItem}
            onClick={() => {
              setLinePickerVisible(!linePickerVisible)
              setColorPickerVisible(false)
            }}
          >
            <div
              className={styles.toolLine}
              style={{
                backgroundColor: currentColor,
                height: currentLineWidth
              }}
            ></div>
            <span>{currentLineWidth}</span>
          </div>
          <div className={styles.toolItem} onClick={undo}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconchexiao"></use>
            </svg>
          </div>
          <div className={styles.toolItem} onClick={redo}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconxingzhuang"></use>
            </svg>
          </div>
          <div className={styles.toolItem} onClick={clearCanvas}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconshanchu"></use>
            </svg>
          </div>
        </div>
      }
    </div >
  )
}

export default Game