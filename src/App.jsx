import React, { lazy, Suspense } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ContextProvider } from './context/index'

import 'antd-mobile/dist/antd-mobile.css'
import styles from './App.scss'

function Loading() {
  return (
    <div>loading...</div>
  )
}

// 使用lazy和suspense取代react-loadable
const Home = lazy(() => import('@pages/Home'))
const CreateRoom = lazy(() => import('@pages/CreateRoom'))
const Room = lazy(() => import('@pages/Room'))

function App(props) {

  return (
    <ContextProvider>
      <Router>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/create-room" component={CreateRoom} />
            <Route path="/room/:id" component={Room} />
          </Switch>
        </Suspense>
      </Router>
    </ContextProvider>
  )
}

export default hot(module)(App)