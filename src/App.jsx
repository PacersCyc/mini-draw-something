import React, { lazy, Suspense } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ContextProvider } from './context/index'
require('./iconfont')

import 'antd-mobile/dist/antd-mobile.css'
import styles from './App.scss'
import './assets/styles/icon.css'

function Loading() {
  return (
    <div>loading...</div>
  )
}

// 使用lazy和suspense取代react-loadable
const Home = lazy(() => import('@pages/Home'))
const CreateRoom = lazy(() => import('@pages/CreateRoom'))
const Room = lazy(() => import('@pages/Room'))
const Game = lazy(() => import('@pages/Game'))

function App(props) {

  return (
    <ContextProvider>
      <Router>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/create-room" component={CreateRoom} />
            <Route path="/room/:id" component={Room} />
            <Route path="/game/:id" component={Game} />
          </Switch>
        </Suspense>
      </Router>
    </ContextProvider>
  )
}

export default hot(module)(App)