import React, { memo } from 'react'
import classnames from 'classnames'
import styles from './style.scss'

interface ColorPickerProps {
  colors: string[],
  visible: boolean,
  selectColor: (color: string)=>void
}

const ColorPicker = memo((props: ColorPickerProps) => {
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