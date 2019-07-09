import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import App from '../components/App'
import Blocks from '../components/Blocks'
import ConductTransaction from '../components/ConductTransaction'
import TransactionPool from '../components/TransactionPool'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={ history }>
    <Switch>
      <Route exact path='/' component={ App } />
      <Route path='/blocks' component={ Blocks } />
      <Route path='/conduct-transaction' component={ ConductTransaction } />
      <Route path='/transaction-pool' component={ TransactionPool } />
    </Switch>
  </Router>
)

export default AppRouter