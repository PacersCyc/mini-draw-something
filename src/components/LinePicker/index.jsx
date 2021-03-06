import React, { memo } from 'react'
import classnames from 'classnames'
import styles from './style.scss'

const LinePicker = memo(props => {
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
})

export default LinePicker