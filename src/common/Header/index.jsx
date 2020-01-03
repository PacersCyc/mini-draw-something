import React, { memo } from 'react'
import classnames from 'classnames'
import styles from './style.scss'

const Header = memo((props) => {
  const {
    title,
    left,
    right,
    leftClass
  } = props

  return (
    <div className={styles.headerWrapper}>
      <span className={classnames(styles.headerLeft, leftClass)}>
        {left}
      </span>
      {
        title &&
        <span className={styles.title}>{title}</span>
      }   
      <span className={styles.headerRight}>{right}</span>
    </div> 
  )
})

export default Header