import React from 'react'

import imgSrc from './assets/someone.jpg'
import styles from './App.scss'

function App(props) {
  return (
    <div className={styles.app}>
      app
      <img src={imgSrc} alt=""/>
    </div>
  )
}

export default App