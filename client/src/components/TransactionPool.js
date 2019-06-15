import React, { Component } from 'react'
import Transaction from './Transaction'
import { Link } from 'react-router-dom'

class TransactionPool extends Component {
  state = { transactionPoolMap: {} }

  fetchTransactionPoolMap = async () => {
    const res = await fetch('http://localhost:3000/api/transaction-pool-map')
    const json = await res.json()
    this.setState({ transactionPoolMap: json })
  }

  componentDidMount() {
    this.fetchTransactionPoolMap()
  }

  render() {
    return (
      <div className='TransactionPool'>
        <div><Link to='/'>Home</Link></div>
        <h3>Transaction Pool</h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction => (
            <div key={ transaction.id }>
              <hr />
              <Transaction transaction={ transaction } />
            </div>
          ))
        }
      </div>
    )
  }
}

export default TransactionPool