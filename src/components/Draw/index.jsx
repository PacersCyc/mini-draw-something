import React, { memo, useRef, useState, useEffect } from 'react'
import ColorPicker from '../ColorPicker'
import LinePicker from '../LinePicker'
import { COLORS, LINES } from './constant'
import styles from './style.scss'

const Draw = memo(props => {
  const { isPainter, actionData, imageData, sendActionData, sendImageData } = props
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

  const drawImage = (data) => {
    console.log(canvasWidth, canvasHeight)
    let canvasDom = canvasRef.current
    let width = canvasDom.getAttribute('width')
    let height = canvasDom.getAttribute('height')
    console.log(width, height)
    let ctx = canvasRef.current.getContext('2d')
    let img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = data
  }

  const drawAction = data => {
    const { type, data: pos, setting } = data
    const { x, y } = pos

    let ctx = canvasRef.current.getContext('2d')
    ctx.strokeStyle = setting.color
    ctx.lineWidth = setting.lineWidth
    switch (type) {
      case 'start':
        ctx.beginPath()
        ctx.moveTo(x, y)
      case 'move':
        ctx.lineTo(x, y)
        ctx.stroke()
    }
  }

  const setDrawColor = color => {
    setCurrentColor(color)
    setColorPickerVisible(false)
  }

  const changeLineWidth = lineWidth => {
    setCurrentLineWidth(lineWidth)
    setLinePickerVisible(false)
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

  const onTouchStart = e =>{
    const { x, y } = getPos(e)
    let ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentLineWidth
    ctx.moveTo(x, y)

    let sendData = {
      type: 'start',
      data: { x, y },
      setting: {
        color: currentColor,
        lineWidth: currentLineWidth
      }
    }
    sendActionData(sendData)
  }

  const onTouchMove = e => {
    const { x, y } = getPos(e)
    let ctx = canvasRef.current.getContext('2d')
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentLineWidth
    ctx.lineTo(x, y)
    ctx.stroke()

    let sendData = {
      type: 'move',
      data: { x, y },
      setting: {
        color: currentColor,
        lineWidth: currentLineWidth
      }
    }
    sendActionData(sendData)
  }

  const onTouchEnd = e => {
    let ctx = canvasRef.current.getContext('2d')
    ctx.closePath()

    saveDrawData()
  }



  useEffect(() => {
    let canvasDom = canvasRef.current
    let drawWrapperDom = canvasDom.parentElement
    setCanvasWidth(drawWrapperDom.clientWidth)
    setCanvasHeight(drawWrapperDom.clientHeight)
    // canvasDom.setAttribute('width', canvasWidth)
    // canvasDom.setAttribute('height', canvasHeight)
    // console.log(canvasWidth, canvasHeight)
    // console.log(historyIndex, drawHistory)
    saveDrawData()
  }, [])

  useEffect(() => {
    if (!isPainter) {
      drawImage(imageData.dataURL)
    }
  }, [imageData])

  useEffect(() => {
    if (!isPainter && actionData.data) {
      drawAction(actionData)
    }
  }, [actionData])

  useEffect(() => {
    let dataURL = drawHistory[historyIndex]
    if (isPainter) {
      sendImageData({
        dataURL
      })
    }
  }, [drawHistory, historyIndex])

  useEffect(() => {
    setHistoryIndex(drawHistory.length - 1)
  }, [drawHistory])

  useEffect(() => {
    // console.log(canvasWidth, canvasHeight)
    console.log(historyIndex, drawHistory)
    let ctx = canvasRef.current.getContext('2d')
    let data = drawHistory[historyIndex]
    let img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(img, 0, 0)
    }
    img.src = data
    //drawImage(data)

  }, [historyIndex, drawHistory, colorPickerVisible, linePickerVisible])

  return (
    <div className={styles.drawWrapper}>
      <div className={styles.drawingBoard}>
        {
          isPainter &&
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            你浏览器连canvas都不支持还玩啥，洗洗睡吧
          </canvas>
        }
        {
          !isPainter &&
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
          >
            你浏览器连canvas都不支持还玩啥，洗洗睡吧
          </canvas>
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
    </div>
  )
})

export default Draw