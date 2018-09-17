import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

class OrderSummary extends React.Component {
  render() {
    const order = this.props.order
    return (
      <div>
        <h3 className="listHeader center">Order Summary</h3>
        <div>Price: {order.price}</div>
        <div>Quantity: {order.quantity}</div>
        <div>Time Ordered: {order.timeOrdered}</div>
      </div>
    )
  }
}

const ConnectedOrderSummary = withRouter(connect(mapStateToProps)(OrderSummary))
export default ConnectedOrderSummary