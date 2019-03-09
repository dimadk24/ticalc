import React from 'react'
import Raven from 'raven-js'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    const { error } = this.state
    const { children } = this.props
    if (error) {
      return (
        <div style={{ textAlign: 'center' }}>
          <p>Что-то пошло не так :(</p>
          <p>Наша команда уже решает ошибку</p>
        </div>
      )
    }
    return children
  }
}

export default ErrorBoundary
