import React, { memo } from 'react'
import classnames from 'classnames'
import styles from './style.scss'

const ColorPicker = memo(props => {
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
})

export default ColorPicker