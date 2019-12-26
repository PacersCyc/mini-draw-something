import React from 'react'
import styles from './style.scss'

const Header = (props) => {
  const {
    title
  } = props

  return (
    <div className={styles.headerWrapper}>
      <span></span>
      <span className={styles.title}>{title}</span>
    </div> 
  )
}

export default Header