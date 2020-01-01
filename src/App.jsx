import React, { lazy, Suspense, useContext } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ContextProvider, Context } from './context/index'
import NotFound from '@pages/NotFound'
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
            {/* <Route path="/" component={Home} exact /> */}
            {/* <Route path="/create-room" component={CreateRoom} />
            <Route path="/room/:id" component={Room} />
            <Route path="/game/:id" component={Game} /> */}
            <RenderRoute path="/" component={Home} exact />
            <RenderRoute path="/create-room" component={CreateRoom} />
            <RenderRoute path="/room/:id" component={Room} />
            <RenderRoute path="/game/:id" component={Game} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </Suspense>
      </Router>
    </ContextProvider>
  )
}

// 统一简单鉴权
function RenderRoute(props) {
  const { state, dispatch } = useContext(Context)
  const { roomData, currentRoomId, gameInfo } = state
  const { path, component, exact, computedMatch, ...rest } = props
  console.log('state', state)
  console.log('props', props)

  const normalRender = () => (
    <Route 
      path={path}
      component={component}
      exact={exact}
      {...rest}
    />
  )

  switch(path) {
    case '/room/:id':
      if(!currentRoomId || !roomData.length) {
        return <Redirect to="/" />
      } else {
        return normalRender()
      }
    case '/game/:id':
      if (!gameInfo.key || !gameInfo.painter || !roomData.find(room => room.id === computedMatch.params.id)) {
        console.log('开始游戏失败')
        return <Redirect to="/" />
      } else {
        return normalRender()
      }
    default:
      return normalRender()
  }
}

export default hot(module)(App)