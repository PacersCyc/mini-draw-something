import React from 'react'
import { Button } from 'antd-mobile'
import Header from '@common/Header'
import styles from './style.scss'

const NotFound = props => {
  return (
    <div className={styles.notFound}>
      <Header 
        title="404"
      />
      <h1 className={styles.title}>找不到资源</h1>

      <Button
        type="primary"
        onClick={() => {
          props.history.replace('/')
        }}
      >
        回到大厅
      </Button>
    </div>
  )
}

export default NotFound