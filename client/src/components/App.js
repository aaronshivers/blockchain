import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import logo from '/images/logo.png'

class App extends Component {
  state = { walletInfo: {} }

  async componentDidMount() {

    const res = await fetch(`${ document.location.origin }/api/wallet-info`)
    const json = await res.json()
    this.setState({ walletInfo: json })
  }

  render() {
    const { address, balance } = this.state.walletInfo

    return (
      <div className='App'>
        <img className='logo' src="/images/logo.png" />
        <br />
        <div>
          Welcome to the blockchain...
        </div>
        <br />
        <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
        <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
        <br />
        <div className='WalletInfo'>
          <div>Address: { address }</div>
          <div>Balance: { balance }</div>
        </div>
      </div>
    )
  }
}

export default App
