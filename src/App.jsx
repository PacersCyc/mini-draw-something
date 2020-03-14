import React, { lazy, Suspense, useContext } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ContextProvider, Context } from './context/index'
import NotFound from '@pages/NotFound'
require('./iconfont')

// import 'antd-mobile/dist/antd-mobile.css'
import styles from './App.scss'
import './assets/styles/icon.css'

const BASE_URL = '/mini-draw-something'

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
            <RenderRoute path={`${BASE_URL}/`} component={Home} exact />
            <RenderRoute path={`${BASE_URL}/create-room`} component={CreateRoom} />
            <RenderRoute path={`${BASE_URL}/room/:id`} component={Room} />
            <RenderRoute path={`${BASE_URL}/game/:id`} component={Game} />
            <Route path={`${BASE_URL}/not-found`} component={NotFound} />
            <Redirect to={`${BASE_URL}/not-found`} />
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
  // console.log('state', state)
  // console.log('props', props)

  const normalRender = () => (
    <Route 
      path={path}
      component={component}
      exact={exact}
      {...rest}
    />
  )

  switch(path) {
    case `${BASE_URL}/room/:id`:
      if(!currentRoomId || !roomData.length) {
        return <Redirect to={`${BASE_URL}/`} />
      } else {
        return normalRender()
      }
    case `${BASE_URL}/game/:id`:
      if (!gameInfo.key || !gameInfo.painter || !roomData.find(room => room.id === computedMatch.params.id)) {
        // console.log('进入游戏失败')
        return <Redirect to={`${BASE_URL}/`} />
      } else {
        return normalRender()
      }
    default:
      return normalRender()
  }
}

export default hot(module)(App)