import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'

import 'antd-mobile/dist/antd-mobile.css'
import styles from './App.scss'

function Loading() {
  return (
    <div>loading...</div>
  )
}

const Home = Loadable({
  loader: () => import('@pages/Home/index.jsx'),
  loading: Loading
})

function App(props) {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact />
      </Switch>
    </Router>
  )
}

export default hot(module)(App)