import React from 'react'
import styles from './style.scss'

const Header = (props) => {
  const {
    title,
    left,
    right
  } = props

  return (
    <div className={styles.headerWrapper}>
      <span className={styles.headerLeft}>
        {left}
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.headerRight}>{right}</span>
    </div> 
  )
}

export default Header